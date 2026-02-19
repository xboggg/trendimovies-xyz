"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Users, TrendingUp } from "lucide-react";

interface UserRatingProps {
  contentType: "movie" | "tv";
  contentId: string;
  contentTitle: string;
  tmdbRating?: number;
  tmdbVotes?: number;
  className?: string;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: { [key: number]: number };
}

export function UserRating({
  contentType,
  contentId,
  contentTitle,
  tmdbRating = 0,
  tmdbVotes = 0,
  className = "",
}: UserRatingProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Load user's previous rating from localStorage
  useEffect(() => {
    const storageKey = `rating_${contentType}_${contentId}`;
    const savedRating = localStorage.getItem(storageKey);
    if (savedRating) {
      setUserRating(parseInt(savedRating));
      setHasRated(true);
    }

    // Fetch community stats
    fetchStats();
  }, [contentType, contentId]);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `/api/ratings?type=${contentType}&id=${contentId}`
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      // console.error("Failed to fetch rating stats:", error);
    }
  };

  const submitRating = async (rating: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const previousRating = userRating;

    // Optimistic update
    setUserRating(rating);
    setHasRated(true);

    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          contentId,
          contentTitle,
          rating,
          previousRating,
        }),
      });

      if (response.ok) {
        // Save to localStorage
        const storageKey = `rating_${contentType}_${contentId}`;
        localStorage.setItem(storageKey, rating.toString());

        // Show thank you message
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 3000);

        // Refresh stats
        fetchStats();
      } else {
        // Rollback on error
        setUserRating(previousRating);
        setHasRated(!!previousRating);
      }
    } catch {
      // Rollback on error
      setUserRating(previousRating);
      setHasRated(!!previousRating);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating ?? userRating ?? 0;

  return (
    <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Rate This {contentType === "movie" ? "Movie" : "Show"}</h3>
        {stats && stats.totalRatings > 0 && (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Users className="w-4 h-4" />
            <span>{stats.totalRatings} ratings</span>
          </div>
        )}
      </div>

      {/* Star Rating */}
      <div className="flex flex-col items-center mb-4">
        <div
          className="flex gap-1 mb-2"
          onMouseLeave={() => setHoverRating(null)}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => submitRating(star)}
              disabled={isSubmitting}
              className={`p-0.5 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <Star
                className={`w-6 h-6 transition-all ${
                  star <= displayRating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              />
            </motion.button>
          ))}
        </div>

        {/* Rating Display */}
        <AnimatePresence mode="wait">
          {showThankYou ? (
            <motion.p
              key="thanks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-400 text-sm font-medium"
            >
              Thanks for rating!
            </motion.p>
          ) : hoverRating ? (
            <motion.p
              key="hover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-yellow-500 text-lg font-bold"
            >
              {hoverRating}/10
            </motion.p>
          ) : userRating ? (
            <motion.p
              key="rated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-300"
            >
              Your rating: <span className="text-yellow-500 font-bold">{userRating}/10</span>
            </motion.p>
          ) : (
            <motion.p
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-500 text-sm"
            >
              Click to rate
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Ratings Comparison */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
        {/* TMDB Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-xl font-bold text-white">
              {tmdbRating ? tmdbRating.toFixed(1) : "N/A"}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            TMDB ({tmdbVotes?.toLocaleString() || 0})
          </p>
        </div>

        {/* Community Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span className="text-xl font-bold text-white">
              {stats?.averageRating ? stats.averageRating.toFixed(1) : "N/A"}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            TrendiMovies ({stats?.totalRatings || 0})
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      {stats && stats.totalRatings >= 5 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 mb-2">Rating Distribution</p>
          <div className="space-y-1">
            {[10, 8, 6, 4, 2].map((threshold) => {
              const count = Object.entries(stats.distribution || {})
                .filter(([key]) => {
                  const rating = parseInt(key);
                  return rating >= threshold - 1 && rating <= threshold;
                })
                .reduce((sum, [, val]) => sum + val, 0);
              const percentage = (count / stats.totalRatings) * 100;

              return (
                <div key={threshold} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-zinc-500">{threshold - 1}-{threshold}</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: threshold * 0.05 }}
                      className="h-full bg-yellow-500/70 rounded-full"
                    />
                  </div>
                  <span className="w-8 text-zinc-500 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
