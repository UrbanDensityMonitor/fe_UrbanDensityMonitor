// src/app/api/alerts/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const streamId = searchParams.get("stream_id");
    const isReadParam = searchParams.get("is_read");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Step 1: Ambil alerts tanpa JOIN (karena stream_id bisa dari streams ATAU private_streams)
    let query = supabaseServer
      .from("alerts")
      .select("*", { count: "exact" });

    if (streamId) {
      query = query.eq("stream_id", streamId);
    }
    if (isReadParam !== null && isReadParam !== undefined && isReadParam !== "") {
      query = query.eq("is_read", isReadParam === "true");
    }

    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error("API /api/alerts error:", error);
      return NextResponse.json(
        { message: error.message || "Failed to fetch alerts" },
        { status: 500 }
      );
    }

    const alerts = data || [];

    // Step 2: Kumpulkan semua stream_id unik dari hasil alert
    const streamIds = Array.from(new Set(alerts.map((a: any) => a.stream_id).filter(Boolean)));

    // Step 3: Query lokasi dari kedua tabel secara paralel
    const [publicRes, privateRes] = await Promise.all([
      streamIds.length > 0
        ? supabaseServer
            .from("streams")
            .select("id, location_name")
            .in("id", streamIds)
        : Promise.resolve({ data: [] }),
      streamIds.length > 0
        ? supabaseServer
            .from("private_streams")
            .select("id, location_name, camera_name")
            .in("id", streamIds)
        : Promise.resolve({ data: [] }),
    ]);

    // Step 4: Buat lookup map id → nama lokasi
    const locationMap: Record<string, string> = {};
    for (const s of publicRes.data || []) {
      locationMap[s.id] = s.location_name;
    }
    for (const s of privateRes.data || []) {
      locationMap[s.id] = s.camera_name || s.location_name;
    }

    // Step 5: Gabungkan stream_location ke setiap alert
    const formattedData = alerts.map((item: any) => ({
      ...item,
      stream_location: locationMap[item.stream_id] ?? null,
    }));

    return NextResponse.json({
      data: formattedData,
      total: count ?? formattedData.length,
      limit,
      offset,
    });
  } catch (err: any) {
    console.error("API /api/alerts exception:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
