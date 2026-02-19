"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Brain, CheckCircle, XCircle, Trophy, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TriviaOption {
  id: string;
  text: string;
}

interface TriviaQuestion {
  id: string;
  question: string;
  options: TriviaOption[];
  correct_option_id: string;
  explanation: string;
  difficulty: string;
  category: string;
}

interface DailyTriviaProps {
  questions?: TriviaQuestion[];
  compact?: boolean; // For homepage teaser
}

export function DailyTrivia({ questions: initialQuestions, compact = false }: DailyTriviaProps) {
  const [questions, setQuestions] = useState<TriviaQuestion[]>(initialQuestions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialQuestions);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Check if user has already played today
  useEffect(() => {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem("triviaLastPlayed");
    const savedScore = localStorage.getItem("triviaScore");

    if (lastPlayed === today && savedScore) {
      setHasPlayed(true);
      setScore(parseInt(savedScore));
      setIsComplete(true);
    }
  }, []);

  // Fetch questions if not provided
  useEffect(() => {
    if (!initialQuestions && !hasPlayed) {
      fetchQuestions();
    }
  }, [initialQuestions, hasPlayed]);

  async function fetchQuestions() {
    try {
      const res = await fetch("/api/engagement/trivia");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (error) {
      // console.error("Failed to fetch trivia:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAnswer(optionId: string) {
    if (isAnswered) return;

    setSelectedAnswer(optionId);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    if (optionId === currentQuestion.correct_option_id) {
      setScore((prev) => prev + 1);
    }
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz complete
      setIsComplete(true);
      // Save to localStorage
      const today = new Date().toDateString();
      localStorage.setItem("triviaLastPlayed", today);
      localStorage.setItem("triviaScore", score.toString());
    }
  }

  function shareResults() {
    const text = `I scored ${score}/${questions.length} on today's TrendiMovies trivia! Can you beat my score? Play at trendimovies.xyz`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    }
  }

  // Compact teaser for homepage
  if (compact) {
    return (
      <div className="bg-gradient-to-br from-purple-900/50 to-zinc-900 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-400 uppercase tracking-wider">
            Daily Trivia
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">
          Test Your Movie Knowledge!
        </h3>

        <p className="text-zinc-400 text-sm mb-4">
          {hasPlayed
            ? `You scored ${score}/5 today! Come back tomorrow for a new quiz.`
            : "10 questions. How well do you know movies?"}
        </p>

        <Link href="/trivia">
          <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
            {hasPlayed ? "View Results" : "Start Quiz"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
        <div className="animate-pulse text-center">
          <div className="h-6 bg-zinc-800 rounded w-1/2 mx-auto mb-6"></div>
          <div className="h-24 bg-zinc-800 rounded mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-zinc-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 text-center">
        <Brain className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Trivia Available</h3>
        <p className="text-zinc-400">Check back later for daily trivia questions!</p>
      </div>
    );
  }

  // Quiz complete screen
  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";
    let emoji = "";

    if (percentage === 100) {
      message = "Perfect Score! You're a true cinephile!";
      emoji = "🏆";
    } else if (percentage >= 80) {
      message = "Excellent! You really know your movies!";
      emoji = "🌟";
    } else if (percentage >= 60) {
      message = "Good job! You've got solid movie knowledge!";
      emoji = "👍";
    } else if (percentage >= 40) {
      message = "Not bad! Keep watching more movies!";
      emoji = "🎬";
    } else {
      message = "Time to hit the theaters more often!";
      emoji = "🍿";
    }

    return (
      <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
        <p className="text-zinc-400 mb-6">{message}</p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <span className="text-4xl font-bold text-white">
            {score}/{questions.length}
          </span>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-3 mb-6">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={shareResults} variant="secondary" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share Results
          </Button>
          <Link href="/">
            <Button className="gap-2">Back to Home</Button>
          </Link>
        </div>

        <p className="text-zinc-500 text-sm mt-6">
          Come back tomorrow for a new quiz!
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct_option_id;

  return (
    <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-400 uppercase tracking-wider">
            Daily Trivia
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">
            Question {currentIndex + 1}/{questions.length}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
            Score: {score}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-6">
        <div
          className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrectOption = option.id === currentQuestion.correct_option_id;

              let bgColor = "bg-zinc-800 hover:bg-zinc-700 border-zinc-700";
              let textColor = "text-zinc-300";

              if (isAnswered) {
                if (isCorrectOption) {
                  bgColor = "bg-green-500/20 border-green-500";
                  textColor = "text-green-400";
                } else if (isSelected && !isCorrectOption) {
                  bgColor = "bg-red-500/20 border-red-500";
                  textColor = "text-red-400";
                } else {
                  bgColor = "bg-zinc-800/50 border-zinc-700";
                  textColor = "text-zinc-500";
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={isAnswered}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${bgColor} ${
                    !isAnswered ? "cursor-pointer" : ""
                  }`}
                >
                  {isAnswered && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <span className={`text-left ${textColor}`}>{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                isCorrect
                  ? "bg-green-500/10 border border-green-500/30"
                  : "bg-red-500/10 border border-red-500/30"
              }`}
            >
              <p className={`text-sm ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                {isCorrect ? "Correct! " : "Incorrect. "}
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}

          {/* Next button */}
          {isAnswered && (
            <Button onClick={nextQuestion} className="w-full gap-2">
              {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
