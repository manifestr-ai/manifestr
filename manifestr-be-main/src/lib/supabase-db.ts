/**
 * Supabase Database Helper
 * Clean interface for all database operations - NO TypeORM!
 */

import { supabaseAdmin } from "./supabase";

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
}

export default SupabaseDB;
