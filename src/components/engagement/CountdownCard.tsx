"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getImageUrl, formatDate } from "@/lib/utils";
import type { Movie } from "@/types";

interface CountdownCardProps {
  movie: Movie;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(releaseDate: string): TimeLeft | null {
  const release = new Date(releaseDate);
  const now = new Date();
  const difference = release.getTime() - now.getTime();

  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownCard({ movie }: CountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calculateTimeLeft(movie.release_date)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(movie.release_date));
    }, 1000);
    return () => clearInterval(timer);
  }, [movie.release_date]);

  if (!timeLeft) return null;

  const isComingSoon = timeLeft.days <= 7;

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/50 hover:border-red-500/30 shadow-lg hover:shadow-red-500/10 transition-all"
      >
        <div className="relative aspect-[2/3]">
          <Image
            src={getImageUrl(movie.poster_path, "w342")}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {isComingSoon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-red-600 rounded-full"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-white text-[10px] font-bold">SOON</span>
            </motion.div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-sm mb-1.5 line-clamp-2 group-hover:text-red-400 transition-colors">
              {movie.title}
            </h3>
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(movie.release_date)}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <TimeUnit value={timeLeft.days} label="Days" isHighlight />
              <TimeUnit value={timeLeft.hours} label="Hrs" />
              <TimeUnit value={timeLeft.minutes} label="Min" />
              <TimeUnit value={timeLeft.seconds} label="Sec" pulse />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function TimeUnit({ value, label, isHighlight, pulse }: { value: number; label: string; isHighlight?: boolean; pulse?: boolean }) {
  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
      className={`rounded-lg px-1 py-2 text-center ${
        isHighlight ? "bg-red-600/90" : "bg-zinc-800/90 backdrop-blur-sm"
      }`}
    >
      <div className="font-bold text-lg leading-none text-white">
        {value.toString().padStart(2, "0")}
      </div>
      <div className={`text-[9px] uppercase mt-0.5 ${isHighlight ? "text-red-200" : "text-zinc-400"}`}>
        {label}
      </div>
    </motion.div>
  );
}

// Enhanced Coming Soon Row with CONTINUOUS smooth scrolling
interface ComingSoonRowProps {
  movies: Movie[];
  title?: string;
}

export function ComingSoonRow({ movies, title = "Coming Soon" }: ComingSoonRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollSpeed = 0.5; // pixels per frame

  const upcomingMovies = movies.filter((movie) => {
    const releaseDate = new Date(movie.release_date);
    return releaseDate > new Date();
  });

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

  // Continuous smooth auto-scroll animation
  useEffect(() => {
    if (isPaused || !scrollRef.current) return;

    const animate = () => {
      if (scrollRef.current && !isPaused) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        // Reset to start when reaching end
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

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [checkScroll]);

  if (upcomingMovies.length === 0) return null;

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
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl"
          >
            <Clock className="w-5 h-5 text-red-500" />
          </motion.div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
            {upcomingMovies.length} titles
          </span>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border transition-all ${
              canScrollLeft
                ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
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
                ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="relative">
        {/* Left Fade */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none"
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
              className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Movies Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollBehavior: "auto" }}
        >
          {upcomingMovies.slice(0, 15).map((movie, idx) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex-shrink-0 w-[180px]"
            >
              <CountdownCard movie={movie} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
