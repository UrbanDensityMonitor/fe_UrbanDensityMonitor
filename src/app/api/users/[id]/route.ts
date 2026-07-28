// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/infrastructure/config/supabaseServer";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { full_name, role, is_active } = body;

    const updates: Record<string, any> = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (role !== undefined) updates.role = role;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabaseServer
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Try deleting from auth.users if service role is used
    try {
      await supabaseServer.auth.admin.deleteUser(id);
    } catch {
      // ignore if auth admin is not available
    }

    const { error } = await supabaseServer
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to delete user" },
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
