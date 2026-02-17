import { Metadata } from "next";
import { DailyTrivia } from "@/components/engagement";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Daily Movie Trivia | TrendiMovies",
  description: "Test your movie knowledge with our daily trivia quiz. 5 questions about movies, actors, directors, and more!",
  openGraph: {
    title: "Daily Movie Trivia | TrendiMovies",
    description: "Test your movie knowledge with our daily trivia quiz!",
    type: "website",
  },
};

export const revalidate = 3600; // Revalidate every hour

async function getTriviaQuestions() {
  try {
    const { data } = await supabase
      .from("trivia_questions")
      .select("id, question, options, correct_option_id, explanation, difficulty, category")
      .eq("is_active", true)
      .limit(5);

    // Shuffle for randomness
    return data?.sort(() => Math.random() - 0.5) || [];
  } catch {
    return [];
  }
}

export default async function TriviaPage() {
  const questions = await getTriviaQuestions();

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Daily Movie Trivia
          </h1>
          <p className="text-zinc-400">
            Test your movie knowledge! New questions every day.
          </p>
        </div>

        <DailyTrivia questions={questions} />
      </div>
    </main>
  );
}
