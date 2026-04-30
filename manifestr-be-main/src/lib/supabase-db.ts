/**
 * Supabase Database Helper
 * Clean interface for all database operations - NO TypeORM!
 */

import { supabase, supabaseAdmin } from "./supabase";

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

  static async getUsersCount(since?: string, search?: string) {
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

  static async getNewUsersLastDays(days: number) {
    const since = new Date(Date.now() - days * 86400000).toISOString();

    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since);

    if (error) throw error;

    return count || 0;
  }

  static async getTotalGenerationJobs() {
    const { count, error } = await supabase
      .from("generation_jobs")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  }

  static async getRecentUsers(limit = 5, since?: string) {
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

  static async getDAU(since?: string) {
    let query = supabase.from("generation_jobs").select("user_id");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;

    if (error) throw error;

    return new Set(data.map((d: any) => d.user_id)).size;
  }
  static async getMAU(since?: string) {
    let query = supabase.from("generation_jobs").select("user_id");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;

    if (error) throw error;

    return new Set(data.map((d: any) => d.user_id)).size;
  }

  static async getUserGrowthMonthly(since?: string) {
    let query = supabase.from("users").select("created_at");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;

    if (error) throw error;

    const map: Record<string, number> = {};

    data.forEach((u: any) => {
      const d = new Date(u.created_at);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;

      map[key] = (map[key] || 0) + 1;
    });

    const months = Object.keys(map);
    const values = Object.values(map);

    return { months, values };
  }

  static async getReturningVsNewMonthly(since?: string) {
    const { data } = await supabaseAdmin.auth.admin.listUsers();
  
    const newUsers = Array(12).fill(0);
    const returning = Array(12).fill(0);
  
    const sinceTime = since ? new Date(since).getTime() : null;
  
    data.users.forEach((u: any) => {
      if (!u.created_at) return;
  
      const created = new Date(u.created_at).getTime();
      const lastLogin = u.last_sign_in_at
        ? new Date(u.last_sign_in_at).getTime()
        : null;
  
      // ✅ APPLY FILTER
      if (sinceTime && created < sinceTime) return;
  
      const createdMonth = new Date(created).getMonth();
      newUsers[createdMonth]++;
  
      if (lastLogin && lastLogin !== created) {
        // also respect timeframe
        if (!sinceTime || lastLogin >= sinceTime) {
          const loginMonth = new Date(lastLogin).getMonth();
          returning[loginMonth]++;
        }
      }
    });
  
    const totalNew = newUsers.reduce((a, b) => a + b, 0);
    const totalReturning = returning.reduce((a, b) => a + b, 0);
  
    const returningPct = totalNew
      ? Math.round((totalReturning / totalNew) * 100)
      : 0;
  
    return {
      months: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ],
      newUsers,
      returning,
      returningPct,
    };
  }

  static async getPowerUsers(since?: string) {
    let query = supabaseAdmin
      .from("generation_jobs")
      .select("user_id, created_at");
  
    if (since) {
      query = query.gte("created_at", since);
    }
  
    const { data, error } = await query;
    if (error) throw error;
  
    const userMap: Record<string, number> = {};
  
    data?.forEach((j: any) => {
      userMap[j.user_id] = (userMap[j.user_id] || 0) + 1;
    });
  
    const sorted = Object.entries(userMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  
    const { data: users } = await supabaseAdmin
      .from("users")
      .select("id, email");
  
    const userLookup: Record<string, any> = {};
    users?.forEach((u) => {
      userLookup[u.id] = u;
    });
  
    return sorted.map(([userId, count], i) => ({
      id: `u-${i}`,
      name: userLookup[userId]?.email || userId,
      company: "N/A",
      outputsCreated: count,
      sessions: Math.floor(count / 2),
      lastActive: "recent",
      healthScore: Math.min(100, 50 + count),
    }));
  }

  static async getUsersByRegion(since?: string) {
    let query = supabaseAdmin
      .from("users")
      .select("country, created_at");
  
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
      const c = (u.country || "").toLowerCase();
  
      if (["usa", "canada"].includes(c)) map["N. America"]++;
      else if (["uk", "germany", "france"].includes(c)) map["Europe"]++;
      else if (["india", "pakistan", "china"].includes(c)) map["Asia"]++;
      else map["Other"]++;
    });
  
    const total = data?.length || 1;
  
    return Object.values(map).map((v) =>
      Math.round((v / total) * 100)
    );
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

  static async getDocumentCollaborators(since?: string) {
    let query = supabase
      .from("document_collaborators")
      .select("*");
  
    if (since) {
      query = query.gte("created_at", since);
    }
  
    const { data, error } = await query;
    if (error) throw error;
  
    return data || [];
  }
  static async getCollabProjects(since?: string) {
    let query = supabase
      .from("collab_projects")
      .select("*");
  
    if (since) {
      query = query.gte("created_at", since);
    }
  
    const { data, error } = await query;
    if (error) throw error;
  
    return data || [];
  }
  static async getCollabMembers(since?: string) {
    let query = supabase
      .from("collab_project_members")
      .select("*");
  
    if (since) {
      query = query.gte("created_at", since);
    }
  
    const { data, error } = await query;
    if (error) throw error;
  
    return data || [];
  }

  static async getNewUsersPreviousDays(days: number) {
    const now = Date.now();

    const start = new Date(now - days * 2 * 86400000).toISOString();
    const end = new Date(now - days * 86400000).toISOString();

    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", start)
      .lt("created_at", end);

    if (error) throw error;

    return count || 0;
  }

  static async getActivatedUsersCount(since?: string) {
    let query = supabase.from("generation_jobs").select("user_id");

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query;

    if (error) throw error;

    return new Set(data.map((d: any) => d.user_id)).size;
  }

  static async getTotalJobsCount(since?: string) {
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

  static async getFailedJobsCount(since?: string) {
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
}

export default SupabaseDB;
