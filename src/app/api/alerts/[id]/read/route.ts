// src/app/api/alerts/[id]/read/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/infrastructure/config/supabaseServer";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Alert ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from("alerts")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to mark alert as read" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
