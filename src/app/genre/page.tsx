import { Metadata } from "next";
import Link from "next/link";
import { Film, Tv } from "lucide-react";
import { MOVIE_GENRES, TV_GENRES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Browse by Genre | TrendiMovies",
  description: "Explore movies and TV shows by genre. Find action, comedy, drama, horror, sci-fi, and more.",
};

const genreIcons: Record<string, string> = {
  action: "💥",
  adventure: "🗺️",
  animation: "🎨",
  comedy: "😂",
  crime: "🔍",
  documentary: "📹",
  drama: "🎭",
  family: "👨‍👩‍👧‍👦",
  fantasy: "🧙",
  history: "📜",
  horror: "👻",
  music: "🎵",
  mystery: "🔮",
  romance: "💕",
  "science-fiction": "🚀",
  "tv-movie": "📺",
  thriller: "😱",
  war: "⚔️",
  western: "🤠",
};

export default function GenresPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Browse by Genre
          </h1>
          <p className="text-zinc-400">
            Explore movies and TV shows across all genres
          </p>
        </div>

        {/* Movie Genres */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Film className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Movie Genres</h2>
              <p className="text-zinc-500 text-sm">Browse movies by category</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {MOVIE_GENRES.map((genre) => (
              <Link
                key={genre.slug}
                href={`/genre/${genre.slug}?type=movie`}
                className="group flex items-center gap-3 p-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600/50 rounded-xl transition-all duration-300"
              >
                <span className="text-2xl">{genreIcons[genre.slug] || "🎬"}</span>
                <span className="text-white font-medium group-hover:text-red-500 transition-colors">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* TV Genres */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Tv className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">TV Show Genres</h2>
              <p className="text-zinc-500 text-sm">Browse TV shows by category</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {TV_GENRES.map((genre) => (
              <Link
                key={genre.slug}
                href={`/genre/${genre.slug}?type=tv`}
                className="group flex items-center gap-3 p-4 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-600/50 rounded-xl transition-all duration-300"
              >
                <span className="text-2xl">{genreIcons[genre.slug] || "📺"}</span>
                <span className="text-white font-medium group-hover:text-blue-500 transition-colors">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
