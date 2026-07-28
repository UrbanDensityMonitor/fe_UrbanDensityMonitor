// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/infrastructure/config/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to fetch users" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      total: (data || []).length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
