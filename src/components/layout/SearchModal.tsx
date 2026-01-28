"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Film, Tv, User, Loader2 } from "lucide-react";
import { cn, getImageUrl, formatYear } from "@/lib/utils";
import type { Movie, TVShow, Person } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data.results?.slice(0, 8) || []);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            navigateToResult(results[selectedIndex]);
          } else if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            onClose();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, query, onClose, router]);

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      const path =
        result.media_type === "movie"
          ? `/movies/${result.id}`
          : result.media_type === "tv"
          ? `/tv/${result.id}`
          : `/person/${result.id}`;
      router.push(path);
      onClose();
    },
    [router, onClose]
  );

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "movie":
        return <Film className="w-4 h-4 text-red-500" />;
      case "tv":
        return <Tv className="w-4 h-4 text-blue-500" />;
      case "person":
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-2xl mx-auto mt-20 md:mt-32 px-4">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-zinc-400" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, people..."
              className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-zinc-500"
            />
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.map((result, index) => {
                const title = result.title || result.name || "";
                const imagePath = result.poster_path || result.profile_path;
                const date = result.release_date || result.first_air_date;

                return (
                  <button
                    key={`${result.media_type}-${result.id}`}
                    onClick={() => navigateToResult(result)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 text-left transition-colors",
                      index === selectedIndex
                        ? "bg-zinc-800"
                        : "hover:bg-zinc-800/50"
                    )}
                  >
                    {/* Image */}
                    <div className="w-12 h-16 relative rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                      {imagePath ? (
                        <Image
                          src={getImageUrl(imagePath, "w92")}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getMediaIcon(result.media_type)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {getMediaIcon(result.media_type)}
                        <span className="text-xs text-zinc-500 uppercase">
                          {result.media_type}
                        </span>
                      </div>
                      <h4 className="font-medium text-white truncate">
                        {title}
                      </h4>
                      {date && (
                        <p className="text-sm text-zinc-400">
                          {formatYear(date)}
                        </p>
                      )}
                    </div>

                    {/* Rating */}
                    {result.vote_average !== undefined &&
                      result.vote_average > 0 && (
                        <span className="text-sm text-yellow-500 font-medium">
                          {result.vote_average.toFixed(1)}
                        </span>
                      )}
                  </button>
                );
              })}

              {/* View all results */}
              {query.trim() && (
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    onClose();
                  }}
                  className="w-full p-4 text-center text-red-500 hover:text-red-400 hover:bg-zinc-800/50 transition-colors border-t border-zinc-800"
                >
                  View all results for &ldquo;{query}&rdquo;
                </button>
              )}
            </div>
          )}

          {/* Empty state */}
          {query.trim() && !isLoading && results.length === 0 && (
            <div className="p-8 text-center text-zinc-400">
              <p>No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {/* Keyboard hints */}
          {!query.trim() && (
            <div className="p-4 flex items-center justify-center gap-6 text-xs text-zinc-500">
              <span>
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑↓</kbd> to
                navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">Enter</kbd> to
                select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">Esc</kbd> to
                close
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
