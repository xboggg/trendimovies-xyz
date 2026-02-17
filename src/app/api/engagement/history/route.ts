import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET events for today in movie history
export async function GET() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed
    const day = today.getDate();

    // Query events that match today's month and day
    const { data: events, error } = await supabase
      .from("movie_history")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      throw error;
    }

    // Filter events for today's date (month and day)
    const todayEvents = events?.filter((event) => {
      const eventDate = new Date(event.event_date);
      return eventDate.getMonth() + 1 === month && eventDate.getDate() === day;
    }) || [];

    return NextResponse.json(todayEvents);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
