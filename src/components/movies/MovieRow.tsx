"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { Movie } from "@/types";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  href?: string;
}

export function MovieRow({ title, movies, href }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section title={title} href={href}>
      <div className="relative group">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-1/2 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-1/2 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="flex-shrink-0 w-[180px] md:w-[200px]">
              <MovieCard movie={movie} priority={index < 5} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
