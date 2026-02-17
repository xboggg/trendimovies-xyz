"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck, Check, X, Film, Tv, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WatchlistItem {
  id: number;
  type: "movie" | "tv";
  title: string;
  posterPath: string | null;
  addedAt: number;
}

// Hook for watchlist management
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("trendimovies_watchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch {
        setWatchlist([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveWatchlist = useCallback((items: WatchlistItem[]) => {
    localStorage.setItem("trendimovies_watchlist", JSON.stringify(items));
    setWatchlist(items);
  }, []);

  const addToWatchlist = useCallback((item: Omit<WatchlistItem, "addedAt">) => {
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type);
      if (exists) return prev;
      const newList = [...prev, { ...item, addedAt: Date.now() }];
      localStorage.setItem("trendimovies_watchlist", JSON.stringify(newList));
      return newList;
    });
  }, []);

  const removeFromWatchlist = useCallback((id: number, type: "movie" | "tv") => {
    setWatchlist((prev) => {
      const newList = prev.filter((i) => !(i.id === id && i.type === type));
      localStorage.setItem("trendimovies_watchlist", JSON.stringify(newList));
      return newList;
    });
  }, []);

  const isInWatchlist = useCallback(
    (id: number, type: "movie" | "tv") => {
      return watchlist.some((i) => i.id === id && i.type === type);
    },
    [watchlist]
  );

  const clearWatchlist = useCallback(() => {
    localStorage.removeItem("trendimovies_watchlist");
    setWatchlist([]);
  }, []);

  return {
    watchlist,
    isLoaded,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    clearWatchlist,
    saveWatchlist,
  };
}

// Watchlist Button Component
interface WatchlistButtonProps {
  id: number;
  type: "movie" | "tv";
  title: string;
  posterPath: string | null;
  variant?: "icon" | "button" | "text";
  className?: string;
}

export function WatchlistButton({
  id,
  type,
  title,
  posterPath,
  variant = "button",
  className = "",
}: WatchlistButtonProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, isLoaded } = useWatchlist();
  const [showToast, setShowToast] = useState<"added" | "removed" | null>(null);

  const inWatchlist = isInWatchlist(id, type);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWatchlist) {
      removeFromWatchlist(id, type);
      setShowToast("removed");
    } else {
      addToWatchlist({ id, type, title, posterPath });
      setShowToast("added");
    }

    setTimeout(() => setShowToast(null), 2000);
  };

  if (!isLoaded) {
    return (
      <button
        disabled
        className={`opacity-50 ${className}`}
      >
        <Bookmark className="w-5 h-5" />
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className={`p-2 rounded-full transition-colors ${
            inWatchlist
              ? "bg-red-600 text-white"
              : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700"
          } ${className}`}
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {inWatchlist ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </motion.button>

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
                showToast === "added"
                  ? "bg-green-600 text-white"
                  : "bg-zinc-700 text-white"
              }`}
            >
              {showToast === "added" ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> Added
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <X className="w-3 h-3" /> Removed
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === "text") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 text-sm ${
          inWatchlist ? "text-red-500" : "text-zinc-400 hover:text-white"
        } transition-colors ${className}`}
      >
        {inWatchlist ? (
          <>
            <BookmarkCheck className="w-4 h-4" />
            In Watchlist
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4" />
            Add to Watchlist
          </>
        )}
      </button>
    );
  }

  // Default button variant
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        inWatchlist
          ? "bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/30"
          : "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700"
      } ${className}`}
    >
      {inWatchlist ? (
        <>
          <BookmarkCheck className="w-5 h-5" />
          In Watchlist
        </>
      ) : (
        <>
          <Bookmark className="w-5 h-5" />
          Add to Watchlist
        </>
      )}
    </motion.button>
  );
}

// Watchlist Display Component
interface WatchlistDisplayProps {
  className?: string;
  maxItems?: number;
  showEmpty?: boolean;
}

export function WatchlistDisplay({
  className = "",
  maxItems = 10,
  showEmpty = true,
}: WatchlistDisplayProps) {
  const { watchlist, isLoaded, removeFromWatchlist, clearWatchlist } = useWatchlist();

  if (!isLoaded) {
    return (
      <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-zinc-800 rounded w-1/3" />
          <div className="grid grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0 && !showEmpty) {
    return null;
  }

  const displayItems = watchlist.slice(0, maxItems);
  const hasMore = watchlist.length > maxItems;

  return (
    <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600/20 rounded-lg">
            <Bookmark className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Your Watchlist</h3>
            <p className="text-sm text-zinc-500">
              {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved
            </p>
          </div>
        </div>

        {watchlist.length > 0 && (
          <button
            onClick={clearWatchlist}
            className="flex items-center gap-1 text-sm text-zinc-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-8">
          <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 mb-2">Your watchlist is empty</p>
          <p className="text-zinc-600 text-sm">
            Click the bookmark icon on any movie or show to save it here
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {displayItems.map((item) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative"
              >
                <Link href={`/${item.type === "movie" ? "movies" : "tv"}/${item.id}`}>
                  <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-zinc-800">
                    {item.posterPath ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${item.posterPath}`}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="100px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {item.type === "movie" ? (
                          <Film className="w-8 h-8 text-zinc-600" />
                        ) : (
                          <Tv className="w-8 h-8 text-zinc-600" />
                        )}
                      </div>
                    )}

                    {/* Remove button on hover */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWatchlist(item.id, item.type);
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>

                    {/* Type badge */}
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                      {item.type === "movie" ? "M" : "TV"}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-4 text-center">
              <Link
                href="/watchlist"
                className="text-red-500 hover:text-red-400 text-sm font-medium"
              >
                View all {watchlist.length} titles →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
