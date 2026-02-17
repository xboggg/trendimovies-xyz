"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, Star, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getBackdropUrl, formatYear, formatVoteAverage, formatRuntime } from "@/lib/utils";
import type { Movie } from "@/types";

interface HeroProps {
  movies: Movie[];
}

export function Hero({ movies }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredMovies = movies.slice(0, 5);
  const currentMovie = featuredMovies[currentIndex];

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!currentMovie) return null;

  return (
    <section className="relative h-[80vh] min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={getBackdropUrl(currentMovie.backdrop_path, "original")}
            alt={currentMovie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-end pb-20 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                Trending
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="text-sm font-semibold">
                  {formatVoteAverage(currentMovie.vote_average)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatYear(currentMovie.release_date)}</span>
              </div>
              {currentMovie.runtime && (
                <div className="flex items-center gap-1 text-zinc-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatRuntime(currentMovie.runtime)}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>

            {/* Overview */}
            <p className="text-zinc-300 text-lg mb-8 line-clamp-3 max-w-xl">
              {currentMovie.overview}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <a
                href={`https://trendimovies.com/movie/${currentMovie.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700">
                  <Play className="w-5 h-5 fill-white" />
                  Watch Now
                </Button>
              </a>
              <Link href={`/movies/${currentMovie.id}`}>
                <Button variant="secondary" size="lg" className="gap-2">
                  <Info className="w-5 h-5" />
                  More Info
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-4 md:right-16 flex flex-col gap-2">
        {featuredMovies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => setCurrentIndex(index)}
            className={`group relative w-16 h-1.5 rounded-full overflow-hidden transition-all ${
              index === currentIndex ? "w-24" : ""
            }`}
          >
            <div className="absolute inset-0 bg-zinc-700" />
            {index === currentIndex && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="absolute inset-0 bg-red-600"
              />
            )}
          </button>
        ))}
      </div>

      {/* Thumbnail Navigation */}
      <div className="hidden lg:flex absolute bottom-8 right-40 gap-2">
        {featuredMovies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => setCurrentIndex(index)}
            className={`relative w-20 h-12 rounded-lg overflow-hidden transition-all ${
              index === currentIndex
                ? "ring-2 ring-red-500 scale-110"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              src={getBackdropUrl(movie.backdrop_path, "w300")}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
