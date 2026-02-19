"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, Play, Star, Flame } from "lucide-react";
import { getImageUrl, formatVoteAverage } from "@/lib/utils";
import type { Movie } from "@/types";

interface TrendingRowProps {
  title: string;
  movies: Movie[];
  href?: string;
}

export function TrendingRow({ title, movies, href }: TrendingRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // Smooth auto-scroll using setInterval
  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (scrollContainer && !isPaused) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
          if (scrollLeft >= scrollWidth - clientWidth - 5) {
            scrollContainer.scrollLeft = 0;
          } else {
            scrollContainer.scrollLeft += 1;
          }
        }
      }, 30);
    };

    startAutoScroll();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaused]);

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
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={"p-2 rounded-full border transition-all " + (canScrollLeft ? "bg-zinc-800 border-zinc-700 text-white hover:bg-red-600 hover:border-red-600" : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed")}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={"p-2 rounded-full border transition-all " + (canScrollRight ? "bg-zinc-800 border-zinc-700 text-white hover:bg-red-600 hover:border-red-600" : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed")}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {href && (
            <Link href={href} className="px-4 py-2 bg-zinc-800/50 hover:bg-red-600 text-zinc-300 hover:text-white text-sm font-medium rounded-full transition-all">
              View All
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
          )}
        </AnimatePresence>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollBehavior: "auto" }}>
          {movies.slice(0, 20).map((movie, idx) => (
            <Link key={movie.id} href={"/movies/" + movie.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex-shrink-0 w-[180px] group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-zinc-800/50 hover:border-red-500/30 transition-all">
                  <Image src={getImageUrl(movie.poster_path, "w342")} alt={movie.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="180px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute top-2 left-2 w-8 h-8 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
                    <span className="text-white text-sm font-bold">{idx + 1}</span>
                  </div>

                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-white text-xs font-bold">{formatVoteAverage(movie.vote_average)}</span>
                  </div>

                  <motion.div initial={{ opacity: 0, scale: 0.5 }} whileHover={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </motion.div>
                </div>

                <h3 className="mt-3 text-white text-sm font-medium line-clamp-1 group-hover:text-red-400 transition-colors">{movie.title}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
