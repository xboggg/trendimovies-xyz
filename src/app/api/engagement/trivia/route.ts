import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET random trivia questions for daily quiz
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get random active questions
    // Using a random sort - in production you might want a more sophisticated approach
    const { data: questions, error } = await supabase
      .from("trivia_questions")
      .select("id, question, options, correct_option_id, explanation, difficulty, category")
      .eq("is_active", true)
      .limit(limit);

    if (error) {
      throw error;
    }

    // Shuffle the questions for randomness
    const shuffled = questions?.sort(() => Math.random() - 0.5) || [];

    return NextResponse.json(shuffled);
  } catch (error) {
    // console.error("Error fetching trivia:", error);
    return NextResponse.json({ error: "Failed to fetch trivia" }, { status: 500 });
  }
}

// POST to submit trivia score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, playerName, score, questionsAnswered, correctAnswers } = body;

    const { data, error } = await supabase
      .from("trivia_sessions")
      .insert({
        session_id: sessionId,
        player_name: playerName,
        score,
        questions_answered: questionsAnswered,
        correct_answers: correctAnswers,
        completed_at: new Date().toISOString(),
        quiz_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    // console.error("Error saving trivia score:", error);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}
