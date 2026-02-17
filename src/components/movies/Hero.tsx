"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, Star, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getBackdropUrl, getImageUrl, formatYear, formatVoteAverage } from "@/lib/utils";
import type { Movie } from "@/types";

interface HeroProps {
  movies: Movie[];
}

export function Hero({ movies }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const featuredMovies = movies.slice(0, 6);
  const currentMovie = featuredMovies[currentIndex];

  const goToSlide = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % featuredMovies.length;
    goToSlide(nextIndex, 1);
  }, [currentIndex, featuredMovies.length, goToSlide]);

  const goPrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? featuredMovies.length - 1 : currentIndex - 1;
    goToSlide(prevIndex, -1);
  }, [currentIndex, featuredMovies.length, goToSlide]);

  // Auto-rotate
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(goNext, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goNext]);

  if (!currentMovie) return null;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section
      className="relative h-[85vh] min-h-[650px] max-h-[950px] overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentMovie.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
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
          {/* Cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </motion.div>
      </AnimatePresence>

      {/* Animated particles/grain effect */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 /%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 /%3E%3C/svg%3E')]" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
          {/* Left: Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-xl"
            >
              {/* Trending badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="relative px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider overflow-hidden">
                  <span className="relative z-10">Trending Now</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-white font-bold text-sm">
                    {formatVoteAverage(currentMovie.vote_average)}
                  </span>
                </div>
                <span className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-zinc-300 text-sm">
                  {formatYear(currentMovie.release_date)}
                </span>
              </motion.div>

              {/* Title with animated underline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-[0.95] tracking-tight"
              >
                {currentMovie.title}
              </motion.h1>

              {/* Overview with fade */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-zinc-300 text-base md:text-lg mb-8 line-clamp-3 leading-relaxed"
              >
                {currentMovie.overview}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <a
                  href={`https://trendimovies.com/movie/${currentMovie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(239,68,68,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Watch Now
                  </motion.button>
                </a>
                <Link href={`/movies/${currentMovie.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 transition-colors"
                  >
                    <Info className="w-5 h-5" />
                    More Info
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right: Poster Card (Desktop) */}
          <div className="hidden lg:flex justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMovie.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative w-72 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
                  <Image
                    src={getImageUrl(currentMovie.poster_path, "w500")}
                    alt={currentMovie.title}
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-red-500/20 blur-3xl rounded-full -z-10" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goPrev}
          className="pointer-events-auto p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goNext}
          className="pointer-events-auto p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Bottom: Thumbnail Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3 px-4 py-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
          {featuredMovies.map((movie, index) => (
            <motion.button
              key={movie.id}
              onClick={() => goToSlide(index, index > currentIndex ? 1 : -1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? "w-16 h-10 ring-2 ring-red-500"
                  : "w-12 h-8 opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={getBackdropUrl(movie.backdrop_path, "w300")}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="64px"
              />
              {index === currentIndex && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  key={`progress-${currentIndex}`}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Slide counter */}
      <div className="absolute top-8 right-8 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
        <span className="text-white font-bold">{currentIndex + 1}</span>
        <span className="text-zinc-400 mx-1">/</span>
        <span className="text-zinc-400">{featuredMovies.length}</span>
      </div>
    </section>
  );
}
