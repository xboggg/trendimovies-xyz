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

export async function GET(request: NextRequest) {
  const auth = await checkAuth();
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Get single article
      const { data: article, error } = await supabaseAdmin
        .from("news_articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, article });
    }

    // Get all articles
    const { data: articles, error } = await supabaseAdmin
      .from("news_articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    console.error("Error fetching news:", error);
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
    const { id, title, content, excerpt, status, category, image_url } = body;

    if (!id || !title) {
      return NextResponse.json({ success: false, error: "ID and title are required" }, { status: 400 });
    }

    const { data: article, error } = await supabaseAdmin
      .from("news_articles")
      .update({
        title,
        content,
        excerpt,
        status,
        category,
        image_url,
        updated_at: new Date().toISOString(),
        ...(status === "published" ? { published_at: new Date().toISOString() } : {}),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Error updating news:", error);
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
      return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("news_articles")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Article deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
