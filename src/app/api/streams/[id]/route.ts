// src/app/api/streams/[id]/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/infrastructure/config/supabaseServer";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "Stream ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from("streams")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to delete stream" },
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
