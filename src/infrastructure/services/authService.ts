// src/infrastructure/services/authService.ts

import { supabase } from "@/infrastructure/config/supabaseClient";

/** Cookie name must match what middleware reads */
const AUTH_COOKIE = "sb-auth-token";

/** Flag `Secure` hanya di production — mencegah cookie dikirim via HTTP plain text */
const SECURE_FLAG =
  typeof window !== "undefined" && window.location.protocol === "https:"
    ? "; Secure"
    : "";

/**
 * Set auth cookie dengan flag keamanan yang tepat.
 * `HttpOnly` tidak bisa diset via JS (hanya via server-side Set-Cookie),
 * namun `SameSite=Lax; Secure` memberikan proteksi CSRF dan sniffing.
 *
 * @param token - JWT access token
 * @param expiresAt - Unix timestamp (detik) kapan token expired; default 1 jam
 */
function setAuthCookie(token: string, expiresAt?: number) {
  // Hitung max-age dari Supabase session expires_at jika tersedia
  const maxAge = expiresAt
    ? Math.max(0, expiresAt - Math.floor(Date.now() / 1000))
    : 3600; // fallback 1 jam

  document.cookie = [
    `${AUTH_COOKIE}=${token}`,
    "path=/",
    `max-age=${maxAge}`,
    "SameSite=Lax",
    SECURE_FLAG,
  ]
    .filter(Boolean)
    .join("; ");
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${SECURE_FLAG}`;
}

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Sync cookie expiry dengan Supabase session
    const token = data.session?.access_token ?? "true";
    setAuthCookie(token, data.session?.expires_at);
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
      setAuthCookie(data.session.access_token, data.session.expires_at);
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

    // Keep cookie in sync with actual Supabase session (including expiry)
    if (data.session?.access_token) {
      setAuthCookie(data.session.access_token, data.session.expires_at);
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
