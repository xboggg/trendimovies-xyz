import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// POST vote on a battle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { battleId, movieId } = body;

    if (!battleId || !movieId) {
      return NextResponse.json(
        { error: "Battle ID and movie ID are required" },
        { status: 400 }
      );
    }

    // Get voter ID
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    const voterIdBase = `${ip}-${userAgent}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(voterIdBase);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const voterId = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 32);

    // Check if already voted
    const { data: existingVote } = await supabase
      .from("battle_votes")
      .select("id")
      .eq("battle_id", battleId)
      .eq("voter_id", voterId)
      .single();

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted on this battle" },
        { status: 400 }
      );
    }

    // Get current battle
    const { data: battle, error: battleError } = await supabase
      .from("movie_battles")
      .select("*")
      .eq("id", battleId)
      .single();

    if (battleError || !battle) {
      return NextResponse.json({ error: "Battle not found" }, { status: 404 });
    }

    // Determine which movie was voted for
    const isMovieA = movieId === battle.movie_a_id;
    const updateField = isMovieA ? "movie_a_votes" : "movie_b_votes";
    const currentVotes = isMovieA ? battle.movie_a_votes : battle.movie_b_votes;

    // Insert vote record
    await supabase.from("battle_votes").insert({
      battle_id: battleId,
      chosen_movie_id: movieId,
      voter_id: voterId,
      ip_address: ip,
    });

    // Update battle with new vote count
    const { data: updatedBattle, error: updateError } = await supabase
      .from("movie_battles")
      .update({
        [updateField]: (currentVotes || 0) + 1,
      })
      .eq("id", battleId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updatedBattle);
  } catch (error) {
    // console.error("Error voting:", error);
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
  }
}
