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
    const { data: lists, error } = await supabaseAdmin
      .from("curated_lists")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, lists });
  } catch (error: any) {
    console.error("Error fetching lists:", error);
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
    const { title, slug, description, list_type, year, image_url, is_featured, display_order } = body;

    if (!title || !list_type) {
      return NextResponse.json({ success: false, error: "Title and list type required" }, { status: 400 });
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const { data: newList, error } = await supabaseAdmin
      .from("curated_lists")
      .insert({
        title,
        slug: finalSlug,
        description: description || null,
        list_type,
        year: year ? parseInt(year) : null,
        image_url: image_url || null,
        is_featured: is_featured || false,
        display_order: display_order ? parseInt(display_order) : 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, list: newList });
  } catch (error: any) {
    console.error("Error creating list:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
