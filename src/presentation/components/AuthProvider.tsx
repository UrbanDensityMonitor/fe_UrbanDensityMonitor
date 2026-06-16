"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/infrastructure/config/supabaseClient";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const isAuthRoute = pathname?.startsWith("/auth");
      
      if (!session && !isAuthRoute) {
        router.push("/auth");
      } else if (session && isAuthRoute) {
        router.push("/dashboard");
      }
      
      setIsLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        router.push("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
