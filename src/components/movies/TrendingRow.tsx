"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, Play, Star, Flame } from "lucide-react";
import { getImageUrl, getBackdropUrl, formatVoteAverage } from "@/lib/utils";
import type { Movie } from "@/types";

interface TrendingRowProps {
  title: string;
  movies: Movie[];
  href?: string;
}

export function TrendingRow({ title, movies, href }: TrendingRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const scrollSpeed = 0.4;

  const featuredMovie = movies[featuredIndex];

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  // Continuous smooth auto-scroll
  useEffect(() => {
    if (isPaused || !scrollRef.current) return;

    const animate = () => {
      if (scrollRef.current && !isPaused) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        if (scrollLeft >= scrollWidth - clientWidth - 1) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += scrollSpeed;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, scrollSpeed]);

  // Featured movie rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [checkScroll]);

  return (
    <section
      className="mb-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl"
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-1 px-2 py-1 bg-red-600/20 rounded-full"
          >
            <Flame className="w-3 h-3 text-red-500" />
            <span className="text-red-400 text-xs font-bold">HOT</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition-all ${
                canScrollLeft
                  ? "bg-zinc-800 border-zinc-700 text-white hover:bg-red-600 hover:border-red-600"
                  : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border transition-all ${
                canScrollRight
                  ? "bg-zinc-800 border-zinc-700 text-white hover:bg-red-600 hover:border-red-600"
                  : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {href && (
            <Link
              href={href}
              className="px-4 py-2 bg-zinc-800/50 hover:bg-red-600 text-zinc-300 hover:text-white text-sm font-medium rounded-full transition-all"
            >
              View All
            </Link>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured Movie - Large card */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredMovie.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-2xl overflow-hidden group"
            >
              <Image
                src={getBackdropUrl(featuredMovie.backdrop_path, "w780")}
                alt={featuredMovie.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Rank badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-black">#{featuredIndex + 1}</span>
                </div>
                <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-white text-sm font-bold">
                    {formatVoteAverage(featuredMovie.vote_average)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white text-2xl font-bold mb-2 line-clamp-2">
                  {featuredMovie.title}
                </h3>
                <p className="text-zinc-300 text-sm line-clamp-2 mb-4">
                  {featuredMovie.overview}
                </p>
                <div className="flex gap-3">
                  <a
                    href={`https://trendimovies.com/movie/${featuredMovie.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Watch
                    </motion.button>
                  </a>
                  <Link href={`/movies/${featuredMovie.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors"
                    >
                      Details
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Indicator dots */}
              <div className="absolute bottom-4 right-4 flex gap-1">
                {movies.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFeaturedIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === featuredIndex ? "bg-red-500 w-6" : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scrollable movie row */}
        <div className="lg:col-span-8 relative">
          {/* Left Fade */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Right Fade */}
          <AnimatePresence>
            {canScrollRight && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Movies Row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollBehavior: "auto" }}
          >
            {movies.slice(0, 20).map((movie, idx) => (
              <Link key={movie.id} href={`/movies/${movie.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="flex-shrink-0 w-[160px] group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-zinc-800/50 hover:border-red-500/30 transition-all">
                    <Image
                      src={getImageUrl(movie.poster_path, "w342")}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="160px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Rank badge */}
                    <div className="absolute top-2 left-2 w-7 h-7 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>

                    {/* Rating */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-white text-[10px] font-bold">
                        {formatVoteAverage(movie.vote_average)}
                      </span>
                    </div>

                    {/* Play button on hover */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </motion.div>
                  </div>

                  <h3 className="mt-2 text-white text-sm font-medium line-clamp-1 group-hover:text-red-400 transition-colors">
                    {movie.title}
                  </h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
