"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Trophy, Zap, Flame, Users } from "lucide-react";
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

  useEffect(() => {
    if (battle) {
      const votedBattles = JSON.parse(localStorage.getItem("votedBattles") || "{}");
      if (votedBattles[battle.id]) {
        setHasVoted(true);
        setVotedFor(votedBattles[battle.id]);
      }
    }
  }, [battle]);

  useEffect(() => {
    if (!initialBattle) fetchActiveBattle();
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
        body: JSON.stringify({ battleId: battle.id, movieId }),
      });

      if (res.ok) {
        const updatedBattle = await res.json();
        setBattle(updatedBattle);
        setHasVoted(true);

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
      <div className="max-w-2xl mx-auto bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50">
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-800 rounded w-1/3 mx-auto mb-6"></div>
          <div className="flex gap-4 justify-center">
            <div className="w-32 aspect-[2/3] bg-zinc-800 rounded-xl"></div>
            <div className="w-12 h-12 bg-zinc-800 rounded-full self-center"></div>
            <div className="w-32 aspect-[2/3] bg-zinc-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!battle) return null;

  const totalVotes = battle.movie_a_votes + battle.movie_b_votes;
  const percentageA = totalVotes > 0 ? Math.round((battle.movie_a_votes / totalVotes) * 100) : 50;
  const percentageB = totalVotes > 0 ? Math.round((battle.movie_b_votes / totalVotes) * 100) : 50;
  const winner = percentageA > percentageB ? "a" : percentageB > percentageA ? "b" : null;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-900 rounded-2xl p-6 border border-zinc-800/50 overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-orange-500 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Swords className="w-5 h-5 text-red-500" />
            </motion.div>
            <span className="text-sm font-bold text-red-500 uppercase tracking-wider">
              Movie Battle
            </span>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Swords className="w-5 h-5 text-red-500 scale-x-[-1]" />
            </motion.div>
          </div>

          <h3 className="text-center text-lg font-semibold text-white mb-6">
            Which movie do you prefer?
          </h3>

          {/* Battle Cards - Constrained Width */}
          <div className="flex items-center justify-center gap-4 md:gap-6">
            {/* Movie A */}
            <BattleCard
              title={battle.movie_a_title}
              poster={battle.movie_a_poster}
              percentage={percentageA}
              isVoted={votedFor === "a"}
              isWinner={hasVoted && winner === "a"}
              hasVoted={hasVoted}
              isVoting={isVoting}
              onVote={() => handleVote("a")}
            />

            {/* VS Badge */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30 border-2 border-red-500/50">
                <span className="text-white font-black text-sm">VS</span>
              </div>
            </motion.div>

            {/* Movie B */}
            <BattleCard
              title={battle.movie_b_title}
              poster={battle.movie_b_poster}
              percentage={percentageB}
              isVoted={votedFor === "b"}
              isWinner={hasVoted && winner === "b"}
              hasVoted={hasVoted}
              isVoting={isVoting}
              onVote={() => handleVote("b")}
            />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            {hasVoted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-sm text-zinc-400"
              >
                <Users className="w-4 h-4" />
                <span>{totalVotes.toLocaleString()} votes</span>
                <span className="text-zinc-600">|</span>
                <span className="text-green-400">Thanks!</span>
              </motion.div>
            ) : (
              <p className="text-sm text-zinc-500">Click on a movie to cast your vote</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface BattleCardProps {
  title: string;
  poster: string;
  percentage: number;
  isVoted: boolean;
  isWinner: boolean;
  hasVoted: boolean;
  isVoting: boolean;
  onVote: () => void;
}

function BattleCard({
  title,
  poster,
  percentage,
  isVoted,
  isWinner,
  hasVoted,
  isVoting,
  onVote,
}: BattleCardProps) {
  return (
    <motion.button
      onClick={onVote}
      disabled={hasVoted || isVoting}
      whileHover={!hasVoted ? { scale: 1.05, y: -5 } : {}}
      whileTap={!hasVoted ? { scale: 0.95 } : {}}
      className={`relative group ${!hasVoted ? "cursor-pointer" : ""}`}
    >
      <div
        className={`relative w-28 md:w-36 aspect-[2/3] rounded-xl overflow-hidden border-2 transition-all shadow-lg ${
          isVoted
            ? "border-red-500 shadow-red-500/30"
            : hasVoted
            ? "border-zinc-700 opacity-60"
            : "border-zinc-700 group-hover:border-red-500/50 group-hover:shadow-red-500/20"
        }`}
      >
        <Image
          src={getImageUrl(poster, "w342")}
          alt={title}
          fill
          className="object-cover"
          sizes="144px"
        />

        {/* Hover effect */}
        {!hasVoted && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-8 h-8 text-white drop-shadow-lg" />
            </motion.div>
          </motion.div>
        )}

        {/* Winner badge */}
        <AnimatePresence>
          {isWinner && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-2 right-2 bg-yellow-500 text-black p-1.5 rounded-full shadow-lg"
            >
              <Trophy className="w-3 h-3" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vote indicator */}
        {isVoted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 left-2 bg-red-600 p-1 rounded-full"
          >
            <Flame className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </div>

      {/* Title */}
      <h4 className="mt-2 text-xs md:text-sm font-medium text-white text-center line-clamp-2 max-w-[120px] md:max-w-[144px]">
        {title}
      </h4>

      {/* Percentage */}
      <AnimatePresence>
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-center"
          >
            <span
              className={`text-xl md:text-2xl font-black ${
                isVoted ? "text-red-500" : "text-zinc-400"
              }`}
            >
              {percentage}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
