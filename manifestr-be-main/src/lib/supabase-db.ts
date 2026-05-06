/**
 * Supabase Database Helper
 * Clean interface for all database operations - NO TypeORM!
 */

import { supabase, supabaseAdmin } from "./supabase";
import { EventTrackingService } from "../services/EventTracking.service";

export class SupabaseDB {
  // ===== USERS =====
  static async createUser(userData: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    dob?: string;
    country?: string;
    gender?: string;
    promotional_emails?: boolean;
  }) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        ...userData,
        email_verified: true,
        wins_balance: 100,
        tier: "free",
        onboarding_completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    // PGRST116 = not found (0 rows) - return null instead of throwing
    if (error && error.code === "PGRST116") return null;
    if (error) throw error;
    return data;
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // PGRST116 = not found (0 rows) - return null instead of throwing
    if (error && error.code === "PGRST116") return null;
    if (error) throw error;
    return data;
  }

  static async updateUser(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteUser(id: string) {
    // Delete all user-related data (cascade should handle most)
    // But we'll explicitly delete some tables for safety

    // Delete vault items
    await supabaseAdmin.from("vault_items").delete().eq("user_id", id);

    // Delete style guides
    await supabaseAdmin.from("style_guides").delete().eq("user_id", id);

    // Delete generation jobs
    await supabaseAdmin.from("generation_jobs").delete().eq("user_id", id);

    // Finally delete user
    const { error } = await supabaseAdmin.from("users").delete().eq("id", id);

    if (error) throw error;
    return true;
  }

  // ===== EARLY ACCESS =====
  static async createEarlyAccess(data: {
    first_name: string;
    last_name: string;
    email: string;
  }) {
    const { data: result, error } = await supabaseAdmin
      .from("early_access")
      .insert({ ...data, status: "pending" })
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  static async getEarlyAccessByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from("early_access")
      .select("*")
      .eq("email", email)
      .single();

    // PGRST116 = not found - return null
    if (error && error.code === "PGRST116") return null;
    if (error) throw error;
    return data;
  }

  static async listEarlyAccess() {
    const { data, error } = await supabaseAdmin
      .from("early_access")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  // ===== VAULT ITEMS =====
  static async createVaultItem(
    userId: string,
    itemData: {
      title: string;
      type?: string;
      status?: string;
      project?: string;
      file_key?: string;
      thumbnail_url?: string;
      size?: number;
      parent_id?: string;
      folder_id?: string;
      meta?: any;
    },
  ) {
    const { data, error } = await supabaseAdmin
      .from("vault_items")
      .insert({ user_id: userId, ...itemData })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getVaultItemById(id: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from("vault_items")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserVaultItems(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("vault_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateVaultItem(id: string, userId: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from("vault_items")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteVaultItem(id: string, userId: string) {
    const { error } = await supabaseAdmin
      .from("vault_items")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }

  static async createFolder(userId: string, name: string) {
    const { data, error } = await supabaseAdmin
      .from("folders")
      .insert({
        name,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  static async getFolders(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("folders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  }

  // ===== STYLE GUIDES =====
  static async createStyleGuide(userId: string, name: string) {
    const { data, error } = await supabaseAdmin
      .from("style_guides")
      .insert({
        user_id: userId,
        name,
        is_completed: false,
        current_step: 1,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getStyleGuideById(id: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from("style_guides")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserStyleGuides(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("style_guides")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateStyleGuide(id: string, userId: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from("style_guides")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteStyleGuide(id: string, userId: string) {
    const { error } = await supabaseAdmin
      .from("style_guides")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }

  // ===== GENERATION JOBS =====
  static async createGenerationJob(
    userId: string,
    jobData: {
      type: string;
      input_data: any;
      status?: string;
    },
  ) {
    const { data, error } = await supabaseAdmin
      .from("generation_jobs")
      .insert({
        user_id: userId,
        ...jobData,
        status: jobData.status || "pending",
        progress: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getGenerationJobById(id: string, userId: string) {
    // If userId is 'system', skip user check (for agents)
    if (userId === "system") {
      const { data, error } = await supabaseAdmin
        .from("generation_jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error && error.code === "PGRST116") return null;
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabaseAdmin
      .from("generation_jobs")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") return null;
    if (error) throw error;
    return data;
  }

  static async getUserGenerationJobs(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("generation_jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getProcessingGenerationJobs(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("generation_jobs")
      .select("*")
      .in("status", [
        "processing_intent",
        "processing_layout",
        "processing_content",   
        "processing"
      ])
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateGenerationJob(id: string, userId: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from("generation_jobs")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ===== MOTIVATION QUOTES =====
  static async getRandomMotivationQuote() {
    try {
      // Get random quote (simplified - no is_active check)
      const { data, error } = await supabaseAdmin
        .from("motivation_quotes")
        .select("*")
        .limit(10);

      if (error) {
        return null;
      }

      if (!data || data.length === 0) return null;

      // Return random one from results
      return data[Math.floor(Math.random() * data.length)];
    } catch (err) {
      return null;
    }
  }

  // ===== ADMIN ===== //

  static async getUsersCount(
    since?: string,
    search?: string,
    audienceUserIds?: Set<string> | null,
  ) {
    if (audienceUserIds && audienceUserIds.size === 0) return 0;

    if (!audienceUserIds) {
      let query = supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (since) {
        query = query.gte("created_at", since);
      }

      if (search) {
        query = query.ilike("email", `%${search}%`);
      }

      const { count, error } = await query;

      if (error) throw error;

      return count || 0;
    }

    let total = 0;
    for (const chunk of SupabaseDB.chunkIds([...audienceUserIds], 100)) {
      let query = supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .in("id", chunk);

      if (since) {
        query = query.gte("created_at", since);
      }

      if (search) {
        query = query.ilike("email", `%${search}%`);
      }

      const { count, error } = await query;

      if (error) throw error;

      total += count || 0;
    }

    return total;
  }

  static async getNewUsersLastDays(
    days: number,
    audienceUserIds?: Set<string> | null,
  ) {
    const since = new Date(Date.now() - days * 86400000).toISOString();

    if (audienceUserIds && audienceUserIds.size === 0) return 0;

    if (!audienceUserIds) {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", since);

      if (error) throw error;

      return count || 0;
    }

    let total = 0;
    for (const chunk of SupabaseDB.chunkIds([...audienceUserIds], 100)) {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .in("id", chunk)
        .gte("created_at", since);

      if (error) throw error;

      total += count || 0;
    }

    return total;
  }

  static async getTotalGenerationJobs() {
    const { count, error } = await supabase
      .from("generation_jobs")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  }

  static async getRecentUsers(
    limit = 5,
    since?: string,
    audienceUserIds?: Set<string> | null,
  ) {
    if (audienceUserIds && audienceUserIds.size === 0) return [];

    if (!audienceUserIds) {
      let query = supabase
        .from("users")
        .select("id, email, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (since) {
        query = query.gte("created_at", since);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    }

    const rows: Array<{ id: string; email: string; created_at: string }> = [];
    for (const chunk of SupabaseDB.chunkIds([...audienceUserIds], 100)) {
      let query = supabase
        .from("users")
        .select("id, email, created_at")
        .in("id", chunk)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (since) {
        query = query.gte("created_at", since);
      }

      const { data, error } = await query;

      if (error) throw error;

      (data || []).forEach((u: any) => rows.push(u));
    }

    rows.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return rows.slice(0, limit);
  }

  static async getDAU(
    since?: string,
    audienceUserIds?: Set<string> | null,
  ) {
    if (audienceUserIds && audienceUserIds.size === 0) return 0;

    if (!audienceUserIds) {
      let query = supabase.from("generation_jobs").select("user_id");

      if (since) {
        query = query.gte("created_at", since);
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Set(data.map((d: any) => d.user_id)).size;
    }

    const uniq = new Set<string>();
    for (const chunk of SupabaseDB.chunkIds([...audienceUserIds], 100)) {
      let q = supabase
        .from("generation_jobs")
        .select("user_id")
        .in("user_id", chunk);

      if (since) {
        q = q.gte("created_at", since);
      }

      const { data, error } = await q;

      if (error) throw error;

      (data || []).forEach((d: any) => {
        if (d.user_id) uniq.add(d.user_id);
      });
    }

    return uniq.size;
  }
  static async getMAU(
    since?: string,
    audienceUserIds?: Set<string> | null,
  ) {
    return SupabaseDB.getDAU(since, audienceUserIds);
  }

  static async getUserGrowthMonthly(
    since?: string,
    audienceUserIds?: Set<string> | null,
  ) {
    let query = supabase.from("users").select("id, created_at");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;

    if (error) throw error;

    const map: Record<string, number> = {};

    data.forEach((u: any) => {
      if (audienceUserIds && !audienceUserIds.has(u.id)) return;
      const d = new Date(u.created_at);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;

      map[key] = (map[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(map).sort((a, b) => {
      const [ya, ma] = a.split("-").map(Number);
      const [yb, mb] = b.split("-").map(Number);
      return ya !== yb ? ya - yb : ma - mb;
    });
    const values = sortedKeys.map((k) => map[k]);
    const months = sortedKeys.map((k) => {
      const [y, m] = k.split("-").map(Number);
      const d = new Date(y, m - 1, 1);
      return `${d.toLocaleString("en-US", { month: "short" })} '${String(y).slice(-2)}`;
    });

    return { months, values };
  }

  /** Last 12 calendar months, signup counts per month (for Growth chart). */
  static async getSignupsRolling12Months(): Promise<{
    labels: string[];
    values: number[];
  }> {
    const now = new Date();
    const buckets: { label: string; start: number; end: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      const end = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      ).getTime();
      const label = `${d.toLocaleString("en-US", { month: "short" })} '${String(d.getFullYear()).slice(-2)}`;
      buckets.push({ label, start, end });
    }

    const { data: users, error } = await supabase.from("users").select("created_at");
    if (error) throw error;

    const values = buckets.map(({ start, end }) =>
      (users || []).filter((u: any) => {
        const t = new Date(u.created_at).getTime();
        return t >= start && t <= end;
      }).length,
    );

    return {
      labels: buckets.map((b) => b.label),
      values,
    };
  }

  /**
   * Signups series matched to Growth chart dropdown (daily / weekly / monthly buckets).
   */
  static async getSignupsSeriesForChartRange(
    range: "last_7d" | "last_30d" | "last_90d" | "all_time",
  ): Promise<{ labels: string[]; values: number[] }> {
    if (range === "all_time") {
      return this.getSignupsRolling12Months();
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("created_at");
    if (error) throw error;
    const rows = users || [];
    const ts = (u: any) => new Date(u.created_at).getTime();
    const countInRange = (start: number, end: number) =>
      rows.filter((u: any) => {
        const x = ts(u);
        return x >= start && x < end;
      }).length;

    if (range === "last_7d") {
      const labels: string[] = [];
      const values: number[] = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - i);
        const start = day.getTime();
        const end = start + 86400000;
        labels.push(
          day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        );
        values.push(countInRange(start, end));
      }
      return { labels, values };
    }

    if (range === "last_30d") {
      const labels: string[] = [];
      const values: number[] = [];
      for (let i = 29; i >= 0; i--) {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - i);
        const start = day.getTime();
        const end = start + 86400000;
        labels.push(
          day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        );
        values.push(countInRange(start, end));
      }
      return { labels, values };
    }

    const labels: string[] = [];
    const values: number[] = [];
    for (let w = 12; w >= 0; w--) {
      const endDay = new Date();
      endDay.setHours(0, 0, 0, 0);
      endDay.setDate(endDay.getDate() - w * 7);
      const startDay = new Date(endDay);
      startDay.setDate(startDay.getDate() - 6);
      const start = startDay.getTime();
      const end = endDay.getTime() + 86400000;
      labels.push(
        `${startDay.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}–${endDay.toLocaleDateString("en-US", { day: "numeric" })}`,
      );
      values.push(countInRange(start, end));
    }
    return { labels, values };
  }

  /**
   * Per month: new = user signups in that month; returning = distinct users with a
   * generation job in that month who signed up before the start of that month.
   */
  static async getReturningVsNewRolling12(): Promise<{
    labels: string[];
    newUsers: number[];
    returning: number[];
  }> {
    const now = new Date();
    const monthStarts: Date[] = [];
    const labels: string[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthStarts.push(d);
      labels.push(
        `${d.toLocaleString("en-US", { month: "short" })} '${String(d.getFullYear()).slice(-2)}`,
      );
    }

    const { data: users, error: eu } = await supabase
      .from("users")
      .select("id, created_at");
    if (eu) throw eu;

    const { data: jobs, error: ej } = await supabase
      .from("generation_jobs")
      .select("user_id, created_at");
    if (ej) throw ej;

    const newUsers = Array(12).fill(0);
    const returningSets = Array.from({ length: 12 }, () => new Set<string>());

    const userCreated = new Map(
      (users || []).map((u: any) => [u.id, new Date(u.created_at)]),
    );

    monthStarts.forEach((monthStart, idx) => {
      const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      (users || []).forEach((u: any) => {
        const c = new Date(u.created_at);
        if (c >= monthStart && c <= monthEnd) newUsers[idx]++;
      });

      (jobs || []).forEach((j: any) => {
        const jd = new Date(j.created_at);
        if (jd < monthStart || jd > monthEnd) return;
        const uid = j.user_id as string;
        if (!uid) return;
        const created = userCreated.get(uid);
        if (created && created < monthStart) {
          returningSets[idx].add(uid);
        }
      });
    });

    return {
      labels,
      newUsers,
      returning: returningSets.map((s) => s.size),
    };
  }

  /** Returning vs new buckets aligned to the same chart ranges as signups (no all-time). */
  static async getReturningVsNewForChartRange(
    range: "last_7d" | "last_30d" | "last_90d" | "all_time",
  ): Promise<{
    labels: string[];
    newUsers: number[];
    returning: number[];
  }> {
    if (range === "all_time") {
      return this.getReturningVsNewRolling12();
    }

    const { data: userRows, error: eu } = await supabase
      .from("users")
      .select("id, created_at");
    if (eu) throw eu;
    const { data: jobRows, error: ej } = await supabase
      .from("generation_jobs")
      .select("user_id, created_at");
    if (ej) throw ej;

    const users = userRows || [];
    const jobs = jobRows || [];
    const userCreated = new Map(
      users.map((u: any) => [u.id, new Date(u.created_at)]),
    );
    const ts = (u: any) => new Date(u.created_at).getTime();
    const jt = (j: any) => new Date(j.created_at).getTime();

    const build = (
      buckets: { start: number; end: number; label: string }[],
    ) => {
      const newUsers = buckets.map(({ start, end }) =>
        users.filter((u: any) => {
          const x = ts(u);
          return x >= start && x < end;
        }).length,
      );
      const returning = buckets.map(({ start, end }) => {
        const set = new Set<string>();
        jobs.forEach((j: any) => {
          const x = jt(j);
          if (x < start || x >= end) return;
          const uid = j.user_id as string;
          if (!uid) return;
          const c = userCreated.get(uid);
          if (c && c.getTime() < start) set.add(uid);
        });
        return set.size;
      });
      return {
        labels: buckets.map((b) => b.label),
        newUsers,
        returning,
      };
    };

    if (range === "last_7d") {
      const buckets: { start: number; end: number; label: string }[] = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - i);
        const start = day.getTime();
        const end = start + 86400000;
        buckets.push({
          start,
          end,
          label: day.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        });
      }
      return build(buckets);
    }

    if (range === "last_30d") {
      const buckets: { start: number; end: number; label: string }[] = [];
      for (let i = 29; i >= 0; i--) {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - i);
        const start = day.getTime();
        const end = start + 86400000;
        buckets.push({
          start,
          end,
          label: day.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        });
      }
      return build(buckets);
    }

    const buckets: { start: number; end: number; label: string }[] = [];
    for (let w = 12; w >= 0; w--) {
      const endDay = new Date();
      endDay.setHours(0, 0, 0, 0);
      endDay.setDate(endDay.getDate() - w * 7);
      const startDay = new Date(endDay);
      startDay.setDate(startDay.getDate() - 6);
      const start = startDay.getTime();
      const end = endDay.getTime() + 86400000;
      buckets.push({
        start,
        end,
        label: `${startDay.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}–${endDay.toLocaleDateString("en-US", { day: "numeric" })}`,
      });
    }
    return build(buckets);
  }

  /**
   * Share of users with generation activity in the window who signed up before the window (returning).
   */
  static async getReturningSharePct(days: number): Promise<number> {
    const sinceMs = Date.now() - days * 86400000;
    const sinceIso = new Date(sinceMs).toISOString();
    const windowStart = new Date(sinceMs);

    const { data: jobs, error: ej } = await supabase
      .from("generation_jobs")
      .select("user_id, created_at")
      .gte("created_at", sinceIso);
    if (ej) throw ej;

    const { data: users, error: eu } = await supabase
      .from("users")
      .select("id, created_at");
    if (eu) throw eu;

    const createdMap = new Map(
      (users || []).map((u: any) => [u.id, new Date(u.created_at)]),
    );

    const active = new Set<string>();
    (jobs || []).forEach((j: any) => {
      if (j.user_id) active.add(j.user_id);
    });

    let returning = 0;
    active.forEach((uid) => {
      const c = createdMap.get(uid);
      if (c && c < windowStart) returning++;
    });

    return active.size ? Math.round((returning / active.size) * 100) : 0;
  }

  /** @deprecated Prefer getReturningVsNewRolling12 — kept name for older callers */
  static async getReturningVsNewMonthly(_since?: string) {
    return this.getReturningVsNewRolling12();
  }

  /**
   * v1 per-user health score (same formula as the User Health card).
   */
  private static healthScoreV1ForUser(
    jobsN: number,
    maxJobs: number,
    windowDays: number,
    lastT: number | undefined,
    now: number,
    userCreatedMs: number,
    featN: number,
  ): number {
    const daysSinceJob = lastT
      ? (now - lastT) / 86400000
      : (now - userCreatedMs) / 86400000;

    const sOut = Math.min(1, jobsN / maxJobs);
    const sSession = Math.min(1, jobsN / windowDays / 3);
    let sRec = 0.15;
    if (lastT) {
      if (daysSinceJob <= 3) sRec = 1;
      else if (daysSinceJob <= 14) sRec = 0.75;
      else if (daysSinceJob <= 30) sRec = 0.5;
      else sRec = 0.25;
    }
    const sFeat = Math.min(1, featN / 8);

    const raw =
      0.35 * sSession + 0.3 * sOut + 0.2 * sRec + 0.15 * sFeat;
    return Math.round(Math.min(100, Math.max(0, raw * 100)));
  }

  private static formatLastActiveLabel(lastJobMs: number | undefined, now: number) {
    if (!lastJobMs) return "—";
    const days = Math.floor((now - lastJobMs) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "1d ago";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  /** Mean days since last activity for a lifecycle segment row (table column). */
  private static formatLifecycleSegmentRecency(meanDays: number): string {
    if (!Number.isFinite(meanDays) || meanDays < 0) return "—";
    const d = Math.round(meanDays);
    if (d <= 0) return "0d";
    if (d < 30) return `${d}d`;
    if (d < 365) return `${Math.round(d / 7)}w`;
    return `${Math.round(d / 30)}mo`;
  }

  /**
   * Health distribution + Power Users table using one scoring pass (aligned UI).
   */
  static async getHealthMetricsAndPowerUsers(
    since?: string,
    audienceUserIds?: Set<string> | null,
  ): Promise<{
    healthMetrics: {
      averageScore: number;
      distribution: {
        green: {
          label: string;
          range: string;
          count: number;
          pct: number;
        };
        amber: {
          label: string;
          range: string;
          count: number;
          pct: number;
        };
        red: { label: string; range: string; count: number; pct: number };
      };
    };
    powerUsers: Array<{
      id: string;
      name: string;
      company: string;
      outputsCreated: number;
      sessions: number;
      lastActive: string;
      healthScore: number;
    }>;
  }> {
    let users = await this.getAllUsers(since);
    let jobs = await this.getAllJobs(since);

    if (audienceUserIds) {
      if (audienceUserIds.size === 0) {
        return {
          healthMetrics: {
            averageScore: 0,
            distribution: {
              green: {
                label: "Healthy",
                range: "≥70",
                count: 0,
                pct: 0,
              },
              amber: {
                label: "At Risk",
                range: "40–69",
                count: 0,
                pct: 0,
              },
              red: {
                label: "Critical",
                range: "<40",
                count: 0,
                pct: 0,
              },
            },
          },
          powerUsers: [],
        };
      }
      users = users.filter((u: any) => audienceUserIds!.has(u.id));
      jobs = jobs.filter((j: any) => audienceUserIds!.has(j.user_id));
    }

    let sessionsQuery = supabaseAdmin
      .from("user_sessions")
      .select("user_id, features_used");

    if (since) {
      sessionsQuery = sessionsQuery.gte("started_at", since);
    }

    const { data: sessionRows, error: se } = await sessionsQuery;
    if (se) throw se;

    let sessionRowsUse = sessionRows || [];
    if (audienceUserIds && audienceUserIds.size > 0) {
      sessionRowsUse = sessionRowsUse.filter((row: any) =>
        audienceUserIds.has(row.user_id),
      );
    }

    const jobCount = new Map<string, number>();
    const lastJobAt = new Map<string, number>();
    /** Distinct calendar days with ≥1 job — fallback when user_sessions is empty */
    const activeDaysByUser = new Map<string, Set<string>>();

    (jobs || []).forEach((j: any) => {
      const uid = j.user_id as string;
      if (!uid) return;
      jobCount.set(uid, (jobCount.get(uid) || 0) + 1);
      const t = new Date(j.created_at).getTime();
      const prev = lastJobAt.get(uid);
      if (prev === undefined || t > prev) lastJobAt.set(uid, t);
      const dayKey = new Date(j.created_at).toISOString().slice(0, 10);
      if (!activeDaysByUser.has(uid)) activeDaysByUser.set(uid, new Set());
      activeDaysByUser.get(uid)!.add(dayKey);
    });

    const featuresMax = new Map<string, number>();
    const sessionCount = new Map<string, number>();
    (sessionRowsUse || []).forEach((row: any) => {
      const uid = row.user_id as string;
      if (!uid) return;
      sessionCount.set(uid, (sessionCount.get(uid) || 0) + 1);
      const arr = row.features_used;
      const n = Array.isArray(arr) ? arr.length : 0;
      featuresMax.set(uid, Math.max(featuresMax.get(uid) || 0, n));
    });

    const now = Date.now();
    const windowMs = since
      ? now - new Date(since).getTime()
      : 90 * 86400000;
    const windowDays = Math.max(windowMs / 86400000, 1);

    const counts = [...jobCount.values()];
    const maxJobs = Math.max(...counts, 1);

    /** Cohort signups in window ∪ anyone with activity in window (fixes scores stuck at 0 for older accounts). */
    const candidateIds = [
      ...new Set([
        ...(users || []).map((u: any) => u.id as string),
        ...jobCount.keys(),
      ]),
    ];

    const scoresByUser = new Map<string, number>();
    let userById = new Map<
      string,
      { id: string; email?: string; created_at: string }
    >();

    if (candidateIds.length > 0) {
      const { data: userRecords, error: urErr } = await supabaseAdmin
        .from("users")
        .select("id, email, created_at")
        .in("id", candidateIds);

      if (urErr) throw urErr;

      userById = new Map(
        (userRecords || []).map((u: any) => [u.id as string, u]),
      );

      for (const uid of candidateIds) {
        const u = userById.get(uid);
        if (!u) continue;

        const jobsN = jobCount.get(uid) || 0;
        const lastT = lastJobAt.get(uid);
        const featN = featuresMax.get(uid) || 0;
        const sc = SupabaseDB.healthScoreV1ForUser(
          jobsN,
          maxJobs,
          windowDays,
          lastT,
          now,
          new Date(u.created_at).getTime(),
          featN,
        );
        scoresByUser.set(uid, sc);
      }
    }

    const scores = [...scoresByUser.values()];
    const n = scores.length || 1;
    let green = 0;
    let amber = 0;
    let red = 0;
    scores.forEach((sc) => {
      if (sc >= 70) green++;
      else if (sc >= 40) amber++;
      else red++;
    });

    const avg =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    const pctGreen = Math.round((green / n) * 100);
    const pctAmber = Math.round((amber / n) * 100);
    const pctRed = Math.max(0, 100 - pctGreen - pctAmber);

    const top10 = [...jobCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const powerUsers = top10.map(([userId, count], i) => {
      const sessionRows_n = sessionCount.get(userId) || 0;
      const daysWithJobs = activeDaysByUser.get(userId)?.size || 0;
      const sessionsDisplayed = Math.max(sessionRows_n, daysWithJobs);
      const row = userById.get(userId);

      return {
        id: `u-${i}`,
        name: row?.email || userId,
        company: "N/A",
        outputsCreated: count,
        sessions: sessionsDisplayed,
        lastActive: SupabaseDB.formatLastActiveLabel(
          lastJobAt.get(userId),
          now,
        ),
        healthScore: scoresByUser.get(userId) ?? 0,
      };
    });

    return {
      healthMetrics: {
        averageScore: avg,
        distribution: {
          green: {
            label: "Healthy",
            range: "≥70",
            count: green,
            pct: pctGreen,
          },
          amber: {
            label: "At Risk",
            range: "40–69",
            count: amber,
            pct: pctAmber,
          },
          red: {
            label: "Critical",
            range: "<40",
            count: red,
            pct: pctRed,
          },
        },
      },
      powerUsers,
    };
  }

  /** @deprecated Use getHealthMetricsAndPowerUsers for aligned scores */
  static async getPowerUsers(since?: string) {
    const { powerUsers } = await this.getHealthMetricsAndPowerUsers(since);
    return powerUsers;
  }

  /** Bucket free-text `country` into dashboard regions (share of users %). */
  static regionFromCountry(
    country?: string | null,
  ): "N. America" | "Europe" | "Asia" | "Other" {
    const c = (country || "").trim().toLowerCase();
    if (!c) return "Other";

    const na =
      c === "us" ||
      c === "usa" ||
      c === "u.s." ||
      c === "u.s.a" ||
      c.includes("united states") ||
      c === "canada" ||
      c === "mexico";
    if (na) return "N. America";

    const eu =
      /\b(uk|gb|united kingdom|germany|france|italy|spain|netherlands|belgium|sweden|norway|denmark|finland|ireland|austria|switzerland|poland|portugal|greece)\b/.test(
        c,
      ) ||
      /^(de|fr|it|es|nl|be|se|no|dk|fi|ie|at|ch|pl|pt|gr)\b/.test(c);
    if (eu) return "Europe";

    const asia =
      /\b(india|china|japan|korea|singapore|pakistan|bangladesh|thailand|vietnam|indonesia|philippines|malaysia|uae|saudi|israel)\b/.test(
        c,
      ) || /^(in|cn|jp|kr|sg|pk|bd|th|vn|id|ph|my)\b/.test(c);
    if (asia) return "Asia";

    return "Other";
  }

  static async getUsersByRegion(
    since?: string,
    audienceUserIds?: Set<string> | null,
  ) {
    let query = supabaseAdmin.from("users").select("id, country, created_at");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;
    if (error) throw error;

    const map = {
      "N. America": 0,
      Europe: 0,
      Asia: 0,
      Other: 0,
    };

    data?.forEach((u: any) => {
      if (audienceUserIds && !audienceUserIds.has(u.id)) return;
      const key = SupabaseDB.regionFromCountry(u.country);
      map[key]++;
    });

    const total = data?.length || 1;

    return Object.values(map).map((v) => Math.round((v / total) * 100));
  }

  /** Bucket UTM into Organic / Paid Search / Referral / Direct. */
  static classifySignupSource(
    medium?: string | null,
    source?: string | null,
  ): "Organic" | "Paid Search" | "Referral" | "Direct" {
    const m = (medium || "").toLowerCase().trim();
    const s = (source || "").toLowerCase().trim();
    if (!m && !s) return "Direct";
    if (
      ["cpc", "ppc", "paid", "paidsearch", "paid_search", "display"].some(
        (x) => m.includes(x),
      ) ||
      (s.includes("google") && m.includes("cpc"))
    )
      return "Paid Search";
    if (m.includes("referral") || m.includes("affiliate")) return "Referral";
    if (
      m.includes("organic") ||
      m.includes("seo") ||
      m === "social" ||
      m.includes("email")
    )
      return "Organic";
    if (m.includes("direct")) return "Direct";
    return "Direct";
  }

  /**
   * Acquisition mix from signup analytics events (UTM). Zeros if none tracked.
   * Order: Organic, Paid Search, Referral, Direct — matches dashboard xLabels.
   */
  static async getSignupSourceBreakdown(since?: string): Promise<number[]> {
    let query = supabaseAdmin
      .from("analytics_events")
      .select("utm_medium, utm_source")
      .eq("event_name", "User Signed Up");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;
    if (error) throw error;

    const buckets = {
      Organic: 0,
      "Paid Search": 0,
      Referral: 0,
      Direct: 0,
    };

    (data || []).forEach((row: any) => {
      const k = SupabaseDB.classifySignupSource(row.utm_medium, row.utm_source);
      buckets[k]++;
    });

    const total = Object.values(buckets).reduce((a, b) => a + b, 0);
    if (total === 0) return [0, 0, 0, 0];

    return [
      Math.round((buckets.Organic / total) * 100),
      Math.round((buckets["Paid Search"] / total) * 100),
      Math.round((buckets.Referral / total) * 100),
      Math.round((buckets.Direct / total) * 100),
    ];
  }

  /**
   * Admin AI Feedback chart (Positive / Neutral / Negative), aligned with
   * EventTrackingService (analytics_events: ai_performance/ai_generation vs
   * AI Generation Failed).
   * If no matching events in the window, uses `generation_jobs` status mix instead.
   */
  static async getAiFeedbackOutcomePercents(
    since: string | undefined,
    jobs: Array<{ status?: string | null }>,
  ): Promise<number[]> {
    let qPos = supabaseAdmin
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_category", "ai_performance")
      .eq("event_action", "ai_generation");

    let qNeg = supabaseAdmin
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_name", "AI Generation Failed");

    if (since) {
      qPos = qPos.gte("created_at", since);
      qNeg = qNeg.gte("created_at", since);
    }

    const [{ count: posRaw }, { count: negRaw }] = await Promise.all([
      qPos,
      qNeg,
    ]);

    const p = posRaw ?? 0;
    const n = negRaw ?? 0;

    if (p + n > 0) {
      const denom = p + n;
      const posPct = Math.round((p / denom) * 100);
      const negPct = Math.round((n / denom) * 100);
      const neuPct = Math.max(0, 100 - posPct - negPct);
      return [posPct, neuPct, negPct];
    }

    let completed = 0;
    let failed = 0;
    let neutral = 0;
    for (const j of jobs || []) {
      const s = String(j.status || "").toLowerCase();
      if (s === "completed") completed++;
      else if (s === "failed") failed++;
      else neutral++;
    }

    const t = completed + neutral + failed;
    if (!t) return [0, 0, 0];

    return SupabaseDB.distributeShares([completed, neutral, failed], t);
  }

  /**
   * Reactivation rate over the active window: of users active in [now-days, now],
   * the share whose previous activity was at least 30 days before the window start.
   * Activity = generation_jobs row OR analytics_events login/session_started row.
   */
  static async getReactivationRate(days: number): Promise<{
    rate: number;
    reactivated: number;
    activeUsers: number;
  }> {
    const now = Date.now();
    const windowStart = now - days * 86400000;
    const lookbackStart = windowStart - 60 * 86400000;
    const lookbackIso = new Date(lookbackStart).toISOString();

    const [{ data: jobs, error: ej }, { data: events, error: ee }] =
      await Promise.all([
        supabase
          .from("generation_jobs")
          .select("user_id, created_at")
          .gte("created_at", lookbackIso),
        supabaseAdmin
          .from("analytics_events")
          .select("user_id, created_at")
          .in("event_name", ["User Logged In", "Session Started"])
          .gte("created_at", lookbackIso),
      ]);

    if (ej) throw ej;
    if (ee) throw ee;

    const merged = new Map<string, number[]>();
    const push = (uid: string, t: number) => {
      if (!merged.has(uid)) merged.set(uid, []);
      merged.get(uid)!.push(t);
    };

    (jobs || []).forEach((r: any) => {
      if (!r.user_id) return;
      push(r.user_id, new Date(r.created_at).getTime());
    });
    (events || []).forEach((r: any) => {
      if (!r.user_id) return;
      push(r.user_id, new Date(r.created_at).getTime());
    });

    let activeUsers = 0;
    let reactivated = 0;

    merged.forEach((timestamps) => {
      const inWindow = timestamps.some((t) => t >= windowStart && t <= now);
      if (!inWindow) return;
      activeUsers++;

      const priorWindow = timestamps.filter((t) => t < windowStart);
      if (priorWindow.length === 0) return;
      const lastPrior = Math.max(...priorWindow);
      if (windowStart - lastPrior >= 30 * 86400000) reactivated++;
    });

    const rate = activeUsers
      ? Math.round((reactivated / activeUsers) * 100)
      : 0;

    return { rate, reactivated, activeUsers };
  }

  /**
   * Trailing 12 calendar months: customer churn = users active in M-1 with no
   * activity in M, divided by users active in M-1. Activity = generation_jobs.
   */
  static async getMonthlyCustomerChurnSeries(): Promise<{
    months: string[];
    values: number[];
  }> {
    const now = new Date();
    const monthStarts: Date[] = [];
    const labels: string[] = [];

    for (let i = 12; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthStarts.push(d);
      if (i <= 11) {
        labels.push(d.toLocaleString("en-US", { month: "short" }));
      }
    }

    const earliest = monthStarts[0];
    const earliestIso = earliest.toISOString();

    const { data: jobs, error } = await supabase
      .from("generation_jobs")
      .select("user_id, created_at")
      .gte("created_at", earliestIso);
    if (error) throw error;

    const monthEnd = (start: Date) =>
      new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);

    const activeByMonth: Set<string>[] = monthStarts.map(() => new Set());
    (jobs || []).forEach((j: any) => {
      const uid = j.user_id as string;
      if (!uid) return;
      const t = new Date(j.created_at).getTime();
      monthStarts.forEach((s, idx) => {
        const e = monthEnd(s).getTime();
        if (t >= s.getTime() && t <= e) activeByMonth[idx].add(uid);
      });
    });

    const values: number[] = [];
    for (let i = 1; i < monthStarts.length; i++) {
      const prev = activeByMonth[i - 1];
      const cur = activeByMonth[i];
      if (prev.size === 0) {
        values.push(0);
        continue;
      }
      let lost = 0;
      prev.forEach((uid) => {
        if (!cur.has(uid)) lost++;
      });
      values.push(Math.round((lost / prev.size) * 100));
    }

    return { months: labels, values };
  }

  /** Look up `id, tier, country` for a list of user ids (any signup date). */
  static async getUsersBasicById(
    ids: string[],
  ): Promise<
    Array<{
      id: string;
      tier: string | null;
      country: string | null;
      created_at?: string;
    }>
  > {
    if (!ids || ids.length === 0) return [];
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, tier, country, created_at")
      .in("id", ids);
    if (error) throw error;
    return (data || []) as any[];
  }

  /**
   * UTM source mix for a known set of churned users.
   * Reads `User Signed Up` events filtered by the provided user_ids.
   * Returns labels + percentage values aligned with dashboard xLabels.
   */
  static async getChurnedUserSourceMix(
    churnedUserIds: string[],
  ): Promise<Array<{ label: string; value: number }>> {
    const labels: Array<"Organic" | "Paid Search" | "Referral" | "Direct"> = [
      "Organic",
      "Paid Search",
      "Referral",
      "Direct",
    ];
    if (!churnedUserIds || churnedUserIds.length === 0) {
      return labels.map((l) => ({ label: l, value: 0 }));
    }

    const { data, error } = await supabaseAdmin
      .from("analytics_events")
      .select("user_id, utm_medium, utm_source")
      .eq("event_name", "User Signed Up")
      .in("user_id", churnedUserIds);
    if (error) throw error;

    const seen = new Map<
      string,
      "Organic" | "Paid Search" | "Referral" | "Direct"
    >();
    (data || []).forEach((row: any) => {
      const uid = row.user_id as string;
      if (!uid || seen.has(uid)) return;
      seen.set(
        uid,
        SupabaseDB.classifySignupSource(row.utm_medium, row.utm_source),
      );
    });

    const buckets = {
      Organic: 0,
      "Paid Search": 0,
      Referral: 0,
      Direct: 0,
    };
    seen.forEach((bucket) => {
      buckets[bucket]++;
    });

    const total = Object.values(buckets).reduce((a, b) => a + b, 0);
    if (total === 0) return labels.map((l) => ({ label: l, value: 0 }));

    return labels.map((l) => ({
      label: l,
      value: Math.round((buckets[l] / total) * 100),
    }));
  }

  /**
   * v1 health metrics only (same scoring as User Health card).
   */
  static async computeUserHealthMetrics(since?: string): Promise<{
    averageScore: number;
    distribution: {
      green: { label: string; range: string; count: number; pct: number };
      amber: { label: string; range: string; count: number; pct: number };
      red: { label: string; range: string; count: number; pct: number };
    };
  }> {
    const { healthMetrics } = await this.getHealthMetricsAndPowerUsers(since);
    return healthMetrics;
  }
  static async getAllUsers(since?: string) {
    let query = supabase.from("users").select("*");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  static async getAllJobs(since?: string) {
    let query = supabase.from("generation_jobs").select("*");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  /** Jobs with `created_at` in [startIso, endIsoExclusive). */
  static async getJobsInRange(startIso: string, endIsoExclusive?: string) {
    let query = supabase
      .from("generation_jobs")
      .select("user_id, created_at, status")
      .gte("created_at", startIso);
    if (endIsoExclusive) {
      query = query.lt("created_at", endIsoExclusive);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Array<{
      user_id: string;
      created_at: string;
      status?: string | null;
    }>;
  }

  /**
   * Sessions started in [startIso, endIsoExclusive).
   * Rows come from `user_sessions` (EventTracking.trackSessionStart / endSession).
   */
  static async getSessionsInRange(startIso: string, endIsoExclusive?: string) {
    let query = supabaseAdmin
      .from("user_sessions")
      .select(
        "user_id, started_at, ended_at, last_activity_at, duration_seconds",
      )
      .gte("started_at", startIso);
    if (endIsoExclusive) {
      query = query.lt("started_at", endIsoExclusive);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Array<{
      user_id: string;
      started_at: string;
      ended_at?: string | null;
      last_activity_at?: string | null;
      duration_seconds?: number | null;
    }>;
  }

  /** Earliest `generation_jobs.created_at` per user (all history). */
  static async getFirstJobTimestampMsByUserIds(
    ids: string[],
  ): Promise<Map<string, number>> {
    const out = new Map<string, number>();
    if (!ids.length) return out;
    for (const chunk of SupabaseDB.chunkIds(ids, 100)) {
      const { data, error } = await supabaseAdmin
        .from("generation_jobs")
        .select("user_id, created_at")
        .in("user_id", chunk);
      if (error) throw error;
      for (const row of data || []) {
        const uid = row.user_id as string;
        if (!uid) continue;
        const t = new Date(row.created_at as string).getTime();
        const prev = out.get(uid);
        if (prev === undefined || t < prev) out.set(uid, t);
      }
    }
    return out;
  }

  private static computeProductUsageSnapshot(
    jobs: Array<{ user_id: string; status?: string | null }>,
    sessions: Array<{
      user_id: string;
      started_at: string;
      ended_at?: string | null;
      last_activity_at?: string | null;
      duration_seconds?: number | null;
    }>,
    firstJobMs: Map<string, number>,
    userCreatedMs: Map<string, number>,
    windowDays: number,
  ): {
    outputsPerUser: number;
    avgTimeToFirst: number;
    sessionFreqPerMo: number;
    avgDurMin: number;
    completionRate: number;
    abandonmentRate: number;
  } {
    const jobUsers = new Set<string>();
    for (const j of jobs) {
      if (j.user_id) jobUsers.add(j.user_id as string);
    }
    const nJobUsers = jobUsers.size;
    const outputsPerUser = nJobUsers > 0 ? jobs.length / nJobUsers : 0;

    const timeDiffsH: number[] = [];
    for (const uid of jobUsers) {
      const firstMs = firstJobMs.get(uid);
      const created = userCreatedMs.get(uid);
      if (firstMs != null && created != null) {
        const h = (firstMs - created) / (1000 * 60 * 60);
        if (h >= 0) timeDiffsH.push(h);
      }
    }
    const avgTimeToFirst =
      timeDiffsH.length > 0
        ? timeDiffsH.reduce((a, b) => a + b, 0) / timeDiffsH.length
        : 0;

    const sessionUserIds = new Set<string>();
    for (const s of sessions) {
      if (s.user_id) sessionUserIds.add(s.user_id as string);
    }
    const nSessUsers = sessionUserIds.size;
    const wd = Math.max(windowDays, 1);
    const sessionFreqPerMo =
      nSessUsers > 0 ? (sessions.length / nSessUsers) * (30 / wd) : 0;

    let durSumSec = 0;
    let durN = 0;
    for (const s of sessions) {
      let sec =
        typeof s.duration_seconds === "number" && s.duration_seconds > 0
          ? s.duration_seconds
          : null;
      if (sec == null) {
        const t0 = new Date(s.started_at).getTime();
        const endStr = s.ended_at || s.last_activity_at;
        const t1 = endStr ? new Date(endStr).getTime() : t0;
        sec = Math.max(0, (t1 - t0) / 1000);
      }
      if (sec > 0 && sec < 86400 * 6) {
        durSumSec += sec;
        durN++;
      }
    }
    const avgDurMin = durN > 0 ? durSumSec / durN / 60 : 0;

    const total = jobs.length;
    const completed = jobs.filter(
      (j) => String(j.status || "").toLowerCase() === "completed",
    ).length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const abandonmentRate = total > 0 ? 100 - completionRate : 0;

    return {
      outputsPerUser,
      avgTimeToFirst,
      sessionFreqPerMo,
      avgDurMin,
      completionRate,
      abandonmentRate,
    };
  }

  /**
   * Core Product Usage KPIs for current vs prior window (same length as `days`).
   * Sessions: `user_sessions` (EventTracking). Jobs: `generation_jobs`.
   */
  static async getProductUsageCoreKpis(days: number): Promise<{
    current: {
      outputsPerUser: number;
      avgTimeToFirst: number;
      sessionFreqPerMo: number;
      avgDurMin: number;
      completionRate: number;
      abandonmentRate: number;
    };
    previous: {
      outputsPerUser: number;
      avgTimeToFirst: number;
      sessionFreqPerMo: number;
      avgDurMin: number;
      completionRate: number;
      abandonmentRate: number;
    };
  }> {
    const now = Date.now();
    const windowMs = days * 86400000;
    const currStartIso = new Date(now - windowMs).toISOString();
    const prevStartIso = new Date(now - 2 * windowMs).toISOString();

    const [jobsC, jobsP, sessC, sessP] = await Promise.all([
      SupabaseDB.getJobsInRange(currStartIso),
      SupabaseDB.getJobsInRange(prevStartIso, currStartIso),
      SupabaseDB.getSessionsInRange(currStartIso),
      SupabaseDB.getSessionsInRange(prevStartIso, currStartIso),
    ]);

    const uids = [
      ...new Set(
        [...jobsC, ...jobsP]
          .map((j) => j.user_id)
          .filter(Boolean),
      ),
    ] as string[];

    const [firstJobMs, userRows] = await Promise.all([
      uids.length ? SupabaseDB.getFirstJobTimestampMsByUserIds(uids) : Promise.resolve(new Map<string, number>()),
      uids.length ? SupabaseDB.getUsersBasicById(uids) : Promise.resolve([]),
    ]);

    const userCreatedMs = new Map<string, number>();
    for (const u of userRows || []) {
      const row = u as { id: string; created_at?: string };
      if (row.created_at) {
        userCreatedMs.set(row.id, new Date(row.created_at).getTime());
      }
    }

    const windowDays = Math.max(days, 1);
    const current = SupabaseDB.computeProductUsageSnapshot(
      jobsC,
      sessC,
      firstJobMs,
      userCreatedMs,
      windowDays,
    );
    const previous = SupabaseDB.computeProductUsageSnapshot(
      jobsP,
      sessP,
      firstJobMs,
      userCreatedMs,
      windowDays,
    );

    return { current, previous };
  }

  private static readonly PRODUCT_USAGE_MONTH_ABBR = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ] as const;

  private static padChartRange(
    min: number,
    max: number,
    floorZero = true,
  ): { min: number; max: number } {
    let lo = Number.isFinite(min) ? min : 0;
    let hi = Number.isFinite(max) ? max : 1;
    if (hi <= lo) hi = lo + (lo === 0 ? 1 : Math.abs(lo) * 0.1 || 0.1);
    const span = hi - lo;
    const p = Math.max(span * 0.12, span * 0.05, 0.01);
    lo = floorZero ? Math.max(0, lo - p) : lo - p;
    hi = hi + p;
    return { min: lo, max: hi };
  }

  private static chartYTickLabels(lo: number, hi: number, steps: number): string[] {
    const n = Math.max(2, steps);
    const out: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const v = lo + ((hi - lo) * i) / (n - 1);
      const rounded = Math.round(v * 100) / 100;
      out.push(
        Math.abs(rounded - Math.round(rounded)) < 0.001 && rounded >= 10
          ? String(Math.round(rounded))
          : rounded.toFixed(1).replace(/\.0$/, ""),
      );
    }
    return out;
  }

  /**
   * Rolling 12-month series for Product Usage charts (jobs + user_sessions
   * populated by EventTracking). Time-to-first chart: cumulative % of users
   * (with jobs in window) whose first output occurred within each threshold.
   */
  static async getProductUsageChartSeries(): Promise<{
    monthLabels: string[];
    outputsPerUser: number[];
    sessionFreqPerUser: number[];
    sessionDurationMins: number[];
    decksYMin: number;
    decksYMax: number;
    decksYLabels: string[];
    sessFreqYMin: number;
    sessFreqYMax: number;
    sessFreqYLabels: string[];
    sessDurYMin: number;
    sessDurYMax: number;
    sessDurYLabels: string[];
    timeToFirstCdf: number[];
  }> {
    const now = new Date();
    const startFirst = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const startIso = startFirst.toISOString();

    const [{ data: jobData, error: ej }, { data: sessData, error: es }] =
      await Promise.all([
        supabase
          .from("generation_jobs")
          .select("user_id, created_at")
          .gte("created_at", startIso),
        supabaseAdmin
          .from("user_sessions")
          .select(
            "user_id, started_at, ended_at, last_activity_at, duration_seconds",
          )
          .gte("started_at", startIso),
      ]);

    if (ej) throw ej;
    if (es) throw es;

    const jobs = jobData || [];
    const sessions = sessData || [];

    const monthLabels: string[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(startFirst.getFullYear(), startFirst.getMonth() + i, 1);
      monthLabels.push(
        `${SupabaseDB.PRODUCT_USAGE_MONTH_ABBR[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`,
      );
    }

    const jobBuckets = Array.from({ length: 12 }, () => ({
      total: 0,
      users: new Set<string>(),
    }));

    for (const row of jobs) {
      const jd = new Date((row as any).created_at as string);
      const idx =
        (jd.getFullYear() - startFirst.getFullYear()) * 12 +
        (jd.getMonth() - startFirst.getMonth());
      if (idx < 0 || idx >= 12) continue;
      jobBuckets[idx].total++;
      const uid = (row as any).user_id as string | undefined;
      if (uid) jobBuckets[idx].users.add(uid);
    }

    const outputsPerUser = jobBuckets.map((b) =>
      b.users.size > 0 ? b.total / b.users.size : 0,
    );

    const sessBuckets = Array.from({ length: 12 }, () => ({
      total: 0,
      users: new Set<string>(),
      durSumSec: 0,
      durN: 0,
    }));

    for (const row of sessions) {
      const sd = new Date((row as any).started_at as string);
      const idx =
        (sd.getFullYear() - startFirst.getFullYear()) * 12 +
        (sd.getMonth() - startFirst.getMonth());
      if (idx < 0 || idx >= 12) continue;
      const b = sessBuckets[idx];
      b.total++;
      const uid = (row as any).user_id as string | undefined;
      if (uid) b.users.add(uid);

      let sec =
        typeof (row as any).duration_seconds === "number" &&
        (row as any).duration_seconds > 0
          ? (row as any).duration_seconds
          : null;
      if (sec == null) {
        const t0 = new Date((row as any).started_at as string).getTime();
        const endStr = (row as any).ended_at || (row as any).last_activity_at;
        const t1 = endStr ? new Date(endStr as string).getTime() : t0;
        sec = Math.max(0, (t1 - t0) / 1000);
      }
      if (sec > 0 && sec < 86400 * 6) {
        b.durSumSec += sec;
        b.durN++;
      }
    }

    const sessionFreqPerUser = sessBuckets.map((b) =>
      b.users.size > 0 ? b.total / b.users.size : 0,
    );

    const sessionDurationMins = sessBuckets.map((b) =>
      b.durN > 0 ? b.durSumSec / b.durN / 60 : 0,
    );

    const uids = [
      ...new Set(
        jobs
          .map((r: any) => r.user_id as string)
          .filter(Boolean),
      ),
    ] as string[];

    let timeToFirstCdf = [0, 0, 0, 0, 0, 0, 0];
    const thresholdHours = [0, 6, 24, 72, 120, 240, 336];

    if (uids.length > 0) {
      const [firstMap, userRows] = await Promise.all([
        SupabaseDB.getFirstJobTimestampMsByUserIds(uids),
        SupabaseDB.getUsersBasicById(uids),
      ]);
      const createdMs = new Map<string, number>();
      for (const u of userRows || []) {
        const row = u as { id: string; created_at?: string };
        if (row.created_at) {
          createdMs.set(row.id, new Date(row.created_at).getTime());
        }
      }
      const hoursList: number[] = [];
      for (const uid of uids) {
        const f = firstMap.get(uid);
        const c = createdMs.get(uid);
        if (f != null && c != null) {
          const h = (f - c) / (1000 * 60 * 60);
          if (h >= 0 && Number.isFinite(h)) hoursList.push(h);
        }
      }
      const n = hoursList.length;
      if (n > 0) {
        timeToFirstCdf = thresholdHours.map((t) =>
          Math.round(
            (100 * hoursList.filter((h) => h <= t).length) / n,
          ),
        );
        for (let i = 1; i < timeToFirstCdf.length; i++) {
          if (timeToFirstCdf[i] < timeToFirstCdf[i - 1]) {
            timeToFirstCdf[i] = timeToFirstCdf[i - 1];
          }
        }
      }
    }

    const deckPad = SupabaseDB.padChartRange(
      Math.min(...outputsPerUser),
      Math.max(...outputsPerUser),
      true,
    );
    const freqPad = SupabaseDB.padChartRange(
      Math.min(...sessionFreqPerUser),
      Math.max(...sessionFreqPerUser),
      true,
    );
    const durPad = SupabaseDB.padChartRange(
      Math.min(...sessionDurationMins),
      Math.max(...sessionDurationMins),
      true,
    );

    return {
      monthLabels,
      outputsPerUser,
      sessionFreqPerUser,
      sessionDurationMins,
      decksYMin: deckPad.min,
      decksYMax: deckPad.max,
      decksYLabels: SupabaseDB.chartYTickLabels(deckPad.min, deckPad.max, 6),
      sessFreqYMin: freqPad.min,
      sessFreqYMax: freqPad.max,
      sessFreqYLabels: SupabaseDB.chartYTickLabels(
        freqPad.min,
        freqPad.max,
        6,
      ),
      sessDurYMin: durPad.min,
      sessDurYMax: durPad.max,
      sessDurYLabels: SupabaseDB.chartYTickLabels(durPad.min, durPad.max, 6),
      timeToFirstCdf,
    };
  }

  /**
   * Behaviour-tracking proxies for deck (`presentation`) jobs only:
   * - "Accept rate" = share of jobs that reached `completed`.
   * - "Edit rate" = share that did not (failed / abandoned / in-flight in window).
   * - "Rewrites per output" = non-completed jobs per completed job (if none completed,
   *   falls back to total non-completed attempts in the window).
   * Slide-level mix is not stored at scale yet — callers should keep slide chart at zero.
   */
  static async getProductUsageBehaviourData(days: number): Promise<{
    current: {
      rewritesPerOutput: number;
      acceptRate: number;
      editRate: number;
    };
    previous: {
      rewritesPerOutput: number;
      acceptRate: number;
      editRate: number;
    };
    rewritesVsAccepts: {
      title: string;
      months: string[];
      yLabels: string[];
      accepted: number[];
      edited: number[];
      max: number;
      legend: { label: string; color: string }[];
      filterOptions: string[];
      selectedFilter: string;
    };
  }> {
    const nowMs = Date.now();
    const windowMs = days * 86400000;
    const currStartMs = nowMs - windowMs;
    const prevStartMs = nowMs - 2 * windowMs;
    const currStartIso = new Date(currStartMs).toISOString();
    const prevStartIso = new Date(prevStartMs).toISOString();

    const now = new Date();
    const startFirst = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const chartStartIso = startFirst.toISOString();
    const sinceMs = Math.min(prevStartMs, startFirst.getTime());
    const sinceIso = new Date(sinceMs).toISOString();

    const { data, error } = await supabase
      .from("generation_jobs")
      .select("created_at, status")
      .eq("type", "presentation")
      .gte("created_at", sinceIso);

    if (error) throw error;
    const rows = (data || []) as Array<{
      created_at: string;
      status?: string | null;
    }>;

    const isCompleted = (s: string | null | undefined) =>
      String(s || "").toLowerCase() === "completed";

    const snapshot = (
      list: typeof rows,
    ): {
      rewritesPerOutput: number;
      acceptRate: number;
      editRate: number;
    } => {
      const total = list.length;
      const completed = list.filter((j) => isCompleted(j.status)).length;
      const acceptRate = total > 0 ? (completed / total) * 100 : 0;
      const editRate = total > 0 ? ((total - completed) / total) * 100 : 0;
      const rewritesPerOutput =
        completed > 0
          ? (total - completed) / completed
          : total > 0
            ? total
            : 0;
      return { rewritesPerOutput, acceptRate, editRate };
    };

    const currRows = rows.filter((r) => new Date(r.created_at).getTime() >= currStartMs);
    const prevRows = rows.filter((r) => {
      const t = new Date(r.created_at).getTime();
      return t >= prevStartMs && t < currStartMs;
    });

    const monthLabels: string[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(startFirst.getFullYear(), startFirst.getMonth() + i, 1);
      monthLabels.push(
        `${SupabaseDB.PRODUCT_USAGE_MONTH_ABBR[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`,
      );
    }

    const buckets = Array.from({ length: 12 }, () => ({ total: 0, completed: 0 }));
    for (const row of rows) {
      const jd = new Date(row.created_at);
      if (jd.getTime() < startFirst.getTime()) continue;
      const idx =
        (jd.getFullYear() - startFirst.getFullYear()) * 12 +
        (jd.getMonth() - startFirst.getMonth());
      if (idx < 0 || idx >= 12) continue;
      buckets[idx].total++;
      if (isCompleted(row.status)) buckets[idx].completed++;
    }

    const accepted: number[] = [];
    const edited: number[] = [];
    for (const b of buckets) {
      if (b.total <= 0) {
        accepted.push(0);
        edited.push(0);
        continue;
      }
      const acc = Math.round((b.completed / b.total) * 100);
      const ed = Math.round(((b.total - b.completed) / b.total) * 100);
      accepted.push(acc);
      edited.push(ed);
    }

    return {
      current: snapshot(currRows),
      previous: snapshot(prevRows),
      rewritesVsAccepts: {
        title: "Rewrites vs Accepts",
        months: monthLabels,
        yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
        accepted,
        edited,
        max: 100,
        legend: [
          { label: "Accepted As-Is", color: "#18181b" },
          { label: "Further Edited", color: "#cbd5e1" },
        ],
        filterOptions: ["Both", "Accepted", "Edited"],
        selectedFilter: "Both",
      },
    };
  }

  private static bucketExportFormat(raw: string): "pdf" | "pptx" | "docx" | "other" {
    const f = raw.toLowerCase();
    if (f.includes("pdf")) return "pdf";
    if (f.includes("pptx") || f.includes("powerpoint") || f.includes("ppt"))
      return "pptx";
    if (f.includes("docx") || f.includes("word") || f.includes("doc"))
      return "docx";
    return "other";
  }

  /**
   * Export mix from `analytics_events` (see client: trackDeckExport).
   * Percent slices use largest-remainder over PDF / PPTX / DOCX / Other.
   */
  static async getProductUsageExportSlices(since?: string): Promise<
    Array<{
      label: string;
      value: number;
      color: string;
      textColor: string;
    }>
  > {
    let q = supabaseAdmin
      .from("analytics_events")
      .select("properties")
      .eq("event_category", "product_usage")
      .eq("event_action", "export_deck");
    if (since) q = q.gte("created_at", since);
    const { data, error } = await q.limit(8000);
    if (error) throw error;

    const counts = { pdf: 0, pptx: 0, docx: 0, other: 0 };
    for (const row of data || []) {
      const fmt = SupabaseDB.bucketExportFormat(
        String((row as { properties?: { format?: string } }).properties?.format ?? ""),
      );
      counts[fmt]++;
    }
    const total = counts.pdf + counts.pptx + counts.docx + counts.other;
    const meta = [
      { key: "pdf" as const, label: "PDF", color: "#334155", textColor: "white" },
      { key: "pptx" as const, label: "PPTX", color: "#1e293b", textColor: "white" },
      { key: "docx" as const, label: "DOCX", color: "#e2e8f0", textColor: "#09090b" },
      { key: "other" as const, label: "Other", color: "#94a3b8", textColor: "white" },
    ];
    if (total <= 0) {
      return meta.map((m) => ({
        label: m.label,
        value: 0,
        color: m.color,
        textColor: m.textColor,
      }));
    }
    const pcts = SupabaseDB.distributeShares(
      [counts.pdf, counts.pptx, counts.docx, counts.other],
      total,
    );
    return meta.map((m, i) => ({
      label: m.label,
      value: pcts[i],
      color: m.color,
      textColor: m.textColor,
    }));
  }

  /**
   * Ranked AI style / personality / formality selections from analytics
   * (client: trackAiStyleSettingSelected).
   */
  static async getProductUsageAiStyleRows(since?: string): Promise<
    Array<{
      rank: number;
      name: string;
      value: string;
      percent: string;
    }>
  > {
    let q = supabaseAdmin
      .from("analytics_events")
      .select("user_id, properties")
      .eq("event_category", "product_usage")
      .eq("event_action", "ai_style_setting");
    if (since) q = q.gte("created_at", since);
    const { data, error } = await q.limit(8000);
    if (error) throw error;

    const allUsers = new Set<string>();
    const byTitle = new Map<string, { count: number; users: Set<string> }>();

    for (const row of data || []) {
      const uid = (row as { user_id?: string }).user_id;
      if (uid) allUsers.add(uid);
      const props = (row as { properties?: Record<string, unknown> }).properties || {};
      const title = String(props.setting_title ?? "").trim();
      if (!title) continue;
      if (!byTitle.has(title)) {
        byTitle.set(title, { count: 0, users: new Set() });
      }
      const b = byTitle.get(title)!;
      b.count++;
      if (uid) b.users.add(uid);
    }

    const denom = allUsers.size || 1;
    const sorted = [...byTitle.entries()].sort(
      (a, b) => b[1].count - a[1].count,
    );

    return sorted.slice(0, 12).map(([name, agg], i) => ({
      rank: i + 1,
      name,
      value: agg.count.toLocaleString(),
      percent: `${((agg.users.size / denom) * 100).toFixed(1)}% of users`,
    }));
  }

  /**
   * Average seconds per slide cell from `slide_dwell_sample` events
   * (client: useSlideDwellTracking). Null = no samples.
   */
  static async getProductUsageSlideHeatmap(since?: string): Promise<{
    title: string;
    slides: number[];
    rows: (number | null)[][];
  }> {
    let q = supabaseAdmin
      .from("analytics_events")
      .select("properties")
      .eq("event_category", "product_usage")
      .eq("event_action", "slide_dwell_sample");
    if (since) q = q.gte("created_at", since);
    const { data, error } = await q.limit(12000);
    if (error) throw error;

    const sums: number[][] = Array.from({ length: 5 }, () => Array(7).fill(0));
    const counts: number[][] = Array.from({ length: 5 }, () => Array(7).fill(0));

    for (const row of data || []) {
      const p = (row as { properties?: Record<string, unknown> }).properties || {};
      const db = Number(p.deck_bucket);
      const si = Number(p.slide_index);
      const sec = Number(p.duration_seconds);
      if (
        !Number.isFinite(db) ||
        !Number.isFinite(si) ||
        !Number.isFinite(sec) ||
        db < 1 ||
        db > 5 ||
        si < 1 ||
        si > 7 ||
        sec <= 0
      ) {
        continue;
      }
      sums[db - 1][si - 1] += sec;
      counts[db - 1][si - 1] += 1;
    }

    const rowsOut: (number | null)[][] = sums.map((r, ri) =>
      r.map((s, ci) =>
        counts[ri][ci] > 0 ? Math.round(s / counts[ri][ci]) : null,
      ),
    );

    return {
      title: "Slide Time Heatmap",
      slides: [1, 2, 3, 4, 5, 6, 7],
      rows: rowsOut,
    };
  }

  static async getProductUsageEngagementExtras(since?: string): Promise<{
    exportTypes: {
      title: string;
      slices: Awaited<ReturnType<typeof SupabaseDB.getProductUsageExportSlices>>;
    };
    aiStyleSettingsUsage: {
      title: string;
      rows: Awaited<ReturnType<typeof SupabaseDB.getProductUsageAiStyleRows>>;
    };
    slideTimeHeatmap: Awaited<ReturnType<typeof SupabaseDB.getProductUsageSlideHeatmap>>;
  }> {
    const [slices, rows, heatmap] = await Promise.all([
      SupabaseDB.getProductUsageExportSlices(since),
      SupabaseDB.getProductUsageAiStyleRows(since),
      SupabaseDB.getProductUsageSlideHeatmap(since),
    ]);
    return {
      exportTypes: { title: "Export Types", slices },
      aiStyleSettingsUsage: { title: "AI Style Settings Usage", rows },
      slideTimeHeatmap: heatmap,
    };
  }

  /** Maps slide index from dwell tracking to funnel labels (path proxy). */
  private static slideIndexToFlowLabel(idx: number): string {
    if (idx <= 1) return "Title";
    if (idx <= 3) return "Content";
    if (idx === 4) return "Chart";
    if (idx <= 7) return "Quote";
    return "Export";
  }

  private static async exportDeckEventCount(
    startIso: string,
    endIsoExclusive?: string,
  ): Promise<number> {
    let q = supabaseAdmin
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("event_category", "product_usage")
      .eq("event_action", "export_deck")
      .gte("created_at", startIso);
    if (endIsoExclusive) q = q.lt("created_at", endIsoExclusive);
    const { count, error } = await q;
    if (error) throw error;
    return count ?? 0;
  }

  private static async fetchPresentationJobsCreatedInRange(
    startIso: string,
    endIsoExclusive?: string,
  ): Promise<
    Array<{ status?: string | null; created_at: string; updated_at?: string }>
  > {
    let q = supabase
      .from("generation_jobs")
      .select("status, created_at, updated_at")
      .eq("type", "presentation")
      .gte("created_at", startIso);
    if (endIsoExclusive) q = q.lt("created_at", endIsoExclusive);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as Array<{
      status?: string | null;
      created_at: string;
      updated_at?: string;
    }>;
  }

  /**
   * Slide drop-off, rewrite proxies by category, path flows from dwell samples,
   * presentation bounce + export counts, and median completion minutes by month.
   */
  static async getProductUsageDeckFunnelExtras(args: {
    since?: string;
    days: number;
  }): Promise<{
    slideDropoff: {
      title: string;
      yLabels: string[];
      max: number;
      data: number[];
    };
    slideRewritesVsAccepts: {
      title: string;
      yLabels: string[];
      max: number;
      categories: Array<{ label: string; accepted: number; edited: number }>;
      legend: { label: string; color: string }[];
      filterOptions: string[];
      selectedFilter: string;
    };
    rewritesVsAcceptsFlows: {
      title: string;
      rows: Array<{
        rank: number;
        flow: string;
        value: string;
        percent: string;
      }>;
      filterOptions: string[];
      selectedFilter: string;
    };
    presentationBounce: {
      current: {
        started: number;
        completed: number;
        exported: number;
        rate: number;
      };
      previous: {
        started: number;
        completed: number;
        exported: number;
        rate: number;
      };
    };
    completionTime: {
      title: string;
      months: string[];
      yLabels: string[];
      min: number;
      max: number;
      data: number[];
      timeframeOptions: string[];
      selectedTimeframe: string;
    };
  }> {
    const nowMs = Date.now();
    const now = new Date(nowMs);
    const windowMs = Math.max(1, args.days) * 86400000;
    const currStartIso = new Date(nowMs - windowMs).toISOString();
    const prevStartIso = new Date(nowMs - 2 * windowMs).toISOString();

    const startFirst = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    startFirst.setHours(0, 0, 0, 0);
    const startFirstIso = startFirst.toISOString();

    const monthLabels: string[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(
        startFirst.getFullYear(),
        startFirst.getMonth() + i,
        1,
      );
      monthLabels.push(
        `${SupabaseDB.PRODUCT_USAGE_MONTH_ABBR[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`,
      );
    }

    let dwellQ = supabaseAdmin
      .from("analytics_events")
      .select("user_id, created_at, properties")
      .eq("event_category", "product_usage")
      .eq("event_action", "slide_dwell_sample")
      .order("created_at", { ascending: true });
    if (args.since) dwellQ = dwellQ.gte("created_at", args.since);

    const [
      dwellRows,
      jobsCurr,
      jobsPrev,
      exportCurr,
      exportPrev,
      completedDeckRows,
    ] = await Promise.all([
      dwellQ.limit(15000),
      SupabaseDB.fetchPresentationJobsCreatedInRange(currStartIso),
      SupabaseDB.fetchPresentationJobsCreatedInRange(prevStartIso, currStartIso),
      SupabaseDB.exportDeckEventCount(currStartIso),
      SupabaseDB.exportDeckEventCount(prevStartIso, currStartIso),
      supabase
        .from("generation_jobs")
        .select("created_at, updated_at")
        .eq("type", "presentation")
        .eq("status", "completed")
        .gte("updated_at", startFirstIso),
    ]);

    if (dwellRows.error) throw dwellRows.error;
    if (completedDeckRows.error) throw completedDeckRows.error;

    const dwell = (dwellRows.data || []) as Array<{
      user_id?: string | null;
      created_at: string;
      properties?: { slide_index?: number };
    }>;

    const maxSlideByUser = new Map<string, number>();
    const eventsByUser = new Map<
      string,
      Array<{ t: number; slide: number }>
    >();

    for (const row of dwell) {
      const uid = row.user_id;
      if (!uid) continue;
      const si = Number(row.properties?.slide_index);
      if (!Number.isFinite(si) || si < 1) continue;
      const slide = Math.min(15, Math.floor(si));
      maxSlideByUser.set(uid, Math.max(maxSlideByUser.get(uid) || 0, slide));

      const t = new Date(row.created_at).getTime();
      if (!eventsByUser.has(uid)) eventsByUser.set(uid, []);
      eventsByUser.get(uid)!.push({ t, slide });
    }

    const denomUsers = maxSlideByUser.size;
    const dropData: number[] = [];
    for (let n = 1; n <= 15; n++) {
      let reached = 0;
      for (const m of maxSlideByUser.values()) {
        if (m >= n) reached++;
      }
      dropData.push(
        denomUsers > 0 ? Math.round((100 * reached) / denomUsers) : 0,
      );
    }

    const transitionCount = new Map<string, number>();
    const transitionUsers = new Map<string, Set<string>>();

    for (const [uid, arr] of eventsByUser) {
      arr.sort((a, b) => a.t - b.t);
      const seq: number[] = [];
      for (const e of arr) {
        if (seq.length === 0 || seq[seq.length - 1] !== e.slide) {
          seq.push(e.slide);
        }
      }
      for (let i = 0; i < seq.length - 1; i++) {
        const a = SupabaseDB.slideIndexToFlowLabel(seq[i]);
        const b = SupabaseDB.slideIndexToFlowLabel(seq[i + 1]);
        if (a === b) continue;
        const key = `${a} → ${b}`;
        transitionCount.set(key, (transitionCount.get(key) || 0) + 1);
        if (!transitionUsers.has(key)) transitionUsers.set(key, new Set());
        transitionUsers.get(key)!.add(uid);
      }
    }

    const anyPathUsers = new Set<string>();
    transitionUsers.forEach((s) => s.forEach((u) => anyPathUsers.add(u)));
    const pathDenom = anyPathUsers.size || 1;

    const sortedFlows = [...transitionCount.entries()].sort(
      (x, y) => y[1] - x[1],
    );

    let flowRows: Array<{
      rank: number;
      flow: string;
      value: string;
      percent: string;
    }>;
    if (sortedFlows.length === 0) {
      flowRows = [
        {
          rank: 1,
          flow: "No slide path data in this period",
          value: "0",
          percent: "0% of users",
        },
      ];
    } else {
      flowRows = sortedFlows.slice(0, 8).map(([flow, cnt], i) => {
        const u = transitionUsers.get(flow)?.size ?? 0;
        return {
          rank: i + 1,
          flow,
          value: cnt.toLocaleString(),
          percent: `${((100 * u) / pathDenom).toFixed(1)}% of users`,
        };
      });
    }

    const isCompleted = (s: string | null | undefined) =>
      String(s || "").toLowerCase() === "completed";

    const bounceFromJobs = (
      jobs: Array<{ status?: string | null }>,
      exported: number,
    ) => {
      const started = jobs.length;
      const completed = jobs.filter((j) => isCompleted(j.status)).length;
      const rate =
        started > 0 ? Math.round((100 * (started - completed)) / started) : 0;
      return { started, completed, exported, rate };
    };

    const presentationBounce = {
      current: bounceFromJobs(jobsCurr, exportCurr),
      previous: bounceFromJobs(jobsPrev, exportPrev),
    };

    const totalCurr = jobsCurr.length;
    const compCurr = jobsCurr.filter((j) => isCompleted(j.status)).length;
    const acceptPct =
      totalCurr > 0 ? Math.round((100 * compCurr) / totalCurr) : 0;
    const editPct = totalCurr > 0 ? Math.max(0, 100 - acceptPct) : 0;

    const slideRewritesVsAccepts = {
      title: "Rewrites vs Accepts",
      yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
      max: 100,
      categories: [
        { label: "Title", accepted: acceptPct, edited: editPct },
        { label: "Content", accepted: acceptPct, edited: editPct },
        { label: "Content", accepted: acceptPct, edited: editPct },
        { label: "Quote", accepted: acceptPct, edited: editPct },
      ],
      legend: [
        { label: "Accepted As-Is", color: "#18181b" },
        { label: "Further Edited", color: "#cbd5e1" },
      ],
      filterOptions: ["Both", "Accepted", "Edited"],
      selectedFilter: "Both",
    };

    const doneList = (completedDeckRows.data || []) as Array<{
      created_at: string;
      updated_at: string;
    }>;

    const monthBuckets = Array.from({ length: 12 }, () => ({
      sum: 0,
      n: 0,
    }));

    for (const j of doneList) {
      const end = new Date(j.updated_at);
      const idx =
        (end.getFullYear() - startFirst.getFullYear()) * 12 +
        (end.getMonth() - startFirst.getMonth());
      if (idx < 0 || idx >= 12) continue;
      const mins =
        (end.getTime() - new Date(j.created_at).getTime()) / 60000;
      if (!Number.isFinite(mins) || mins < 0 || mins > 10080) continue;
      monthBuckets[idx].sum += mins;
      monthBuckets[idx].n++;
    }

    const rawSeries = monthBuckets.map((b) =>
      b.n > 0 ? Math.round(b.sum / b.n) : null,
    );
    let lastFill = 10;
    const dataMinutes: number[] = rawSeries.map((v) => {
      if (v != null) {
        lastFill = v;
        return v;
      }
      return lastFill;
    });

    let lo = Math.min(...dataMinutes);
    let hi = Math.max(...dataMinutes);
    if (!Number.isFinite(lo)) lo = 10;
    if (!Number.isFinite(hi)) hi = 20;
    if (hi <= lo) hi = lo + 10;
    const minV = Math.max(5, lo - 2);
    const maxV = Math.min(120, hi + 5);
    const steps = 6;
    const yLabelsCt: string[] = [];
    for (let i = steps - 1; i >= 0; i--) {
      const v = minV + ((maxV - minV) * i) / (steps - 1);
      yLabelsCt.push(`${Math.round(v)}m`);
    }

    return {
      slideDropoff: {
        title: "Slide Drop-off",
        yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
        max: 100,
        data: dropData,
      },
      slideRewritesVsAccepts,
      rewritesVsAcceptsFlows: {
        title: "Rewrites vs Accepts",
        rows: flowRows,
        filterOptions: ["Both", "Accepted", "Edited"],
        selectedFilter: "Both",
      },
      presentationBounce,
      completionTime: {
        title: "Completion Time",
        months: monthLabels,
        yLabels: yLabelsCt,
        min: minV,
        max: maxV,
        data: dataMinutes,
        timeframeOptions: ["last 1 year", "last 6 months", "last 30d"],
        selectedTimeframe: "last 1 year",
      },
    };
  }

  private static chunkIds(ids: string[], size: number): string[][] {
    const out: string[][] = [];
    for (let i = 0; i < ids.length; i += size) {
      out.push(ids.slice(i, i + size));
    }
    return out;
  }

  private static personaMatchesOverviewPersona(
    persona: string,
    tierRaw: string | null | undefined,
  ): boolean {
    const label = SupabaseDB.planLabelFromTier(tierRaw);
    if (persona === "Freelancer") return label === "Free" || label === "Pro";
    if (persona === "Agency") return label === "Team";
    if (persona === "Enterprise") return label === "Enterprise";
    return true;
  }

  private static async getTopJobUserIdsInWindow(
    sinceIso: string | undefined,
    take: number,
  ): Promise<Set<string>> {
    let q = supabase.from("generation_jobs").select("user_id");
    if (sinceIso) q = q.gte("created_at", sinceIso);
    const { data, error } = await q;
    if (error) throw error;
    const counts = new Map<string, number>();
    for (const row of data || []) {
      const uid = (row as { user_id?: string }).user_id;
      if (!uid) continue;
      counts.set(uid, (counts.get(uid) || 0) + 1);
    }
    const top = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, take)
      .map(([id]) => id);
    return new Set(top);
  }

  /**
   * Intersects admin dashboard audience filters (cohort / persona / device).
   * Returns null when no narrowing is requested.
   */
  static async resolveAdminAudienceUserIds(args: {
    sinceIso?: string;
    days: number;
    cohort?: string;
    persona?: string;
    device?: string;
  }): Promise<Set<string> | null> {
    const cohort = args.cohort || "All cohorts";
    const persona = args.persona || "All personas";
    const device = args.device || "All devices";

    if (
      cohort === "All cohorts" &&
      persona === "All personas" &&
      device === "All devices"
    ) {
      return null;
    }

    let acc: Set<string> | undefined;

    const intersect = (next: Set<string>) => {
      if (acc === undefined) acc = next;
      else acc = new Set([...acc].filter((id) => next.has(id)));
      if (acc.size === 0) return acc;
      return acc;
    };

    if (device !== "All devices") {
      const dt =
        device === "Desktop"
          ? "desktop"
          : device === "Mobile"
            ? "mobile"
            : "tablet";
      let q = supabaseAdmin
        .from("analytics_events")
        .select("user_id")
        .eq("device_type", dt)
        .not("user_id", "is", null)
        .limit(50000);
      if (args.sinceIso) q = q.gte("created_at", args.sinceIso);
      const { data, error } = await q;
      if (error) throw error;
      const s = new Set<string>();
      for (const row of data || []) {
        const uid = (row as { user_id?: string | null }).user_id;
        if (uid) s.add(uid as string);
      }
      intersect(s);
      if (acc && acc.size === 0) return acc;
    }

    if (persona !== "All personas") {
      const { data: users, error } = await supabaseAdmin
        .from("users")
        .select("id, tier");
      if (error) throw error;
      const s = new Set<string>();
      for (const u of users || []) {
        const row = u as { id: string; tier?: string | null };
        if (SupabaseDB.personaMatchesOverviewPersona(persona, row.tier)) {
          s.add(row.id);
        }
      }
      intersect(s);
      if (acc && acc.size === 0) return acc;
    }

    if (cohort !== "All cohorts") {
      if (cohort === "New users") {
        let q = supabase.from("users").select("id");
        if (args.sinceIso) q = q.gte("created_at", args.sinceIso);
        const { data, error } = await q;
        if (error) throw error;
        intersect(
          new Set(
            (data || []).map((u: { id: string }) => u.id).filter(Boolean),
          ),
        );
      } else if (cohort === "Returning") {
        const sinceIso = args.sinceIso;
        if (!sinceIso) {
          intersect(new Set());
        } else {
          const { data: oldUsers, error: e1 } = await supabase
            .from("users")
            .select("id")
            .lt("created_at", sinceIso);
          if (e1) throw e1;
          const oldIds = new Set(
            (oldUsers || []).map((u: { id: string }) => u.id),
          );
          const { data: jobs, error: e2 } = await supabase
            .from("generation_jobs")
            .select("user_id")
            .gte("created_at", sinceIso);
          if (e2) throw e2;
          const active = new Set<string>();
          for (const j of jobs || []) {
            const uid = (j as { user_id?: string }).user_id;
            if (uid && oldIds.has(uid)) active.add(uid);
          }
          intersect(active);
        }
      } else if (cohort === "Power users") {
        const top = await SupabaseDB.getTopJobUserIdsInWindow(
          args.sinceIso,
          10,
        );
        intersect(top);
      }
      if (acc && acc.size === 0) return acc;
    }

    return acc ?? null;
  }

  /** Integer percentages that sum to 100 when total > 0 (largest remainder). */
  private static distributeShares(counts: number[], total: number): number[] {
    if (!total || counts.length === 0) return counts.map(() => 0);
    const raw = counts.map((c) => (c / total) * 100);
    const floors = raw.map((r) => Math.floor(r));
    let rem = 100 - floors.reduce((a, b) => a + b, 0);
    const frac = raw.map((r, i) => ({ i, f: r - floors[i] }));
    frac.sort((a, b) => b.f - a.f);
    for (let k = 0; k < rem; k++) {
      floors[frac[k].i]++;
    }
    return floors;
  }

  /**
   * Lifecycle stages for admin dashboard — mutually exclusive buckets.
   * Uses generation_jobs + user_sessions (analytics) up to `asOfMs`.
   * "Reactivated" wins when gap >30d then return within 30d of as-of.
   */
  private static classifyLifecycleStage(
    userCreatedMs: number,
    jobTimesMs: number[],
    sessionTimesMs: number[],
    asOfMs: number,
  ):
    | "new"
    | "activated"
    | "engaged"
    | "power_user"
    | "at_risk"
    | "dormant"
    | "churned"
    | "reactivated" {
    const jobs = jobTimesMs.filter((t) => t <= asOfMs).sort((a, b) => a - b);
    const sess = sessionTimesMs.filter((t) => t <= asOfMs).sort((a, b) => a - b);

    const jobDays = new Set(
      jobs.map((t) => new Date(t).toISOString().slice(0, 10)),
    );

    const timeline = [...new Set([...jobs, ...sess])].sort((a, b) => a - b);

    if (timeline.length >= 2) {
      for (let k = 1; k < timeline.length; k++) {
        const gapDays = (timeline[k] - timeline[k - 1]) / 86400000;
        if (
          gapDays > 30 &&
          asOfMs - timeline[k] <= 30 * 86400000
        ) {
          return "reactivated";
        }
      }
    }

    const outputCount = jobs.length;
    const sessionProxy = Math.max(sess.length, jobDays.size);
    const volume = outputCount > 0 ? outputCount : sessionProxy;

    const lastJob = jobs.length ? jobs[jobs.length - 1] : undefined;
    const lastSess = sess.length ? sess[sess.length - 1] : undefined;
    let lastActivity = userCreatedMs;
    if (lastJob !== undefined) lastActivity = Math.max(lastActivity, lastJob);
    if (lastSess !== undefined) lastActivity = Math.max(lastActivity, lastSess);

    const daysSinceActive = (asOfMs - lastActivity) / 86400000;

    if (volume === 0) {
      return "new";
    }
    if (volume <= 3 && daysSinceActive <= 7) {
      return "activated";
    }
    if (volume > 3 && volume <= 15 && daysSinceActive <= 14) {
      return "engaged";
    }
    if (volume > 15 && daysSinceActive <= 14) {
      return "power_user";
    }
    if (daysSinceActive > 14 && daysSinceActive <= 30) {
      return "at_risk";
    }
    if (daysSinceActive > 30 && daysSinceActive <= 60) {
      return "dormant";
    }
    return "churned";
  }

  private static async fetchJobsForUsersUpTo(
    userIds: string[],
    asOfIso: string,
  ): Promise<Array<{ user_id: string; created_at: string }>> {
    if (!userIds.length) return [];
    const rows: Array<{ user_id: string; created_at: string }> = [];
    for (const chunk of SupabaseDB.chunkIds(userIds, 120)) {
      const { data, error } = await supabase
        .from("generation_jobs")
        .select("user_id, created_at")
        .in("user_id", chunk)
        .lte("created_at", asOfIso);
      if (error) throw error;
      (data || []).forEach((r: any) =>
        rows.push({ user_id: r.user_id, created_at: r.created_at }),
      );
    }
    return rows;
  }

  private static async fetchSessionsForUsersUpTo(
    userIds: string[],
    asOfIso: string,
  ): Promise<Array<{ user_id: string; started_at: string }>> {
    if (!userIds.length) return [];
    const rows: Array<{ user_id: string; started_at: string }> = [];
    for (const chunk of SupabaseDB.chunkIds(userIds, 120)) {
      const { data, error } = await supabaseAdmin
        .from("user_sessions")
        .select("user_id, started_at")
        .in("user_id", chunk)
        .lte("started_at", asOfIso);
      if (error) throw error;
      (data || []).forEach((r: any) =>
        rows.push({ user_id: r.user_id, started_at: r.started_at }),
      );
    }
    return rows;
  }

  /**
   * Users who signed up or had product activity (job/session) in [start, end).
   */
  private static async getLifecycleCohortUserIds(
    startIso: string,
    endIso: string,
    search?: string,
  ): Promise<string[]> {
    const ids = new Set<string>();

    let uq = supabaseAdmin
      .from("users")
      .select("id")
      .gte("created_at", startIso)
      .lt("created_at", endIso);
    if (search) {
      uq = uq.ilike("email", `%${search}%`);
    }
    const { data: signups, error: e1 } = await uq;
    if (e1) throw e1;
    (signups || []).forEach((u: any) => ids.add(u.id as string));

    const { data: jobUsers, error: e2 } = await supabase
      .from("generation_jobs")
      .select("user_id")
      .gte("created_at", startIso)
      .lt("created_at", endIso);
    if (e2) throw e2;
    (jobUsers || []).forEach((r: any) => {
      if (r.user_id) ids.add(r.user_id as string);
    });

    const { data: sessUsers, error: e3 } = await supabaseAdmin
      .from("user_sessions")
      .select("user_id")
      .gte("started_at", startIso)
      .lt("started_at", endIso);
    if (e3) throw e3;
    (sessUsers || []).forEach((r: any) => {
      if (r.user_id) ids.add(r.user_id as string);
    });

    if (!search) return [...ids];

    const term = search.toLowerCase();
    const matched: string[] = [];
    for (const chunk of SupabaseDB.chunkIds([...ids], 100)) {
      const { data: emails, error: e4 } = await supabaseAdmin
        .from("users")
        .select("id, email")
        .in("id", chunk);
      if (e4) throw e4;
      (emails || []).forEach((u: any) => {
        if ((u.email as string)?.toLowerCase().includes(term)) {
          matched.push(u.id as string);
        }
      });
    }
    return matched;
  }

  /**
   * All users (optional email search) — for "All time"–style wide cohorts.
   */
  private static async getAllUserIdsMatchingSearch(
    search?: string,
  ): Promise<string[]> {
    let q = supabaseAdmin.from("users").select("id");
    if (search) {
      q = q.ilike("email", `%${search}%`);
    }
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map((u: any) => u.id as string);
  }

  /**
   * Stage counts + KPI comparison vs prior window of equal length.
   */
  static async getLifecycleAnalytics(
    days: number,
    search?: string,
    timeframe?: string,
  ): Promise<{
    stages: {
      new: number;
      activated: number;
      engaged: number;
      power_user: number;
      at_risk: number;
      dormant: number;
      churned: number;
      reactivated: number;
    };
    totalUsers: number;
    stageCards: Array<{
      key: string;
      label: string;
      value: number;
      share: number;
      color: string;
    }>;
    prev: {
      totalUsers: number;
      engagedPower: number;
      atRisk: number;
      reactivated: number;
    };
    segmentDetail: Array<{
      key: string;
      avgOutputs: string;
      lastActivity: string;
    }>;
  }> {
    const STAGE_META: ReadonlyArray<{
      key: keyof {
        new: number;
        activated: number;
        engaged: number;
        power_user: number;
        at_risk: number;
        dormant: number;
        churned: number;
        reactivated: number;
      };
      label: string;
      color: string;
    }> = [
      { key: "new", label: "New", color: "#1e293b" },
      { key: "activated", label: "Activated", color: "#334155" },
      { key: "engaged", label: "Engaged", color: "#475569" },
      { key: "power_user", label: "Power User", color: "#64748b" },
      { key: "at_risk", label: "At Risk", color: "#94a3b8" },
      { key: "dormant", label: "Dormant", color: "#a1a1aa" },
      { key: "churned", label: "Churned", color: "#d4d4d8" },
      { key: "reactivated", label: "Reactivated", color: "#7c3aed" },
    ];

    const stageCardsFrom = (
      st: {
        new: number;
        activated: number;
        engaged: number;
        power_user: number;
        at_risk: number;
        dormant: number;
        churned: number;
        reactivated: number;
      },
      total: number,
    ) => {
      const counts = STAGE_META.map((m) => st[m.key]);
      const shares = SupabaseDB.distributeShares(counts, total);
      return STAGE_META.map((m, i) => ({
        key: m.key,
        label: m.label,
        value: counts[i],
        share: shares[i],
        color: m.color,
      }));
    };

    const now = Date.now();
    const allTime =
      timeframe === "All time" || days >= 998;

    const runWindow = async (
      windowStartMs: number,
      windowEndMs: number,
      asOfMs: number,
    ) => {
      const startIso = new Date(windowStartMs).toISOString();
      const endIso = new Date(windowEndMs).toISOString();
      const asOfIso = new Date(asOfMs).toISOString();

      let cohortIds: string[];
      if (allTime) {
        cohortIds = await SupabaseDB.getAllUserIdsMatchingSearch(search);
      } else {
        cohortIds = await SupabaseDB.getLifecycleCohortUserIds(
          startIso,
          endIso,
          search,
        );
      }

      if (!cohortIds.length) {
        return {
          stages: {
            new: 0,
            activated: 0,
            engaged: 0,
            power_user: 0,
            at_risk: 0,
            dormant: 0,
            churned: 0,
            reactivated: 0,
          },
          totalUsers: 0,
          engagedPower: 0,
          atRisk: 0,
          reactivated: 0,
          segmentDetail: STAGE_META.map((m) => ({
            key: m.key,
            avgOutputs: "0",
            lastActivity: "—",
          })),
        };
      }

      const userById = new Map<
        string,
        { id: string; created_at: string; email?: string }
      >();
      for (const chunk of SupabaseDB.chunkIds(cohortIds, 100)) {
        const { data: userRows, error: urErr } = await supabaseAdmin
          .from("users")
          .select("id, created_at, email")
          .in("id", chunk);
        if (urErr) throw urErr;
        (userRows || []).forEach((u: any) =>
          userById.set(u.id as string, u),
        );
      }

      const [jobRows, sessionRows] = await Promise.all([
        SupabaseDB.fetchJobsForUsersUpTo(cohortIds, asOfIso),
        SupabaseDB.fetchSessionsForUsersUpTo(cohortIds, asOfIso),
      ]);

      const jobsByUser = new Map<string, number[]>();
      for (const r of jobRows) {
        const uid = r.user_id;
        const t = new Date(r.created_at).getTime();
        if (!jobsByUser.has(uid)) jobsByUser.set(uid, []);
        jobsByUser.get(uid)!.push(t);
      }

      const sessByUser = new Map<string, number[]>();
      for (const r of sessionRows) {
        const uid = r.user_id;
        const t = new Date(r.started_at).getTime();
        if (!sessByUser.has(uid)) sessByUser.set(uid, []);
        sessByUser.get(uid)!.push(t);
      }

      const effectiveIds = cohortIds.filter((id) => userById.has(id));

      const stages = {
        new: 0,
        activated: 0,
        engaged: 0,
        power_user: 0,
        at_risk: 0,
        dormant: 0,
        churned: 0,
        reactivated: 0,
      };

      type StageAggKey = (typeof STAGE_META)[number]["key"];
      const segmentAgg = STAGE_META.reduce(
        (acc, m) => {
          acc[m.key] = { n: 0, sumJobs: 0, sumDays: 0 };
          return acc;
        },
        {} as Record<
          StageAggKey,
          { n: number; sumJobs: number; sumDays: number }
        >,
      );

      for (const id of effectiveIds) {
        const u = userById.get(id)!;
        const createdMs = new Date(u.created_at).getTime();
        const jobTs = jobsByUser.get(id) || [];
        const sessTs = sessByUser.get(id) || [];
        const stage = SupabaseDB.classifyLifecycleStage(
          createdMs,
          jobTs,
          sessTs,
          asOfMs,
        );
        (stages as any)[stage]++;

        const jobCount = jobTs.length;
        const lastJob = jobTs.length ? Math.max(...jobTs) : undefined;
        const lastSess = sessTs.length ? Math.max(...sessTs) : undefined;
        let lastActivity = createdMs;
        if (lastJob !== undefined) lastActivity = Math.max(lastActivity, lastJob);
        if (lastSess !== undefined) {
          lastActivity = Math.max(lastActivity, lastSess);
        }
        const daysSince = (asOfMs - lastActivity) / 86400000;

        const agg = segmentAgg[stage as StageAggKey];
        agg.n += 1;
        agg.sumJobs += jobCount;
        agg.sumDays += daysSince;
      }

      const segmentDetail = STAGE_META.map((m) => {
        const a = segmentAgg[m.key];
        const n = a.n;
        if (!n) {
          return { key: m.key, avgOutputs: "0", lastActivity: "—" };
        }
        const avgJobs = Math.round((a.sumJobs / n) * 10) / 10;
        const avgOutStr =
          avgJobs % 1 === 0 ? String(Math.round(avgJobs)) : avgJobs.toFixed(1);
        return {
          key: m.key,
          avgOutputs: avgOutStr,
          lastActivity: SupabaseDB.formatLifecycleSegmentRecency(a.sumDays / n),
        };
      });

      const totalUsers = effectiveIds.length;
      const engagedPower = stages.engaged + stages.power_user;
      const atRisk = stages.at_risk;
      const reactivated = stages.reactivated;

      return {
        stages,
        totalUsers,
        engagedPower,
        atRisk,
        reactivated,
        segmentDetail,
      };
    };

    if (allTime) {
      const windowStartMs = 0;
      const current = await runWindow(windowStartMs, now, now);
      return {
        stages: current.stages,
        totalUsers: current.totalUsers,
        stageCards: stageCardsFrom(current.stages, current.totalUsers),
        segmentDetail: current.segmentDetail,
        prev: {
          totalUsers: 0,
          engagedPower: 0,
          atRisk: 0,
          reactivated: 0,
        },
      };
    }

    const windowMs = days * 86400000;
    const t1 = now - windowMs;
    const t0 = t1 - windowMs;

    const [current, previous] = await Promise.all([
      runWindow(t1, now, now),
      runWindow(t0, t1, t1),
    ]);

    return {
      stages: current.stages,
      totalUsers: current.totalUsers,
      stageCards: stageCardsFrom(current.stages, current.totalUsers),
      segmentDetail: current.segmentDetail,
      prev: {
        totalUsers: previous.totalUsers,
        engagedPower: previous.engagedPower,
        atRisk: previous.atRisk,
        reactivated: previous.reactivated,
      },
    };
  }

  static async getUsersWithActivity(since?: string) {
    // USERS
    let usersQuery = supabase.from("users").select("*");

    if (since) {
      usersQuery = usersQuery.gte("created_at", since);
    }

    const { data: users, error: userError } = await usersQuery;
    if (userError) throw userError;

    // JOBS
    let jobsQuery = supabase.from("generation_jobs").select("*");

    if (since) {
      jobsQuery = jobsQuery.gte("created_at", since);
    }

    const { data: jobs, error: jobError } = await jobsQuery;
    if (jobError) throw jobError;

    return {
      users: users || [],
      jobs: jobs || [],
    };
  }

  /** Users with `created_at` in [startIso, endIsoExclusive). */
  static async getUsersCreatedInRange(
    startIso: string,
    endIsoExclusive?: string,
  ) {
    let q = supabase.from("users").select("*").gte("created_at", startIso);
    if (endIsoExclusive) {
      q = q.lt("created_at", endIsoExclusive);
    }
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }

  /** Generation jobs in range including `type` (for feature-adoption proxies). */
  static async getGenerationJobsTypedInRange(
    startIso: string,
    endIsoExclusive?: string,
  ) {
    let q = supabase
      .from("generation_jobs")
      .select("user_id, type, created_at")
      .gte("created_at", startIso);
    if (endIsoExclusive) {
      q = q.lt("created_at", endIsoExclusive);
    }
    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as Array<{
      user_id: string;
      type?: string | null;
      created_at: string;
    }>;
  }

  static async getStyleGuideCreationsInRange(
    startIso: string,
    endIsoExclusive?: string,
  ) {
    let q = supabase
      .from("style_guides")
      .select("user_id, created_at")
      .gte("created_at", startIso);
    if (endIsoExclusive) {
      q = q.lt("created_at", endIsoExclusive);
    }
    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as Array<{ user_id: string; created_at: string }>;
  }

  /** Per-user export counts from `product_usage` / `export_deck` (see EventTracking product usage). */
  static async getExportDeckUserCountsInRange(
    startIso: string,
    endIsoExclusive?: string,
  ): Promise<Map<string, number>> {
    let q = supabaseAdmin
      .from("analytics_events")
      .select("user_id")
      .eq("event_category", "product_usage")
      .eq("event_action", "export_deck")
      .gte("created_at", startIso)
      .limit(25000);
    if (endIsoExclusive) {
      q = q.lt("created_at", endIsoExclusive);
    }
    const { data, error } = await q;
    if (error) throw error;
    const map = new Map<string, number>();
    for (const row of data || []) {
      const uid = (row as { user_id?: string | null }).user_id;
      if (!uid) continue;
      map.set(uid, (map.get(uid) || 0) + 1);
    }
    return map;
  }

  private static planLabelFromTier(
    tier: string | null | undefined,
  ): "Free" | "Pro" | "Team" | "Enterprise" {
    const t = (tier || "free").toLowerCase();
    if (t.includes("enterprise")) return "Enterprise";
    if (t.includes("team")) return "Team";
    if (t.includes("pro")) return "Pro";
    return "Free";
  }

  private static roleFromJobTitle(
    raw: string | null | undefined,
  ): "Founder" | "Operator" | "Investor" | "Analyst" {
    const s = (raw || "").toLowerCase();
    if (/\b(founder|co-founder|cofounder|ceo|cto|coo|owner)\b/.test(s)) {
      return "Founder";
    }
    if (/\b(investor|vc|venture|partner)\b/.test(s)) return "Investor";
    if (/\b(analyst|research|data scientist|scientist)\b/.test(s)) {
      return "Analyst";
    }
    return "Operator";
  }

  private static funnelJobCountsForCohort(
    cohortIds: Set<string>,
    jobs: Array<{ user_id: string }>,
  ): { first: number; repeat: number; habitual: number } {
    const jobCountMap = new Map<string, number>();
    for (const j of jobs) {
      if (!cohortIds.has(j.user_id)) continue;
      jobCountMap.set(j.user_id, (jobCountMap.get(j.user_id) || 0) + 1);
    }
    let first = 0;
    let repeat = 0;
    let habitual = 0;
    for (const uid of cohortIds) {
      const c = jobCountMap.get(uid) || 0;
      if (c >= 1) first++;
      if (c >= 2) repeat++;
      if (c >= 4) habitual++;
    }
    return { first, repeat, habitual };
  }

  private static stagesFromUsageMap(
    cohortSize: number,
    cohortIds: Set<string>,
    useCounts: Map<string, number>,
  ): {
    discovered: number;
    firstUse: number;
    repeat: number;
    habitual: number;
  } {
    const D = Math.max(1, cohortSize);
    let a = 0;
    let b = 0;
    let c = 0;
    for (const uid of cohortIds) {
      const n = useCounts.get(uid) || 0;
      if (n >= 1) a++;
      if (n >= 2) b++;
      if (n >= 4) c++;
    }
    return {
      discovered: 100,
      firstUse: Math.round((100 * a) / D),
      repeat: Math.round((100 * b) / D),
      habitual: Math.round((100 * c) / D),
    };
  }

  private static usageMapFromJobType(
    jobs: Array<{ user_id: string; type?: string | null }>,
    typeLc: string,
    cohortIds: Set<string>,
  ): Map<string, number> {
    const m = new Map<string, number>();
    for (const j of jobs) {
      const t = String(j.type || "").toLowerCase();
      if (t !== typeLc) continue;
      if (!cohortIds.has(j.user_id)) continue;
      m.set(j.user_id, (m.get(j.user_id) || 0) + 1);
    }
    return m;
  }

  private static usageMapFromStyleGuides(
    rows: Array<{ user_id: string }>,
    cohortIds: Set<string>,
  ): Map<string, number> {
    const m = new Map<string, number>();
    for (const r of rows) {
      if (!cohortIds.has(r.user_id)) continue;
      m.set(r.user_id, (m.get(r.user_id) || 0) + 1);
    }
    return m;
  }

  private static usageMapFromExportCounts(
    exportMap: Map<string, number>,
    cohortIds: Set<string>,
  ): Map<string, number> {
    const m = new Map<string, number>();
    for (const [uid, n] of exportMap) {
      if (!cohortIds.has(uid)) continue;
      m.set(uid, n);
    }
    return m;
  }

  private static usageMapCollab(
    collabMembers: any[],
    docCollaborators: any[],
    cohortIds: Set<string>,
  ): Map<string, number> {
    const m = new Map<string, number>();
    for (const row of collabMembers || []) {
      const uid = row.user_id as string;
      if (!uid || !cohortIds.has(uid)) continue;
      m.set(uid, (m.get(uid) || 0) + 1);
    }
    for (const row of docCollaborators || []) {
      const uid = row.user_id as string;
      if (!uid || !cohortIds.has(uid)) continue;
      m.set(uid, (m.get(uid) || 0) + 1);
    }
    return m;
  }

  private static usageMapVoiceFromEvents(
    events: Array<{
      user_id: string | null;
      event_name: string;
      event_action: string;
    }>,
    cohortIds: Set<string>,
  ): Map<string, number> {
    const m = new Map<string, number>();
    for (const e of events) {
      const uid = e.user_id;
      if (!uid || !cohortIds.has(uid)) continue;
      const blob = `${e.event_name} ${e.event_action}`.toLowerCase();
      if (!blob.includes("voice")) continue;
      m.set(uid, (m.get(uid) || 0) + 1);
    }
    return m;
  }

  private static segmentStageValues(
    cohortUsers: any[],
    jobsInWindow: Array<{ user_id: string }>,
  ): number[] {
    const cohortIds = new Set<string>(
      cohortUsers.map((u: { id: string }) => u.id),
    );
    const D = cohortUsers.length;
    if (D <= 0) return [0, 0, 0, 0];
    const { first, repeat, habitual } = SupabaseDB.funnelJobCountsForCohort(
      cohortIds,
      jobsInWindow,
    );
    return [
      100,
      Math.round((100 * first) / D),
      Math.round((100 * repeat) / D),
      Math.round((100 * habitual) / D),
    ];
  }

  /**
   * Admin /feature-adoption payload slices derived from cohort signups, jobs, collab,
   * style guides, exports, and `feature_adoption` analytics (see EventTrackingService.trackFeatureUsage).
   */
  static async computeAdminFeatureAdoptionBundle(args: {
    days: number;
    collabMembers: any[];
    docCollaborators: any[];
  }) {
    const days = Math.max(1, args.days);
    const nowMs = Date.now();
    const currStart = new Date(nowMs - days * 86400000).toISOString();
    const prevStart = new Date(nowMs - 2 * days * 86400000).toISOString();
    const prevEnd = currStart;

    const membersChartSince = new Date(nowMs - 365 * 86400000).toISOString();
    const [
      usersCurr,
      usersPrev,
      jobsCurr,
      jobsPrev,
      styleCurr,
      exportMap,
      featEvents,
      membersForChart,
      threadRows,
    ] = await Promise.all([
      SupabaseDB.getUsersCreatedInRange(currStart),
      SupabaseDB.getUsersCreatedInRange(prevStart, prevEnd),
      SupabaseDB.getGenerationJobsTypedInRange(currStart),
      SupabaseDB.getGenerationJobsTypedInRange(prevStart, prevEnd),
      SupabaseDB.getStyleGuideCreationsInRange(currStart),
      SupabaseDB.getExportDeckUserCountsInRange(currStart),
      EventTrackingService.getFeatureAdoptionAnalyticsRows(currStart),
      SupabaseDB.getCollabMembers(membersChartSince),
      (async () => {
        const weekAgo = new Date(nowMs - 7 * 86400000).toISOString();
        const { data, error } = await supabaseAdmin
          .from("thread_messages")
          .select("created_at")
          .gte("created_at", weekAgo)
          .limit(50000);
        if (error) return [];
        return data || [];
      })(),
    ]);

    const cohortCurrIds = new Set<string>(
      (usersCurr as { id: string }[]).map((u) => u.id),
    );
    const cohortPrevIds = new Set<string>(
      (usersPrev as { id: string }[]).map((u) => u.id),
    );

    const jobsCurrCohort = jobsCurr.filter((j) => cohortCurrIds.has(j.user_id));
    const jobsPrevCohort = jobsPrev.filter((j) => cohortPrevIds.has(j.user_id));

    const discoveredCurr = usersCurr.length;
    const discoveredPrev = usersPrev.length;
    const fc = SupabaseDB.funnelJobCountsForCohort(cohortCurrIds, jobsCurrCohort);
    const fp = SupabaseDB.funnelJobCountsForCohort(cohortPrevIds, jobsPrevCohort);

    const exportUseCurr = SupabaseDB.usageMapFromExportCounts(
      exportMap,
      cohortCurrIds,
    );

    const collabUseCurr = SupabaseDB.usageMapCollab(
      args.collabMembers,
      args.docCollaborators,
      cohortCurrIds,
    );
    const styleUseCurr = SupabaseDB.usageMapFromStyleGuides(
      styleCurr,
      cohortCurrIds,
    );
    const voiceUseCurr = SupabaseDB.usageMapVoiceFromEvents(
      featEvents,
      cohortCurrIds,
    );

    const FEATURE_DEFS: Array<{
      id: string;
      name: string;
      usage: Map<string, number>;
    }> = [
      {
        id: "brand-uploads",
        name: "Brand Uploads",
        usage: styleUseCurr,
      },
      {
        id: "collaboration",
        name: "Collaboration",
        usage: collabUseCurr,
      },
      {
        id: "export-types",
        name: "Export Types",
        usage: exportUseCurr,
      },
      {
        id: "ai-narration",
        name: "AI Narration",
        usage: SupabaseDB.usageMapFromJobType(jobsCurr, "document", cohortCurrIds),
      },
      {
        id: "voice-input",
        name: "Voice Input",
        usage: voiceUseCurr,
      },
      {
        id: "templates",
        name: "Templates",
        usage: SupabaseDB.usageMapFromJobType(
          jobsCurr,
          "presentation",
          cohortCurrIds,
        ),
      },
      {
        id: "chart-builder",
        name: "Chart Builder",
        usage: SupabaseDB.usageMapFromJobType(jobsCurr, "chart", cohortCurrIds),
      },
      {
        id: "spreadsheet-editor",
        name: "Spreadsheet Editor",
        usage: SupabaseDB.usageMapFromJobType(
          jobsCurr,
          "spreadsheet",
          cohortCurrIds,
        ),
      },
    ];

    const featureRows = FEATURE_DEFS.map((def) => {
      const stages = SupabaseDB.stagesFromUsageMap(
        discoveredCurr,
        cohortCurrIds,
        def.usage,
      );
      const adoptionScore = Math.round(
        (stages.firstUse + stages.repeat + stages.habitual) / 3,
      );
      return {
        id: def.id,
        name: def.name,
        stages,
        adoptionScore,
      };
    }).sort((a, b) => b.adoptionScore - a.adoptionScore);

    const topFeatureRows = featureRows.map((f) => ({
      feature: f.name,
      discovered: f.stages.discovered,
      firstUse: f.stages.firstUse,
      repeat: f.stages.repeat,
      habitual: f.stages.habitual,
    }));

    const planOrder = ["Free", "Pro", "Team", "Enterprise"] as const;
    const planBars = planOrder.map((label) => {
      const segment = (usersCurr as any[]).filter(
        (u) => SupabaseDB.planLabelFromTier(u.tier) === label,
      );
      return {
        label,
        values: SupabaseDB.segmentStageValues(segment, jobsCurrCohort),
      };
    });

    const roleOrder = ["Founder", "Operator", "Investor", "Analyst"] as const;
    const roleBars = roleOrder.map((label) => {
      const segment = (usersCurr as any[]).filter(
        (u) => SupabaseDB.roleFromJobTitle(u.job_title) === label,
      );
      return {
        label,
        values: SupabaseDB.segmentStageValues(segment, jobsCurrCohort),
      };
    });

    const regionOrder = [
      "N. America",
      "Europe",
      "Asia",
      "Other",
    ] as const;
    const regionBars = regionOrder.map((label) => {
      const segment = (usersCurr as any[]).filter(
        (u) => SupabaseDB.regionFromCountry(u.country) === label,
      );
      return {
        label,
        values: SupabaseDB.segmentStageValues(segment, jobsCurrCohort),
      };
    });

    const monthShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthLabels: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(nowMs);
      d.setMonth(d.getMonth() - i);
      monthLabels.push(monthShort[d.getMonth()]);
    }
    const bucketKeys: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(nowMs);
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      bucketKeys.push(key);
    }
    const monthBuckets = new Map<string, number>();
    for (const k of bucketKeys) monthBuckets.set(k, 0);
    for (const row of membersForChart || []) {
      const raw = (row as { created_at?: string }).created_at;
      if (!raw) continue;
      const d = new Date(raw);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthBuckets.has(key)) {
        monthBuckets.set(key, (monthBuckets.get(key) || 0) + 1);
      }
    }
    const bars = bucketKeys.map((k) => monthBuckets.get(k) || 0);
    const trend = bars.map((v, i) => {
      const prev = i > 0 ? bars[i - 1] : v;
      return Math.max(0, Math.round(v * 0.88 + prev * 0.12));
    });
    const maxMembersChart = Math.max(...bars, ...trend, 10);

    const dayMap = new Map<string, number>();
    for (const row of threadRows || []) {
      const raw = (row as { created_at?: string }).created_at;
      if (!raw) continue;
      const key = raw.slice(0, 10);
      dayMap.set(key, (dayMap.get(key) || 0) + 1);
    }
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const commentLabels: string[] = [];
    const commentCounts: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(nowMs);
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      commentLabels.push(dayNames[d.getUTCDay()]);
      commentCounts.push(dayMap.get(key) || 0);
    }
    const commentMax = Math.max(...commentCounts, 1);

    return {
      funnelCurr: {
        discovered: discoveredCurr,
        firstUse: fc.first,
        repeat: fc.repeat,
        habitual: fc.habitual,
      },
      funnelPrev: {
        discovered: discoveredPrev,
        firstUse: fp.first,
        repeat: fp.repeat,
        habitual: fp.habitual,
      },
      featureAdoptionGrid: { features: featureRows },
      topFeatures: { rows: topFeatureRows },
      planBreakdown: { plans: planBars },
      roleBreakdown: { plans: roleBars },
      regionBreakdown: { plans: regionBars },
      membersAdded: {
        months: monthLabels,
        bars,
        trend,
        max: maxMembersChart,
      },
      commentsPerDocument: {
        days: commentLabels,
        data: commentCounts,
        min: 0,
        max: commentMax,
      },
    };
  }

  static async getDocumentCollaborators(since?: string) {
    let query = supabase.from("document_collaborators").select("*");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }
  static async getCollabProjects(since?: string) {
    let query = supabase.from("collab_projects").select("*");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }
  static async getCollabMembers(since?: string) {
    let query = supabase.from("collab_project_members").select("*");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  }

  static async getNewUsersPreviousDays(
    days: number,
    audienceUserIds?: Set<string> | null,
  ) {
    if (audienceUserIds && audienceUserIds.size === 0) return 0;

    const now = Date.now();

    const start = new Date(now - days * 2 * 86400000).toISOString();
    const end = new Date(now - days * 86400000).toISOString();

    if (!audienceUserIds) {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", start)
        .lt("created_at", end);

      if (error) throw error;

      return count || 0;
    }

    let total = 0;
    for (const chunk of SupabaseDB.chunkIds([...audienceUserIds], 100)) {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .in("id", chunk)
        .gte("created_at", start)
        .lt("created_at", end);

      if (error) throw error;

      total += count || 0;
    }

    return total;
  }

  // ===== ANALYTICS EVENTS =====
  static async createAnalyticsEvent(eventData: {
    user_id?: string;
    user_email?: string;
    event_name: string;
    event_category: string;
    event_action: string;
    session_id?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    referrer?: string;
    ip_address?: string;
    user_agent?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    ai_model?: string;
    duration_ms?: number;
    tokens_used?: number;
    cost_usd?: number;
    resource_id?: string;
    resource_type?: string;
    properties?: any;
  }) {
    const { data, error } = await supabaseAdmin
      .from("analytics_events")
      .insert(eventData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAnalyticsEvents(options: {
    userId?: string;
    eventName?: string;
    eventCategory?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    let query = supabaseAdmin
      .from("analytics_events")
      .select("*");

    if (options.userId) {
      query = query.eq("user_id", options.userId);
    }

    if (options.eventName) {
      query = query.eq("event_name", options.eventName);
    }

    if (options.eventCategory) {
      query = query.eq("event_category", options.eventCategory);
    }

    if (options.startDate) {
      query = query.gte("created_at", options.startDate);
    }

    if (options.endDate) {
      query = query.lte("created_at", options.endDate);
    }

    query = query.order("created_at", { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // ===== USER SESSIONS =====
  static async createSession(sessionData: {
    user_id?: string;
    session_id: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    referrer?: string;
    ip_address?: string;
    user_agent?: string;
    device_type?: string;
    browser?: string;
    os?: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from("user_sessions")
      .insert(sessionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSessionById(sessionId: string) {
    const { data, error } = await supabaseAdmin
      .from("user_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (error && error.code === "PGRST116") return null;
    if (error) throw error;
    return data;
  }

  static async getUserSessions(userId: string, limit: number = 50) {
    const { data, error } = await supabaseAdmin
      .from("user_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async updateSession(sessionId: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from("user_sessions")
      .update(updates)
      .eq("session_id", sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getActiveSessions(userId?: string) {
    let query = supabaseAdmin
      .from("user_sessions")
      .select("*")
      .eq("is_active", true);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.order("started_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  // ===== USER ACTIVATIONS =====
  static async getUserActivation(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("user_activations")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") return null;
    if (error) throw error;
    return data;
  }

  static async createUserActivation(userId: string, activationData: any) {
    const { data, error } = await supabaseAdmin
      .from("user_activations")
      .insert({
        user_id: userId,
        ...activationData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUserActivation(userId: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from("user_activations")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getActivatedUsersCount(
    since?: string,
    audienceUserIds?: Set<string> | null,
  ) {
    if (audienceUserIds && audienceUserIds.size === 0) return 0;

    if (!audienceUserIds) {
      let query = supabaseAdmin
        .from("user_activations")
        .select("*", { count: "exact", head: true })
        .eq("is_activated", true);

      if (since) {
        query = query.gte("activated_at", since);
      }

      const { count, error } = await query;

      if (error) throw error;
      return count || 0;
    }

    let total = 0;
    for (const chunk of SupabaseDB.chunkIds([...audienceUserIds], 100)) {
      let query = supabaseAdmin
        .from("user_activations")
        .select("*", { count: "exact", head: true })
        .eq("is_activated", true)
        .in("user_id", chunk);

      if (since) {
        query = query.gte("activated_at", since);
      }

      const { count, error } = await query;

      if (error) throw error;

      total += count || 0;
    }

    return total;
  }

  static async getTotalJobsCount(
    since?: string,
    audienceUserIds?: Set<string> | null,
  ) {
    if (audienceUserIds && audienceUserIds.size === 0) return 0;

    if (!audienceUserIds) {
      let query = supabase
        .from("generation_jobs")
        .select("*", { count: "exact", head: true });

      if (since) {
        query = query.gte("created_at", since);
      }

      const { count, error } = await query;

      if (error) throw error;

      return count || 0;
    }

    let total = 0;
    for (const chunk of SupabaseDB.chunkIds([...audienceUserIds], 100)) {
      let query = supabase
        .from("generation_jobs")
        .select("*", { count: "exact", head: true })
        .in("user_id", chunk);

      if (since) {
        query = query.gte("created_at", since);
      }

      const { count, error } = await query;

      if (error) throw error;

      total += count || 0;
    }

    return total;
  }

  static async getFailedJobsCount(
    since?: string,
    audienceUserIds?: Set<string> | null,
  ) {
    if (audienceUserIds && audienceUserIds.size === 0) return 0;

    if (!audienceUserIds) {
      let query = supabase
        .from("generation_jobs")
        .select("*", { count: "exact", head: true })
        .or("status.eq.failed,error.not.is.null,error_message.not.is.null");

      if (since) {
        query = query.gte("created_at", since);
      }

      const { count, error } = await query;

      if (error) throw error;

      return count || 0;
    }

    let total = 0;
    for (const chunk of SupabaseDB.chunkIds([...audienceUserIds], 100)) {
      let query = supabase
        .from("generation_jobs")
        .select("*", { count: "exact", head: true })
        .in("user_id", chunk)
        .or("status.eq.failed,error.not.is.null,error_message.not.is.null");

      if (since) {
        query = query.gte("created_at", since);
      }

      const { count, error } = await query;

      if (error) throw error;

      total += count || 0;
    }

    return total;
  }

  /**
   * Distinct users with generation activity: last 7d vs prior 7d.
   * Used as a product churn / engagement proxy (no billing data).
   */
  static async getWeeklyActiveCreatorsComparison(
    audienceUserIds?: Set<string> | null,
  ): Promise<{
    currentWindow: number;
    previousWindow: number;
    jobsEver: number;
  }> {
    if (audienceUserIds && audienceUserIds.size === 0) {
      return { currentWindow: 0, previousWindow: 0, jobsEver: 0 };
    }

    const now = Date.now();
    const sevenMs = 7 * 86400000;
    const sevenDaysAgoIso = new Date(now - sevenMs).toISOString();
    const fourteenDaysAgoIso = new Date(now - 2 * sevenMs).toISOString();

    const inAudience = (uid: string) =>
      !audienceUserIds || audienceUserIds.has(uid);

    const [{ data: currentRows, error: errCurrent }, { data: prevRows, error: errPrev }] =
      await Promise.all([
        supabase
          .from("generation_jobs")
          .select("user_id")
          .gte("created_at", sevenDaysAgoIso),
        supabase
          .from("generation_jobs")
          .select("user_id")
          .gte("created_at", fourteenDaysAgoIso)
          .lt("created_at", sevenDaysAgoIso),
      ]);

    if (errCurrent) throw errCurrent;
    if (errPrev) throw errPrev;

    let jobsEverTotal = 0;
    if (!audienceUserIds) {
      const { count, error: errCount } = await supabase
        .from("generation_jobs")
        .select("*", { count: "exact", head: true });
      if (errCount) throw errCount;
      jobsEverTotal = count || 0;
    } else {
      for (const chunk of SupabaseDB.chunkIds([...audienceUserIds], 100)) {
        const { count, error } = await supabase
          .from("generation_jobs")
          .select("*", { count: "exact", head: true })
          .in("user_id", chunk);
        if (error) throw error;
        jobsEverTotal += count || 0;
      }
    }

    const currentWindow = new Set(
      (currentRows || [])
        .map((r: any) => r.user_id)
        .filter((uid: string) => uid && inAudience(uid)),
    ).size;
    const previousWindow = new Set(
      (prevRows || [])
        .map((r: any) => r.user_id)
        .filter((uid: string) => uid && inAudience(uid)),
    ).size;

    return {
      currentWindow,
      previousWindow,
      jobsEver: jobsEverTotal,
    };
  }

  // =============================================================
  // ADMIN: AI PERFORMANCE
  // =============================================================

  /**
   * Read `ai_performance` events written by {@link EventTrackingService.trackAIGeneration}
   * (and product_usage rows for `AI Generation Failed`) in [startIso, endIsoExclusive).
   * Used by the admin AI Performance dashboard to compute latency, model mix,
   * and acceptance metrics from real telemetry.
   */
  static async getAiPerformanceEventsInRange(
    startIso: string,
    endIsoExclusive?: string,
    limit = 25000,
  ): Promise<
    Array<{
      created_at: string;
      user_id: string | null;
      ai_model: string | null;
      duration_ms: number | null;
      tokens_used: number | null;
      cost_usd: number | null;
      event_name: string;
      event_action: string;
      event_category: string;
      properties: Record<string, unknown> | null;
    }>
  > {
    let q = supabaseAdmin
      .from("analytics_events")
      .select(
        "created_at, user_id, ai_model, duration_ms, tokens_used, cost_usd, event_name, event_action, event_category, properties",
      )
      .or(
        // Successful generations live under ai_performance/ai_generation;
        // failures are emitted under product_usage with event_name "AI Generation Failed"
        "event_category.eq.ai_performance,event_name.eq.AI Generation Failed",
      )
      .gte("created_at", startIso)
      .limit(limit);
    if (endIsoExclusive) q = q.lt("created_at", endIsoExclusive);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as Array<{
      created_at: string;
      user_id: string | null;
      ai_model: string | null;
      duration_ms: number | null;
      tokens_used: number | null;
      cost_usd: number | null;
      event_name: string;
      event_action: string;
      event_category: string;
      properties: Record<string, unknown> | null;
    }>;
  }

  /** Generation jobs in range with duration-relevant fields. */
  static async getGenerationJobsForLatencyInRange(
    startIso: string,
    endIsoExclusive?: string,
  ) {
    let q = supabase
      .from("generation_jobs")
      .select(
        "id, user_id, type, status, error, error_message, progress, created_at, updated_at",
      )
      .gte("created_at", startIso);
    if (endIsoExclusive) q = q.lt("created_at", endIsoExclusive);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as Array<{
      id: string;
      user_id: string;
      type?: string | null;
      status?: string | null;
      error?: string | null;
      error_message?: string | null;
      progress?: number | null;
      created_at: string;
      updated_at?: string | null;
    }>;
  }

  private static percentile(arr: number[], p: number): number {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const rank = Math.min(
      sorted.length - 1,
      Math.max(0, Math.floor((p / 100) * sorted.length)),
    );
    return sorted[rank] || 0;
  }

  private static average(arr: number[]): number {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  private static median(arr: number[]): number {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /** Duration in ms inferred from a job's created/updated timestamps; null when unusable. */
  private static durationMsFromJob(j: {
    status?: string | null;
    created_at: string;
    updated_at?: string | null;
  }): number | null {
    if (!j.updated_at) return null;
    const start = new Date(j.created_at).getTime();
    const end = new Date(j.updated_at).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
    const ms = end - start;
    if (ms <= 0 || ms > 6 * 60 * 60 * 1000) return null;
    return ms;
  }

  private static buildAiTrendBuckets(args: {
    days: number;
    samples: Array<{ tMs: number; durationMs: number }>;
  }): { labels: string[]; series: number[] } {
    const { days, samples } = args;
    const nBuckets = 12;
    const nowMs = Date.now();
    const totalSpanMs = days * 86400000;
    const startMs = nowMs - totalSpanMs;
    const bucketSpanMs = totalSpanMs / nBuckets;

    const buckets: number[][] = Array.from({ length: nBuckets }, () => []);
    for (const s of samples) {
      if (!Number.isFinite(s.durationMs) || s.durationMs <= 0) continue;
      if (s.tMs < startMs || s.tMs > nowMs) continue;
      let idx = Math.floor((s.tMs - startMs) / bucketSpanMs);
      if (idx >= nBuckets) idx = nBuckets - 1;
      if (idx < 0) idx = 0;
      buckets[idx].push(s.durationMs);
    }
    const series = buckets.map((b) =>
      b.length ? Math.round(SupabaseDB.median(b)) : 0,
    );

    const monthShort = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    const labels: string[] = [];
    for (let i = 0; i < nBuckets; i++) {
      const center = startMs + (i + 0.5) * bucketSpanMs;
      const d = new Date(center);
      if (days >= 180) {
        labels.push(monthShort[d.getMonth()]);
      } else if (days >= 30) {
        labels.push(`${monthShort[d.getMonth()]} ${d.getDate()}`);
      } else if (days >= 7) {
        labels.push(`${monthShort[d.getMonth()]} ${d.getDate()}`);
      } else {
        labels.push(`${d.getHours().toString().padStart(2, "0")}:00`);
      }
    }
    return { labels, series };
  }

  /**
   * Admin /ai-performance payload slices computed from `ai_performance` events
   * (see {@link EventTrackingService.trackAIGeneration}) with `generation_jobs` as fallback.
   */
  static async computeAdminAiPerformanceBundle(args: { days: number }) {
    const days = Math.max(1, args.days);
    const nowMs = Date.now();
    const currStart = new Date(nowMs - days * 86400000).toISOString();
    const prevStart = new Date(nowMs - 2 * days * 86400000).toISOString();
    const prevEnd = currStart;

    const [eventsCurr, eventsPrev, jobsCurr, jobsPrev] = await Promise.all([
      SupabaseDB.getAiPerformanceEventsInRange(currStart),
      SupabaseDB.getAiPerformanceEventsInRange(prevStart, prevEnd),
      SupabaseDB.getGenerationJobsForLatencyInRange(currStart),
      SupabaseDB.getGenerationJobsForLatencyInRange(prevStart, prevEnd),
    ]);

    const isFailEvent = (e: { event_name: string }) =>
      e.event_name === "AI Generation Failed";
    const isSuccessEvent = (e: {
      event_category: string;
      event_action: string;
    }) =>
      e.event_category === "ai_performance" &&
      e.event_action === "ai_generation";

    // ---------- Acceptance / completion ----------
    const successCurr = eventsCurr.filter(isSuccessEvent).length;
    const failCurr = eventsCurr.filter(isFailEvent).length;
    const totalCurr = successCurr + failCurr;

    const successPrev = eventsPrev.filter(isSuccessEvent).length;
    const failPrev = eventsPrev.filter(isFailEvent).length;
    const totalPrev = successPrev + failPrev;

    // Fallback to jobs when telemetry is empty.
    const jobsCompletedCurr = jobsCurr.filter(
      (j) => (j.status || "").toLowerCase() === "completed",
    ).length;
    const jobsFailedCurr = jobsCurr.filter(
      (j) => (j.status || "").toLowerCase() === "failed",
    ).length;
    const jobsPendingCurr = jobsCurr.filter((j) =>
      ["pending", "queued", "processing", "running"].includes(
        (j.status || "").toLowerCase(),
      ),
    ).length;
    const jobsTotalCurr = jobsCurr.length;

    const acceptanceRate =
      totalCurr > 0
        ? (successCurr / totalCurr) * 100
        : jobsTotalCurr > 0
          ? (jobsCompletedCurr / jobsTotalCurr) * 100
          : 0;
    const acceptancePrev =
      totalPrev > 0
        ? (successPrev / totalPrev) * 100
        : 0;

    const completedPct =
      jobsTotalCurr > 0 ? (jobsCompletedCurr / jobsTotalCurr) * 100 : 0;
    const partialPct =
      jobsTotalCurr > 0 ? (jobsPendingCurr / jobsTotalCurr) * 100 : 0;
    const abandonedPct =
      jobsTotalCurr > 0 ? (jobsFailedCurr / jobsTotalCurr) * 100 : 0;

    // ---------- Latency ----------
    const eventDurationsCurr = eventsCurr
      .filter(isSuccessEvent)
      .map((e) => e.duration_ms || 0)
      .filter((v) => v > 0);
    const eventDurationsPrev = eventsPrev
      .filter(isSuccessEvent)
      .map((e) => e.duration_ms || 0)
      .filter((v) => v > 0);
    const jobDurationsCurr = jobsCurr
      .map((j) => SupabaseDB.durationMsFromJob(j))
      .filter((v): v is number => v != null);
    const jobDurationsPrev = jobsPrev
      .map((j) => SupabaseDB.durationMsFromJob(j))
      .filter((v): v is number => v != null);
    const latenciesCurr = eventDurationsCurr.length
      ? eventDurationsCurr
      : jobDurationsCurr;
    const latenciesPrev = eventDurationsPrev.length
      ? eventDurationsPrev
      : jobDurationsPrev;

    const avgLatencyCurrSec = latenciesCurr.length
      ? SupabaseDB.average(latenciesCurr) / 1000
      : 0;
    const avgLatencyPrevSec = latenciesPrev.length
      ? SupabaseDB.average(latenciesPrev) / 1000
      : 0;

    // ---------- Trend buckets (12) ----------
    const trendSamples = (
      eventDurationsCurr.length ? eventsCurr.filter(isSuccessEvent) : []
    ).map((e) => ({
      tMs: new Date(e.created_at).getTime(),
      durationMs: e.duration_ms || 0,
    }));
    const trendSamplesFromJobs = jobsCurr
      .map((j) => {
        const ms = SupabaseDB.durationMsFromJob(j);
        return ms != null
          ? { tMs: new Date(j.created_at).getTime(), durationMs: ms }
          : null;
      })
      .filter((s): s is { tMs: number; durationMs: number } => s != null);
    const useEventTrend = trendSamples.length > 0;
    const { labels: trendLabels, series: trendSeriesMs } =
      SupabaseDB.buildAiTrendBuckets({
        days,
        samples: useEventTrend ? trendSamples : trendSamplesFromJobs,
      });
    const trendMaxMs = Math.max(...trendSeriesMs, 1000);

    // ---------- Regenerations (failures by tool/type) ----------
    const regenByType = new Map<string, number>();
    for (const e of eventsCurr) {
      if (!isFailEvent(e)) continue;
      const t = String(
        (e.properties as { generation_type?: string } | null)?.generation_type ||
          "unknown",
      );
      regenByType.set(t, (regenByType.get(t) || 0) + 1);
    }
    for (const j of jobsCurr) {
      if ((j.status || "").toLowerCase() !== "failed") continue;
      const t = String(j.type || "unknown");
      regenByType.set(t, (regenByType.get(t) || 0) + 1);
    }
    const regenTotal = Array.from(regenByType.values()).reduce(
      (a, b) => a + b,
      0,
    );
    const regenRows = Array.from(regenByType.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, count]) => {
        const share = regenTotal > 0 ? (count / regenTotal) * 100 : 0;
        return {
          label: label.charAt(0).toUpperCase() + label.slice(1),
          caption: `Share of failures: ${share.toFixed(0)}%`,
          value: count.toLocaleString(),
        };
      });
    const regenPerOutput = jobsTotalCurr > 0 ? regenTotal / jobsTotalCurr : 0;
    const regenPerOutputPrev =
      jobsPrev.length > 0
        ? jobsPrev.filter((j) => (j.status || "").toLowerCase() === "failed")
            .length / jobsPrev.length
        : 0;

    // ---------- Logs ----------
    const failEventLogs = eventsCurr
      .filter(isFailEvent)
      .slice(0, 20)
      .map((e, i) => {
        const props = (e.properties || {}) as Record<string, unknown>;
        return {
          id: `err-evt-${i}`,
          severity: "Error",
          message: String(
            props.error_message ||
              props.message ||
              "AI generation failed",
          ),
          timestamp: new Date(e.created_at).toUTCString(),
          model: e.ai_model || (props.ai_model as string) || "AI",
          tool: String(props.generation_type || "unknown"),
          detail:
            (props.stack as string) ||
            (props.error as string) ||
            String(props.error_message || ""),
        };
      });
    const failJobLogs = jobsCurr
      .filter((j) => (j.status || "").toLowerCase() === "failed")
      .slice(0, 20)
      .map((j, i) => ({
        id: `err-job-${i}`,
        severity: "Error",
        message: j.error_message || j.error || "Generation job failed",
        timestamp: new Date(j.created_at).toUTCString(),
        model: "AI",
        tool: j.type || "unknown",
        detail: j.error || j.error_message || "N/A",
      }));
    const errorLogs = (failEventLogs.length ? failEventLogs : failJobLogs).slice(
      0,
      20,
    );

    // Slow generations as "Timeouts" proxy: top 10 slowest in window.
    const slowSamples: Array<{
      ms: number;
      created_at: string;
      tool: string;
      model: string;
    }> = [];
    if (eventDurationsCurr.length) {
      for (const e of eventsCurr) {
        if (!isSuccessEvent(e)) continue;
        const ms = e.duration_ms || 0;
        if (ms <= 0) continue;
        slowSamples.push({
          ms,
          created_at: e.created_at,
          tool: String(
            (e.properties as { generation_type?: string } | null)
              ?.generation_type || "unknown",
          ),
          model: e.ai_model || "AI",
        });
      }
    } else {
      for (const j of jobsCurr) {
        const ms = SupabaseDB.durationMsFromJob(j);
        if (ms == null) continue;
        slowSamples.push({
          ms,
          created_at: j.created_at,
          tool: j.type || "unknown",
          model: "AI",
        });
      }
    }
    slowSamples.sort((a, b) => b.ms - a.ms);
    const timeoutThresholdMs = Math.max(8000, SupabaseDB.percentile(latenciesCurr, 95));
    const timeoutLogs = slowSamples
      .filter((s) => s.ms >= timeoutThresholdMs)
      .slice(0, 10)
      .map((s, i) => ({
        id: `timeout-${i}`,
        severity: "Timeout",
        message: `Slow generation: ${(s.ms / 1000).toFixed(1)}s on ${s.tool}`,
        timestamp: new Date(s.created_at).toUTCString(),
        model: s.model,
        tool: s.tool,
        detail: `Duration ${(s.ms / 1000).toFixed(1)}s exceeded p95 baseline ${(timeoutThresholdMs / 1000).toFixed(1)}s.`,
      }));

    // ---------- Alerts ----------
    const failureAlerts: Array<{
      id: string;
      title: string;
      severity: string;
      model: string;
      description: string;
      metric: string;
      time: string;
    }> = [];
    if (failCurr > 0 || jobsFailedCurr > 0) {
      const curRate =
        totalCurr > 0 ? (failCurr / totalCurr) * 100 : abandonedPct;
      const prevRate =
        totalPrev > 0 ? (failPrev / totalPrev) * 100 : 0;
      if (curRate >= 5 || (prevRate > 0 && curRate >= prevRate * 1.5)) {
        failureAlerts.push({
          id: "fs-1",
          title: "Failure rate elevated",
          severity: curRate >= 10 ? "Critical" : "Warning",
          model: "AI",
          description: `Failure rate is ${curRate.toFixed(1)}% (prev ${prevRate.toFixed(1)}%).`,
          metric: `${(failCurr || jobsFailedCurr).toLocaleString()} failures`,
          time: "now",
        });
      }
    }

    const latencyAlerts: Array<{
      id: string;
      title: string;
      severity: string;
      description: string;
      metric: string;
      time: string;
    }> = [];
    if (avgLatencyCurrSec > 0) {
      const delta = avgLatencyPrevSec > 0
        ? (avgLatencyCurrSec - avgLatencyPrevSec) / avgLatencyPrevSec
        : 0;
      if (avgLatencyCurrSec >= 10 || delta >= 0.25) {
        latencyAlerts.push({
          id: "lat-1",
          title:
            avgLatencyCurrSec >= 10
              ? "High latency detected"
              : "Latency increasing",
          severity: avgLatencyCurrSec >= 15 ? "Critical" : "Warning",
          description:
            avgLatencyPrevSec > 0
              ? `Avg ${avgLatencyCurrSec.toFixed(1)}s, ${(delta * 100).toFixed(0)}% vs previous.`
              : `Avg latency ${avgLatencyCurrSec.toFixed(1)}s in current window.`,
          metric: `${avgLatencyCurrSec.toFixed(1)}s avg`,
          time: "now",
        });
      }
    }

    return {
      // counts
      successCount: successCurr || jobsCompletedCurr,
      failCount: failCurr || jobsFailedCurr,
      totalCount: totalCurr || jobsTotalCurr,
      // numbers
      acceptanceRate,
      acceptanceRatePrev: acceptancePrev,
      avgLatencyCurrSec,
      avgLatencyPrevSec,
      regenPerOutput,
      regenPerOutputPrev,
      // pre-shaped panels
      promptSuccess: {
        successPct:
          totalCurr > 0
            ? Math.round((successCurr / totalCurr) * 100)
            : Math.round(completedPct),
        failedPct:
          totalCurr > 0
            ? 100 -
              Math.max(
                0,
                Math.min(100, Math.round((successCurr / totalCurr) * 100)),
              )
            : Math.round(100 - completedPct),
      },
      latencyTrend: {
        labels: trendLabels,
        // chart shows values in ms (yLabels suffix is "ms")
        series: trendSeriesMs,
        max: trendMaxMs,
      },
      regenerations: {
        rows: regenRows,
        total: regenTotal,
      },
      completion: {
        completedPct: Math.round(completedPct),
        partialPct: Math.round(partialPct),
        abandonedPct: Math.round(abandonedPct),
        total: jobsTotalCurr,
      },
      logs: { errors: errorLogs, timeouts: timeoutLogs },
      alerts: { failureSpikes: failureAlerts, latencyIssues: latencyAlerts },
    };
  }

  // =============================================================
  // ADMIN: PLATFORM HEALTH
  // =============================================================

  /** Count of `export_deck` events bucketed by `properties.format`. */
  static async getExportDeckDurationsInRange(
    startIso: string,
    endIsoExclusive?: string,
    limit = 8000,
  ): Promise<
    Array<{
      created_at: string;
      duration_ms: number | null;
      format: string;
    }>
  > {
    let q = supabaseAdmin
      .from("analytics_events")
      .select("created_at, duration_ms, properties")
      .eq("event_category", "product_usage")
      .eq("event_action", "export_deck")
      .gte("created_at", startIso)
      .limit(limit);
    if (endIsoExclusive) q = q.lt("created_at", endIsoExclusive);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map((row: any) => ({
      created_at: row.created_at as string,
      duration_ms:
        typeof row.duration_ms === "number" ? row.duration_ms : null,
      format: String(row.properties?.format ?? "other"),
    }));
  }

  /**
   * Admin /platform-health payload slices using `generation_jobs` durations as
   * the API performance proxy (no infra/APM dependency) plus export events for
   * the export queue card.
   */
  static async computeAdminPlatformHealthBundle(args: { days: number }) {
    const days = Math.max(1, args.days);
    const nowMs = Date.now();
    const currStart = new Date(nowMs - days * 86400000).toISOString();
    const prevStart = new Date(nowMs - 2 * days * 86400000).toISOString();
    const prevEnd = currStart;

    const [jobsCurr, jobsPrev, eventsCurr, exportsCurr] = await Promise.all([
      SupabaseDB.getGenerationJobsForLatencyInRange(currStart),
      SupabaseDB.getGenerationJobsForLatencyInRange(prevStart, prevEnd),
      SupabaseDB.getAiPerformanceEventsInRange(currStart),
      SupabaseDB.getExportDeckDurationsInRange(currStart),
    ]);

    // ---------- API percentiles (overall) ----------
    const allDurationsMs: number[] = [];
    for (const j of jobsCurr) {
      const ms = SupabaseDB.durationMsFromJob(j);
      if (ms != null) allDurationsMs.push(ms);
    }
    for (const e of eventsCurr) {
      if (e.event_category !== "ai_performance") continue;
      const ms = e.duration_ms || 0;
      if (ms > 0 && ms < 6 * 60 * 60 * 1000) allDurationsMs.push(ms);
    }
    const apiP50 = Math.round(SupabaseDB.percentile(allDurationsMs, 50));
    const apiP95 = Math.round(SupabaseDB.percentile(allDurationsMs, 95));
    const apiP99 = Math.round(SupabaseDB.percentile(allDurationsMs, 99));

    // ---------- Error / timeout rate ----------
    const failedCurr = jobsCurr.filter(
      (j) => (j.status || "").toLowerCase() === "failed",
    ).length;
    const totalCurr = jobsCurr.length;
    const errorRate = totalCurr > 0 ? (failedCurr / totalCurr) * 100 : 0;

    const failedPrev = jobsPrev.filter(
      (j) => (j.status || "").toLowerCase() === "failed",
    ).length;
    const totalPrev = jobsPrev.length;
    const errorRatePrev = totalPrev > 0 ? (failedPrev / totalPrev) * 100 : 0;

    // No explicit "timeout" status; treat upper-tail durations + status timeout as proxy.
    const timeoutThresholdMs = Math.max(
      30000,
      SupabaseDB.percentile(allDurationsMs, 99),
    );
    const timeoutCount = jobsCurr.reduce((acc, j) => {
      if ((j.status || "").toLowerCase() === "timeout") return acc + 1;
      const ms = SupabaseDB.durationMsFromJob(j);
      return acc + (ms != null && ms >= timeoutThresholdMs ? 1 : 0);
    }, 0);
    const timeoutRate = totalCurr > 0 ? (timeoutCount / totalCurr) * 100 : 0;
    const timeoutCountPrev = jobsPrev.reduce((acc, j) => {
      if ((j.status || "").toLowerCase() === "timeout") return acc + 1;
      const ms = SupabaseDB.durationMsFromJob(j);
      return acc + (ms != null && ms >= timeoutThresholdMs ? 1 : 0);
    }, 0);
    const timeoutRatePrev =
      totalPrev > 0 ? (timeoutCountPrev / totalPrev) * 100 : 0;

    // ---------- Endpoint table (job-type proxy) ----------
    type Bucket = {
      durations: number[];
      total: number;
      failed: number;
    };
    const byType = new Map<string, Bucket>();
    for (const j of jobsCurr) {
      const t = j.type || "unknown";
      const b = byType.get(t) || { durations: [], total: 0, failed: 0 };
      b.total++;
      if ((j.status || "").toLowerCase() === "failed") b.failed++;
      const ms = SupabaseDB.durationMsFromJob(j);
      if (ms != null) b.durations.push(ms);
      byType.set(t, b);
    }
    const windowHours = Math.max(days * 24, 1);
    const endpointRows = Array.from(byType.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .map(([type, b], i) => {
        const er = b.total > 0 ? (b.failed / b.total) * 100 : 0;
        const status: "healthy" | "degraded" | "down" =
          er >= 10 ? "down" : er >= 2 ? "degraded" : "healthy";
        return {
          id: `ep-${i}`,
          endpoint: `/api/${type}/generate`,
          method: "POST",
          p50: Math.round(SupabaseDB.percentile(b.durations, 50)),
          p95: Math.round(SupabaseDB.percentile(b.durations, 95)),
          p99: Math.round(SupabaseDB.percentile(b.durations, 99)),
          errorRate: +er.toFixed(2),
          callsPerHour: Math.max(0, Math.round(b.total / windowHours)),
          status,
        };
      });

    // ---------- Queue / Exports cards ----------
    const avgQueueSec = totalCurr > 0
      ? SupabaseDB.average(allDurationsMs) / 1000
      : 0;
    const queueStatus =
      avgQueueSec >= 30 ? "warning" : avgQueueSec >= 60 ? "critical" : "healthy";
    const queueLabel =
      avgQueueSec >= 30 ? "Elevated" : avgQueueSec >= 60 ? "Critical" : "Normal";
    const queueSubRows = endpointRows.slice(0, 4).map((row) => {
      const sec = row.p95 / 1000;
      return {
        label: `${row.endpoint.replace("/api/", "").replace("/generate", "")} queue`,
        value: +sec.toFixed(1),
        unit: "s",
        max: 60,
        status:
          sec >= 60 ? "critical" : sec >= 30 ? "warning" : "healthy",
      };
    });

    const exportFormats = new Map<string, number[]>();
    for (const ev of exportsCurr) {
      const ms = ev.duration_ms || 0;
      if (ms <= 0) continue;
      const fmt = ev.format.toLowerCase();
      const key = fmt.includes("pdf")
        ? "PDF"
        : fmt.includes("ppt")
          ? "PPTX"
          : fmt.includes("doc")
            ? "DOCX"
            : fmt.includes("xls")
              ? "XLSX"
              : "Other";
      const list = exportFormats.get(key) || [];
      list.push(ms);
      exportFormats.set(key, list);
    }
    const exportAvgSec = (() => {
      let total = 0;
      let n = 0;
      for (const list of exportFormats.values()) {
        for (const v of list) {
          total += v;
          n++;
        }
      }
      return n > 0 ? total / 1000 / n : 0;
    })();
    const exportSubRowsBase = ["PDF", "PPTX", "DOCX", "XLSX"];
    const exportSubRows = exportSubRowsBase.map((label) => {
      const list = exportFormats.get(label) || [];
      const sec = list.length ? SupabaseDB.average(list) / 1000 : 0;
      return {
        label,
        value: +sec.toFixed(1),
        unit: "s",
        max: 30,
        status: sec >= 20 ? "warning" : sec >= 30 ? "critical" : "healthy",
      };
    });
    const exportTotal = exportsCurr.length;
    const exportStatus =
      exportAvgSec >= 30 ? "warning" : exportAvgSec >= 60 ? "critical" : "healthy";

    // ---------- Logs ----------
    const incidents = jobsCurr
      .filter((j) => (j.status || "").toLowerCase() === "failed")
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10)
      .map((j, i) => {
        const ms = SupabaseDB.durationMsFromJob(j);
        return {
          id: `inc-${i}`,
          title: j.error_message || j.error || "Generation job failed",
          severity:
            (j.error_message || j.error || "").toLowerCase().includes("timeout")
              ? "High"
              : "Medium",
          status: "Active",
          service: j.type || "AI",
          timestamp: new Date(j.created_at).toUTCString(),
          duration: ms != null ? `${(ms / 1000).toFixed(1)}s` : "n/a",
          detail: j.error || j.error_message || "Unknown error",
        };
      });

    // ---------- Realtime alerts ----------
    const realtimeAlerts: Array<{
      id: string;
      title: string;
      severity: string;
      status: string;
      service: string;
      timestamp: string;
      description: string;
      metric: string;
    }> = [];
    if (errorRate > 0) {
      const elevated =
        errorRate >= 5 ||
        (errorRatePrev > 0 && errorRate >= errorRatePrev * 1.5);
      if (elevated) {
        realtimeAlerts.push({
          id: "rta-error",
          title: "Error rate elevated",
          severity: errorRate >= 10 ? "Critical" : "High",
          status: "Active",
          service: "Generation API",
          timestamp: "now",
          description: `Failed ${failedCurr.toLocaleString()} of ${totalCurr.toLocaleString()} jobs (${errorRate.toFixed(2)}%).`,
          metric: `${errorRate.toFixed(2)}% errors`,
        });
      }
    }
    if (timeoutRate > 0 && timeoutRate >= 1) {
      realtimeAlerts.push({
        id: "rta-timeout",
        title: "Slow / timeout jobs",
        severity: timeoutRate >= 5 ? "High" : "Medium",
        status: "Active",
        service: "Generation API",
        timestamp: "now",
        description: `${timeoutCount.toLocaleString()} jobs exceeded ${(timeoutThresholdMs / 1000).toFixed(0)}s in window.`,
        metric: `${timeoutRate.toFixed(2)}% timeouts`,
      });
    }

    const failuresAlerts = incidents.slice(0, 5).map((inc, i) => ({
      id: `alert-${i}`,
      service: inc.service,
      title: inc.title,
      severity: inc.severity,
      status: inc.status,
      timestamp: inc.timestamp,
      description: inc.detail,
    }));

    return {
      apiPercentiles: {
        p50: apiP50,
        p95: apiP95,
        p99: apiP99,
        status:
          apiP95 >= 10000 ? "critical" : apiP95 >= 5000 ? "warning" : "healthy",
        statusLabel:
          apiP95 >= 10000
            ? "Critical"
            : apiP95 >= 5000
              ? "Elevated"
              : "Healthy",
      },
      errorRate: {
        valuePct: errorRate,
        prevPct: errorRatePrev,
        status:
          errorRate >= 5
            ? "critical"
            : errorRate >= 1
              ? "warning"
              : "healthy",
        statusLabel:
          errorRate >= 5
            ? "Critical"
            : errorRate >= 1
              ? "Elevated"
              : "Normal",
      },
      timeoutRate: {
        valuePct: timeoutRate,
        prevPct: timeoutRatePrev,
        status:
          timeoutRate >= 5
            ? "critical"
            : timeoutRate >= 1
              ? "warning"
              : "healthy",
        statusLabel:
          timeoutRate >= 5
            ? "Critical"
            : timeoutRate >= 1
              ? "Elevated"
              : "Normal",
      },
      endpointPerformance: { rows: endpointRows },
      monitoring: {
        queue: {
          value: avgQueueSec.toFixed(1),
          unit: "s avg",
          status: queueStatus,
          statusLabel: queueLabel,
          period: `Avg job duration · ${days}d window`,
          subRows: queueSubRows,
        },
        exports: {
          value: exportAvgSec.toFixed(1),
          unit: "s avg",
          status: exportStatus,
          statusLabel:
            exportAvgSec >= 60
              ? "Critical"
              : exportAvgSec >= 30
                ? "Elevated"
                : "Normal",
          period:
            exportTotal > 0
              ? `Across ${exportTotal.toLocaleString()} exports · ${days}d window`
              : "No export telemetry",
          subRows: exportSubRows,
        },
      },
      systemLogs: {
        incidents,
        deploys: [],
        releases: [],
      },
      realtimeAlerts: { alerts: realtimeAlerts },
      failuresAlerts: { alerts: failuresAlerts },
    };
  }
}

export default SupabaseDB;
