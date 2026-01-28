"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Calendar } from "lucide-react";
import { cn, getImageUrl, formatYear, formatVoteAverage } from "@/lib/utils";
import type { Movie, TVShow } from "@/types";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  priority?: boolean;
}

export function MovieCard({ movie, className, priority = false }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-zinc-900 transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-red-500/50",
        className
      )}
    >
      <div className="aspect-[2/3] relative">
        <Image
          src={getImageUrl(movie.poster_path, "w500")}
          alt={movie.title}
          fill
          className="object-cover transition-all duration-300 group-hover:brightness-75"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={priority}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-semibold text-white">
            {formatVoteAverage(movie.vote_average)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
          <Calendar className="w-3 h-3" />
          <span>{formatYear(movie.release_date)}</span>
        </div>
      </div>
    </Link>
  );
}

interface TVCardProps {
  show: TVShow;
  className?: string;
  priority?: boolean;
}

export function TVCard({ show, className, priority = false }: TVCardProps) {
  return (
    <Link
      href={`/tv/${show.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-zinc-900 transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-red-500/50",
        className
      )}
    >
      <div className="aspect-[2/3] relative">
        <Image
          src={getImageUrl(show.poster_path, "w500")}
          alt={show.name}
          fill
          className="object-cover transition-all duration-300 group-hover:brightness-75"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={priority}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-semibold text-white">
            {formatVoteAverage(show.vote_average)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
          {show.name}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
          <Calendar className="w-3 h-3" />
          <span>{formatYear(show.first_air_date)}</span>
        </div>
      </div>
    </Link>
  );
}

interface BackdropCardProps {
  item: Movie | TVShow;
  type: "movie" | "tv";
  className?: string;
}

export function BackdropCard({ item, type, className }: BackdropCardProps) {
  const title = type === "movie" ? (item as Movie).title : (item as TVShow).name;
  const date = type === "movie" ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const href = type === "movie" ? `/movies/${item.id}` : `/tv/${item.id}`;

  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-zinc-900 transition-all duration-300 hover:ring-2 hover:ring-red-500/50",
        className
      )}
    >
      <div className="aspect-video relative">
        <Image
          src={getImageUrl(item.backdrop_path || item.poster_path, "w780")}
          alt={title}
          fill
          className="object-cover transition-all duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 bg-red-600 rounded-md px-2 py-0.5">
              <Star className="w-3 h-3 text-white fill-white" />
              <span className="text-xs font-semibold text-white">
                {formatVoteAverage(item.vote_average)}
              </span>
            </div>
            <span className="text-xs text-zinc-300">{formatYear(date)}</span>
          </div>
          <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-red-500 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2 mt-1">
            {item.overview}
          </p>
        </div>
      </div>
    </Link>
  );
}

interface PersonCardProps {
  id: number;
  name: string;
  profilePath: string | null;
  character?: string;
  department?: string;
  className?: string;
}

export function PersonCard({
  id,
  name,
  profilePath,
  character,
  department,
  className,
}: PersonCardProps) {
  return (
    <Link
      href={`/person/${id}`}
      className={cn(
        "group block text-center transition-all duration-300",
        className
      )}
    >
      <div className="relative w-24 h-24 mx-auto mb-2 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-transparent group-hover:ring-red-500 transition-all">
        <Image
          src={getImageUrl(profilePath, "w185")}
          alt={name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <h4 className="font-medium text-white text-sm group-hover:text-red-500 transition-colors line-clamp-1">
        {name}
      </h4>
      {character && (
        <p className="text-xs text-zinc-400 line-clamp-1">{character}</p>
      )}
      {department && (
        <p className="text-xs text-zinc-500 line-clamp-1">{department}</p>
      )}
    </Link>
  );
}
