"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swords, Trophy, Zap } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface Battle {
  id: string;
  movie_a_id: number;
  movie_a_title: string;
  movie_a_poster: string;
  movie_a_votes: number;
  movie_b_id: number;
  movie_b_title: string;
  movie_b_poster: string;
  movie_b_votes: number;
}

interface MovieBattleProps {
  battle?: Battle;
}

export function MovieBattle({ battle: initialBattle }: MovieBattleProps) {
  const [battle, setBattle] = useState<Battle | null>(initialBattle || null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<"a" | "b" | null>(null);
  const [isLoading, setIsLoading] = useState(!initialBattle);
  const [isVoting, setIsVoting] = useState(false);

  // Check if user has already voted
  useEffect(() => {
    if (battle) {
      const votedBattles = JSON.parse(localStorage.getItem("votedBattles") || "{}");
      if (votedBattles[battle.id]) {
        setHasVoted(true);
        setVotedFor(votedBattles[battle.id]);
      }
    }
  }, [battle]);

  // Fetch battle if not provided
  useEffect(() => {
    if (!initialBattle) {
      fetchActiveBattle();
    }
  }, [initialBattle]);

  async function fetchActiveBattle() {
    try {
      const res = await fetch("/api/engagement/battle");
      if (res.ok) {
        const data = await res.json();
        setBattle(data);
      }
    } catch (error) {
      console.error("Failed to fetch battle:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVote(side: "a" | "b") {
    if (hasVoted || isVoting || !battle) return;

    setIsVoting(true);
    setVotedFor(side);

    const movieId = side === "a" ? battle.movie_a_id : battle.movie_b_id;

    try {
      const res = await fetch("/api/engagement/battle/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          battleId: battle.id,
          movieId,
        }),
      });

      if (res.ok) {
        const updatedBattle = await res.json();
        setBattle(updatedBattle);
        setHasVoted(true);

        // Save to localStorage
        const votedBattles = JSON.parse(localStorage.getItem("votedBattles") || "{}");
        votedBattles[battle.id] = side;
        localStorage.setItem("votedBattles", JSON.stringify(votedBattles));
      }
    } catch (error) {
      console.error("Failed to vote:", error);
      setVotedFor(null);
    } finally {
      setIsVoting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-800 rounded w-1/2 mx-auto mb-6"></div>
          <div className="flex gap-4">
            <div className="flex-1 aspect-[2/3] bg-zinc-800 rounded-xl"></div>
            <div className="w-16 flex items-center justify-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full"></div>
            </div>
            <div className="flex-1 aspect-[2/3] bg-zinc-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!battle) {
    return null;
  }

  const totalVotes = battle.movie_a_votes + battle.movie_b_votes;
  const percentageA = totalVotes > 0 ? Math.round((battle.movie_a_votes / totalVotes) * 100) : 50;
  const percentageB = totalVotes > 0 ? Math.round((battle.movie_b_votes / totalVotes) * 100) : 50;
  const winner = percentageA > percentageB ? "a" : percentageB > percentageA ? "b" : null;

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-xl p-6 border border-zinc-800 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Swords className="w-5 h-5 text-red-500" />
          <span className="text-sm font-bold text-red-500 uppercase tracking-wider">
            Movie Battle
          </span>
          <Swords className="w-5 h-5 text-red-500 scale-x-[-1]" />
        </div>

        <h3 className="text-center text-lg font-semibold text-white mb-6">
          Which movie do you prefer?
        </h3>

        {/* Battle Cards */}
        <div className="flex items-stretch gap-4">
          {/* Movie A */}
          <motion.button
            onClick={() => handleVote("a")}
            disabled={hasVoted || isVoting}
            whileHover={!hasVoted ? { scale: 1.02 } : {}}
            whileTap={!hasVoted ? { scale: 0.98 } : {}}
            className={`flex-1 relative group ${!hasVoted ? "cursor-pointer" : ""}`}
          >
            <div
              className={`relative aspect-[2/3] rounded-xl overflow-hidden border-2 transition-all ${
                hasVoted && votedFor === "a"
                  ? "border-red-500 shadow-lg shadow-red-500/20"
                  : hasVoted
                  ? "border-zinc-700 opacity-60"
                  : "border-zinc-700 group-hover:border-red-500/50"
              }`}
            >
              <Image
                src={getImageUrl(battle.movie_a_poster, "w342")}
                alt={battle.movie_a_title}
                fill
                className="object-cover"
                sizes="200px"
              />
              {/* Hover overlay */}
              {!hasVoted && (
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/20 transition-colors flex items-center justify-center">
                  <Zap className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              {/* Winner badge */}
              {hasVoted && winner === "a" && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black p-1.5 rounded-full">
                  <Trophy className="w-4 h-4" />
                </div>
              )}
            </div>
            <h4 className="mt-3 text-sm font-medium text-white text-center line-clamp-2">
              {battle.movie_a_title}
            </h4>
            {hasVoted && (
              <div className="mt-2 text-center">
                <span
                  className={`text-2xl font-bold ${
                    votedFor === "a" ? "text-red-500" : "text-zinc-400"
                  }`}
                >
                  {percentageA}%
                </span>
              </div>
            )}
          </motion.button>

          {/* VS Badge */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">VS</span>
            </div>
          </div>

          {/* Movie B */}
          <motion.button
            onClick={() => handleVote("b")}
            disabled={hasVoted || isVoting}
            whileHover={!hasVoted ? { scale: 1.02 } : {}}
            whileTap={!hasVoted ? { scale: 0.98 } : {}}
            className={`flex-1 relative group ${!hasVoted ? "cursor-pointer" : ""}`}
          >
            <div
              className={`relative aspect-[2/3] rounded-xl overflow-hidden border-2 transition-all ${
                hasVoted && votedFor === "b"
                  ? "border-red-500 shadow-lg shadow-red-500/20"
                  : hasVoted
                  ? "border-zinc-700 opacity-60"
                  : "border-zinc-700 group-hover:border-red-500/50"
              }`}
            >
              <Image
                src={getImageUrl(battle.movie_b_poster, "w342")}
                alt={battle.movie_b_title}
                fill
                className="object-cover"
                sizes="200px"
              />
              {/* Hover overlay */}
              {!hasVoted && (
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/20 transition-colors flex items-center justify-center">
                  <Zap className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              {/* Winner badge */}
              {hasVoted && winner === "b" && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black p-1.5 rounded-full">
                  <Trophy className="w-4 h-4" />
                </div>
              )}
            </div>
            <h4 className="mt-3 text-sm font-medium text-white text-center line-clamp-2">
              {battle.movie_b_title}
            </h4>
            {hasVoted && (
              <div className="mt-2 text-center">
                <span
                  className={`text-2xl font-bold ${
                    votedFor === "b" ? "text-red-500" : "text-zinc-400"
                  }`}
                >
                  {percentageB}%
                </span>
              </div>
            )}
          </motion.button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-zinc-500">
          {hasVoted ? (
            <span>
              {totalVotes.toLocaleString()} total votes - Thanks for voting!
            </span>
          ) : (
            <span>Click on a movie to cast your vote</span>
          )}
        </div>
      </div>
    </div>
  );
}
