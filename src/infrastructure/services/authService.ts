// src/infrastructure/services/authService.ts

import { supabase } from "@/infrastructure/config/supabaseClient";

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Optional: Set a cookie so middleware can read it
    document.cookie = `sb-auth-token=true; path=/; max-age=3600; SameSite=Lax`;
    return data;
  },

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    
    document.cookie = `sb-auth-token=true; path=/; max-age=3600; SameSite=Lax`;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    document.cookie = "sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUserRole() {
    const session = await this.getSession();
    if (!session?.user) return null;
    
    // Assuming role is stored in user metadata or we can fetch from public.users
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    return data?.role || 'user';
  }
};
