import { supabaseAdmin } from "../lib/supabase";
import SupabaseDB from "../lib/supabase-db";

export type SearchResultSource =
  | "generation_job"
  | "vault_item"
  | "style_guide"
  | "collab_project";

export interface SearchResult {
  id: string;
  source: SearchResultSource;
  title: string;
  description: string;
  type: string;
  category: string;
  status?: string;
  slideCount?: number;
  updatedAt: string;
  url: string;
  tag?: "TRENDING";
  isShared?: boolean;
}

function getCategoryLabel(type?: string | null): string {
  if (!type) return "Document";
  const lower = type.toLowerCase();
  if (lower.includes("presentation") || lower.includes("deck"))
    return "Presentation";
  if (lower.includes("spreadsheet") || lower.includes("sheet"))
    return "Spreadsheet";
  if (lower.includes("chart") || lower.includes("analyzer")) return "Chart";
  if (lower.includes("image")) return "Image";
  if (lower.includes("folder")) return "Folder";
  if (lower.includes("style")) return "Style Guide";
  if (lower.includes("collab")) return "Collab";
  return "Document";
}

function getEditorPath(type: string, id: string): string {
  const lower = type.toLowerCase();
  if (lower.includes("presentation")) return `/presentation-editor?id=${id}`;
  if (lower.includes("chart")) return `/chart-viewer?id=${id}`;
  if (lower.includes("spreadsheet") || lower.includes("sheet"))
    return `/spreadsheet-editor?id=${id}`;
  if (lower.includes("image")) return `/image-editor?id=${id}`;
  return `/docs-editor?id=${id}`;
}

function isTrending(updatedAt: string): boolean {
  const updated = new Date(updatedAt).getTime();
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return updated >= dayAgo;
}

function includesQuery(value: unknown, query: string): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  return value.toLowerCase().includes(query);
}

/** Match against all common title/prompt fields (title column is often empty). */
function jobMatchesQuery(job: Record<string, any>, query: string): boolean {
  const q = query.toLowerCase();
  const input = job.input_data || {};
  const candidates = [
    job.title,
    job.prompt,
    input.title,
    input.prompt,
    input.topic,
    input.objective,
    input.keyMessage,
    input.key_message,
    job.type,
    job.output_type,
  ];
  return candidates.some((c) => includesQuery(c, q));
}

function vaultItemMatchesQuery(item: Record<string, any>, query: string): boolean {
  const q = query.toLowerCase();
  return (
    includesQuery(item.title, q) ||
    includesQuery(item.project, q) ||
    includesQuery(item.status, q)
  );
}

function styleGuideMatchesQuery(guide: Record<string, any>, query: string): boolean {
  return includesQuery(guide.name, query.toLowerCase());
}

function collabMatchesQuery(project: Record<string, any>, query: string): boolean {
  const q = query.toLowerCase();
  return (
    includesQuery(project.name, q) ||
    includesQuery(project.purpose_notes, q)
  );
}

export class SearchService {
  static async search(
    userId: string,
    rawQuery: string,
    limit = 10,
  ): Promise<SearchResult[]> {
    const query = rawQuery.trim();
    if (!query) return [];

    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    const mapGenerationJob = (job: any, isShared = false): SearchResult => {
      const type =
        job.type || job.output_type || job.input_data?.output || "document";
      const title = job.title || job.input_data?.title || "Untitled";
      const updatedAt = job.updated_at || job.created_at;

      return {
        id: job.id,
        source: "generation_job",
        title,
        description:
          job.prompt ||
          job.input_data?.prompt ||
          job.input_data?.objective ||
          `${getCategoryLabel(type)} project`,
        type,
        category: getCategoryLabel(type),
        status: job.status,
        slideCount: job.meta?.slideCount ?? job.input_data?.slideCount,
        updatedAt,
        url: getEditorPath(type, job.id),
        tag: isTrending(updatedAt) ? "TRENDING" : undefined,
        isShared,
      };
    };

    const [ownedJobsRes, vaultItems, styleGuidesRes, collabMembershipRes] =
      await Promise.all([
        supabaseAdmin
          .from("generation_jobs")
          .select(
            "id, title, prompt, type, output_type, input_data, status, created_at, updated_at, cover_image, meta",
          )
          .eq("user_id", userId)
          .neq("status", "DELETED")
          .order("updated_at", { ascending: false })
          .limit(500),

        SupabaseDB.getUserVaultItems(userId).catch(() => []),

        supabaseAdmin
          .from("style_guides")
          .select("id, name, is_completed, updated_at, created_at")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false })
          .limit(100),

        supabaseAdmin
          .from("collab_project_members")
          .select("collab_project_id")
          .eq("user_id", userId),
      ]);

    if (ownedJobsRes.error) {
      console.error("Search: generation_jobs error:", ownedJobsRes.error);
    }

    const ownedMatching = (ownedJobsRes.data || []).filter((job) =>
      jobMatchesQuery(job, q),
    );

    for (const job of ownedMatching) {
      results.push(mapGenerationJob(job, false));
    }

    const ownedIds = new Set(ownedMatching.map((j) => j.id));

    const { data: sharedCollabs } = await supabaseAdmin
      .from("document_collaborators")
      .select("document_id")
      .eq("user_id", userId)
      .eq("status", "accepted")
      .neq("role", "owner");

    const sharedDocIds = (sharedCollabs || []).map((c) => c.document_id);

    if (sharedDocIds.length > 0) {
      const { data: sharedJobs, error: sharedErr } = await supabaseAdmin
        .from("generation_jobs")
        .select(
          "id, title, prompt, type, output_type, input_data, status, created_at, updated_at, cover_image, meta",
        )
        .in("id", sharedDocIds)
        .neq("status", "DELETED");

      if (sharedErr) {
        console.error("Search: shared jobs error:", sharedErr);
      }

      for (const job of sharedJobs || []) {
        if (!ownedIds.has(job.id) && jobMatchesQuery(job, q)) {
          results.push(mapGenerationJob(job, true));
        }
      }
    }

    for (const item of vaultItems || []) {
      if (!vaultItemMatchesQuery(item, q)) continue;

      const type = item.type || "file";
      const updatedAt = item.updated_at || item.created_at;
      const isFolder = type === "folder";

      results.push({
        id: item.id,
        source: "vault_item",
        title: item.title,
        description: item.project
          ? `Vault · ${item.project}`
          : isFolder
            ? "Vault folder"
            : "Vault file",
        type,
        category: item.project || getCategoryLabel(type),
        status: item.status,
        updatedAt,
        url: isFolder
          ? `/vault/folder/${item.id}`
          : `/vault?search=${encodeURIComponent(item.title)}`,
        tag: isTrending(updatedAt) ? "TRENDING" : undefined,
      });
    }

    for (const guide of styleGuidesRes.data || []) {
      if (!styleGuideMatchesQuery(guide, q)) continue;

      const updatedAt = guide.updated_at || guide.created_at;
      results.push({
        id: guide.id,
        source: "style_guide",
        title: guide.name,
        description: guide.is_completed
          ? "Completed brand style guide"
          : "Brand style guide in progress",
        type: "style_guide",
        category: "Style Guide",
        updatedAt,
        url: `/style-guide/${guide.id}`,
        tag: isTrending(updatedAt) ? "TRENDING" : undefined,
      });
    }

    const projectIds = (collabMembershipRes.data || []).map(
      (m) => m.collab_project_id,
    );

    if (projectIds.length > 0) {
      const { data: collabProjects, error: collabErr } = await supabaseAdmin
        .from("collab_projects")
        .select("id, name, purpose_notes, status, updated_at, created_at")
        .in("id", projectIds);

      if (collabErr) {
        console.error("Search: collab_projects error:", collabErr);
      }

      for (const project of collabProjects || []) {
        if (!collabMatchesQuery(project, q)) continue;

        const updatedAt = project.updated_at || project.created_at;
        results.push({
          id: project.id,
          source: "collab_project",
          title: project.name,
          description: project.purpose_notes || "Collaboration workspace",
          type: "collab",
          category: "Collab",
          status: project.status,
          updatedAt,
          url: `/vault/collabs/${project.id}`,
          tag: isTrending(updatedAt) ? "TRENDING" : undefined,
        });
      }
    }

    const ranked = results
      .filter((item, index, arr) => {
        const key = `${item.source}:${item.id}`;
        return arr.findIndex((x) => `${x.source}:${x.id}` === key) === index;
      })
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q) ? 2 : 0;
        const bTitle = b.title.toLowerCase().includes(q) ? 2 : 0;
        if (aTitle !== bTitle) return bTitle - aTitle;
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      })
      .slice(0, limit);

    return ranked;
  }
}
