"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Users } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  total_votes: number;
}

interface DailyPollProps {
  poll?: Poll;
}

export function DailyPoll({ poll: initialPoll }: DailyPollProps) {
  const [poll, setPoll] = useState<Poll | null>(initialPoll || null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialPoll);
  const [isVoting, setIsVoting] = useState(false);

  // Check if user has already voted
  useEffect(() => {
    if (poll) {
      const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "{}");
      if (votedPolls[poll.id]) {
        setHasVoted(true);
        setSelectedOption(votedPolls[poll.id]);
      }
    }
  }, [poll]);

  // Fetch poll if not provided
  useEffect(() => {
    if (!initialPoll) {
      fetchActivePoll();
    }
  }, [initialPoll]);

  async function fetchActivePoll() {
    try {
      const res = await fetch("/api/engagement/poll");
      if (res.ok) {
        const data = await res.json();
        setPoll(data);
      }
    } catch (error) {
      // console.error("Failed to fetch poll:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVote(optionId: string) {
    if (hasVoted || isVoting || !poll) return;

    setIsVoting(true);
    setSelectedOption(optionId);

    try {
      const res = await fetch("/api/engagement/poll/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId: poll.id,
          optionId,
        }),
      });

      if (res.ok) {
        const updatedPoll = await res.json();
        setPoll(updatedPoll);
        setHasVoted(true);

        // Save to localStorage
        const votedPolls = JSON.parse(localStorage.getItem("votedPolls") || "{}");
        votedPolls[poll.id] = optionId;
        localStorage.setItem("votedPolls", JSON.stringify(votedPolls));
      }
    } catch (error) {
      // console.error("Failed to vote:", error);
      setSelectedOption(null);
    } finally {
      setIsVoting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="animate-pulse">
          <div className="h-4 bg-zinc-800 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-zinc-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return null;
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-red-500" />
        <span className="text-sm font-medium text-red-500 uppercase tracking-wider">
          Daily Poll
        </span>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-white mb-4">{poll.question}</h3>

      {/* Options */}
      <div className="space-y-3">
        {poll.options.map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || isVoting}
              className={`w-full relative overflow-hidden rounded-lg border transition-all ${
                hasVoted
                  ? isSelected
                    ? "border-red-500 bg-zinc-800"
                    : "border-zinc-700 bg-zinc-800/50"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-750 cursor-pointer"
              }`}
            >
              {/* Progress bar background */}
              {hasVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 ${
                    isSelected ? "bg-red-500/20" : "bg-zinc-700/30"
                  }`}
                />
              )}

              {/* Content */}
              <div className="relative flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  {hasVoted && isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      isSelected ? "text-white font-medium" : "text-zinc-300"
                    }`}
                  >
                    {option.text}
                  </span>
                </div>

                {hasVoted && (
                  <span
                    className={`text-sm font-bold ${
                      isSelected ? "text-red-500" : "text-zinc-400"
                    }`}
                  >
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Users className="w-4 h-4" />
          <span>{totalVotes.toLocaleString()} votes</span>
        </div>
        {hasVoted && (
          <span className="text-xs text-green-500">Thanks for voting!</span>
        )}
      </div>
    </div>
  );
}
