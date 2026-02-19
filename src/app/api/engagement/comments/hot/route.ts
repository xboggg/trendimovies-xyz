import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET hot/featured discussions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5");

    // Get comments sorted by engagement (likes + recent)
    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("is_approved", true)
      .is("parent_id", null)
      .order("likes", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json(comments || []);
  } catch (error) {
    // console.error("Error fetching hot discussions:", error);
    return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 });
  }
}
