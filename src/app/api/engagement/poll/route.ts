import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET active poll
export async function GET() {
  try {
    const { data: poll, error } = await supabase
      .from("polls")
      .select("*")
      .eq("is_active", true)
      .lte("start_date", new Date().toISOString().split("T")[0])
      .order("start_date", { ascending: false })
      .limit(1)
      .single();

    if (error || !poll) {
      return NextResponse.json(null);
    }

    return NextResponse.json(poll);
  } catch (error) {
    // console.error("Error fetching poll:", error);
    return NextResponse.json({ error: "Failed to fetch poll" }, { status: 500 });
  }
}
