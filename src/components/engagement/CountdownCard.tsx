"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
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

  if (difference <= 0) {
    return null;
  }

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

  // If movie has already released, don't show countdown
  if (!timeLeft) {
    return null;
  }

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all">
        {/* Poster */}
        <div className="relative aspect-[2/3]">
          <Image
            src={getImageUrl(movie.poster_path, "w342")}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="200px"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Countdown overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Title */}
            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
              {movie.title}
            </h3>

            {/* Release date */}
            <div className="flex items-center gap-1 text-zinc-400 text-xs mb-3">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(movie.release_date)}</span>
            </div>

            {/* Countdown timer */}
            <div className="grid grid-cols-4 gap-1">
              <div className="bg-red-600/90 rounded px-1 py-1.5 text-center">
                <div className="text-white font-bold text-lg leading-none">
                  {timeLeft.days}
                </div>
                <div className="text-red-200 text-[10px] uppercase">Days</div>
              </div>
              <div className="bg-zinc-800/90 rounded px-1 py-1.5 text-center">
                <div className="text-white font-bold text-lg leading-none">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-zinc-400 text-[10px] uppercase">Hrs</div>
              </div>
              <div className="bg-zinc-800/90 rounded px-1 py-1.5 text-center">
                <div className="text-white font-bold text-lg leading-none">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-zinc-400 text-[10px] uppercase">Min</div>
              </div>
              <div className="bg-zinc-800/90 rounded px-1 py-1.5 text-center">
                <div className="text-white font-bold text-lg leading-none">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-zinc-400 text-[10px] uppercase">Sec</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Component for horizontal scrolling row of countdown cards
interface ComingSoonRowProps {
  movies: Movie[];
  title?: string;
}

export function ComingSoonRow({ movies, title = "Coming Soon" }: ComingSoonRowProps) {
  // Filter to only show movies with future release dates
  const upcomingMovies = movies.filter((movie) => {
    const releaseDate = new Date(movie.release_date);
    return releaseDate > new Date();
  });

  if (upcomingMovies.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-5 h-5 text-red-500" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-medium rounded-full">
          {upcomingMovies.length} titles
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {upcomingMovies.slice(0, 10).map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-[180px]">
            <CountdownCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
