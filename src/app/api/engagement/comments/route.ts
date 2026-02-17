import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// GET comments for a specific content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contentType = searchParams.get("type");
    const contentId = searchParams.get("id");

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: "Content type and ID are required" },
        { status: 400 }
      );
    }

    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("content_type", contentType)
      .eq("content_id", contentId)
      .eq("is_approved", true)
      .is("parent_id", null) // Only top-level comments
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(comments || []);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, contentId, contentTitle, authorName, commentText, parentId } = body;

    // Validate required fields
    if (!contentType || !contentId || !authorName || !commentText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic validation
    if (authorName.length > 50) {
      return NextResponse.json(
        { error: "Name is too long (max 50 characters)" },
        { status: 400 }
      );
    }

    if (commentText.length > 1000) {
      return NextResponse.json(
        { error: "Comment is too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    // Basic spam check - reject if contains too many URLs
    const urlCount = (commentText.match(/https?:\/\//gi) || []).length;
    if (urlCount > 2) {
      return NextResponse.json(
        { error: "Too many links in comment" },
        { status: 400 }
      );
    }

    // Get IP and user agent
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // Insert comment
    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        content_type: contentType,
        content_id: contentId,
        content_title: contentTitle,
        author_name: authorName.trim(),
        comment_text: commentText.trim(),
        parent_id: parentId || null,
        ip_address: ip,
        user_agent: userAgent,
        is_approved: true, // Auto-approve for now
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
