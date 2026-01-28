import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");
    if (!sessionCookie) return { authorized: false };
    const session = JSON.parse(sessionCookie.value);
    if (session.role !== "admin" && session.role !== "editor") return { authorized: false };
    return { authorized: true, user: session };
  } catch {
    return { authorized: false };
  }
}

export async function GET() {
  const auth = await checkAuth();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: franchises, error } = await supabaseAdmin
      .from("franchises")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, franchises });
  } catch (error: any) {
    console.error("Error fetching franchises:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await checkAuth();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, description, tmdb_collection_id, logo_url, banner_url } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Franchise name is required" }, { status: 400 });
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const { data: newFranchise, error } = await supabaseAdmin
      .from("franchises")
      .insert({
        name,
        slug: finalSlug,
        description: description || null,
        tmdb_collection_id: tmdb_collection_id ? parseInt(tmdb_collection_id) : null,
        logo_url: logo_url || null,
        banner_url: banner_url || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, franchise: newFranchise });
  } catch (error: any) {
    console.error("Error creating franchise:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await checkAuth();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, slug, description, tmdb_collection_id, logo_url, banner_url } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, error: "ID and name are required" }, { status: 400 });
    }

    const { data: updatedFranchise, error } = await supabaseAdmin
      .from("franchises")
      .update({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        description: description || null,
        tmdb_collection_id: tmdb_collection_id ? parseInt(tmdb_collection_id) : null,
        logo_url: logo_url || null,
        banner_url: banner_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, franchise: updatedFranchise });
  } catch (error: any) {
    console.error("Error updating franchise:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await checkAuth();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Franchise ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("franchises")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Franchise deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting franchise:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
