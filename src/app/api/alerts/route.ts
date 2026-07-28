// src/app/api/alerts/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/infrastructure/config/supabaseServer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const streamId = searchParams.get("stream_id");
    const isReadParam = searchParams.get("is_read");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let query = supabaseServer
      .from("alerts")
      .select("*", { count: "exact" });

    if (streamId) {
      query = query.eq("stream_id", streamId);
    }
    if (isReadParam !== null && isReadParam !== undefined) {
      query = query.eq("is_read", isReadParam === "true");
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to fetch alerts" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      total: count ?? (data || []).length,
      limit,
      offset,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
