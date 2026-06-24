// src/infrastructure/services/authService.ts

import { supabase } from "@/infrastructure/config/supabaseClient";

/** Cookie name must match what middleware reads */
const AUTH_COOKIE = "sb-auth-token";

function setAuthCookie(token: string) {
  // Expires in 1 hour, SameSite=Lax so it's sent on navigation requests
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=3600; SameSite=Lax`;
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Store the actual JWT so middleware can verify it's a real session
    const token = data.session?.access_token ?? "true";
    setAuthCookie(token);
    return data;
  },

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;

    if (data.session?.access_token) {
      setAuthCookie(data.session.access_token);
    }
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    clearAuthCookie();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    // Keep cookie in sync with actual Supabase session
    if (data.session?.access_token) {
      setAuthCookie(data.session.access_token);
    } else {
      clearAuthCookie();
    }
    return data.session;
  },

  async getUserRole(): Promise<string | null> {
    const session = await this.getSession();
    if (!session?.user) return null;

    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    return data?.role ?? "user";
  },
};
