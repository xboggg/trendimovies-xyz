import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// POST vote on a poll
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollId, optionId } = body;

    if (!pollId || !optionId) {
      return NextResponse.json(
        { error: "Poll ID and option ID are required" },
        { status: 400 }
      );
    }

    // Get voter ID from session or create a fingerprint
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // Create a simple voter ID hash
    const voterIdBase = `${ip}-${userAgent}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(voterIdBase);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const voterId = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 32);

    // Check if already voted
    const { data: existingVote } = await supabase
      .from("poll_votes")
      .select("id")
      .eq("poll_id", pollId)
      .eq("voter_id", voterId)
      .single();

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted on this poll" },
        { status: 400 }
      );
    }

    // Get current poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Update option votes
    const options = poll.options.map((opt: any) =>
      opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
    );

    // Insert vote record
    await supabase.from("poll_votes").insert({
      poll_id: pollId,
      option_id: optionId,
      voter_id: voterId,
      ip_address: ip,
    });

    // Update poll with new vote counts
    const { data: updatedPoll, error: updateError } = await supabase
      .from("polls")
      .update({
        options,
        total_votes: (poll.total_votes || 0) + 1,
      })
      .eq("id", pollId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedPoll);
  } catch (error) {
    // console.error("Error voting:", error);
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
  }
}
