import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// POST reaction on a comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, type } = body;

    if (!commentId || !type || !["like", "dislike"].includes(type)) {
      return NextResponse.json(
        { error: "Comment ID and valid reaction type are required" },
        { status: 400 }
      );
    }

    // Get reactor ID
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    const reactorIdBase = `${ip}-${userAgent}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(reactorIdBase);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const reactorId = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 32);

    // Check for existing reaction
    const { data: existingReaction } = await supabase
      .from("comment_reactions")
      .select("id, reaction_type")
      .eq("comment_id", commentId)
      .eq("reactor_id", reactorId)
      .single();

    // Get current comment
    const { data: comment, error: commentError } = await supabase
      .from("comments")
      .select("likes, dislikes")
      .eq("id", commentId)
      .single();

    if (commentError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    let newLikes = comment.likes;
    let newDislikes = comment.dislikes;

    if (existingReaction) {
      // If same reaction, do nothing
      if (existingReaction.reaction_type === type) {
        return NextResponse.json({ likes: newLikes, dislikes: newDislikes });
      }

      // Update reaction type and adjust counts
      await supabase
        .from("comment_reactions")
        .update({ reaction_type: type })
        .eq("id", existingReaction.id);

      if (type === "like") {
        newLikes += 1;
        newDislikes -= 1;
      } else {
        newLikes -= 1;
        newDislikes += 1;
      }
    } else {
      // Insert new reaction
      await supabase.from("comment_reactions").insert({
        comment_id: commentId,
        reaction_type: type,
        reactor_id: reactorId,
      });

      if (type === "like") {
        newLikes += 1;
      } else {
        newDislikes += 1;
      }
    }

    // Update comment counts
    const { error: updateError } = await supabase
      .from("comments")
      .update({
        likes: Math.max(0, newLikes),
        dislikes: Math.max(0, newDislikes),
      })
      .eq("id", commentId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      likes: Math.max(0, newLikes),
      dislikes: Math.max(0, newDislikes),
    });
  } catch (error) {
    console.error("Error reacting:", error);
    return NextResponse.json({ error: "Failed to react" }, { status: 500 });
  }
}
