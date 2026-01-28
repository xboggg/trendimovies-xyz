import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Calendar } from "lucide-react";
import { supabase, CuratedList } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getList(slug: string): Promise<CuratedList | null> {
  const { data } = await supabase
    .from("curated_lists")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

async function getMoviesForList(list: CuratedList): Promise<TMDBMovie[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  const title = list.title.toLowerCase();
  const year = list.year;

  let url = "";

  // Genre IDs: Action=28, Comedy=35, Horror=27, Drama=18, SciFi=878, Animation=16, Family=10751
  if (title.includes("horror")) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&sort_by=vote_average.desc&vote_count.gte=100${year ? `&primary_release_year=${year}` : ""}&page=1`;
  } else if (title.includes("action")) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&sort_by=vote_average.desc&vote_count.gte=100${year ? `&primary_release_year=${year}` : ""}&page=1`;
  } else if (title.includes("comedy")) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&sort_by=vote_average.desc&vote_count.gte=100${year ? `&primary_release_year=${year}` : ""}&page=1`;
  } else if (title.includes("oscar") || title.includes("best picture")) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=18&sort_by=vote_average.desc&vote_count.gte=500&page=1`;
  } else if (title.includes("golden globe")) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_average.desc&vote_count.gte=300&page=1`;
  } else if (title.includes("hidden gems") || title.includes("netflix")) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_average.desc&vote_count.gte=50&vote_count.lte=500&vote_average.gte=7&page=1`;
  } else if (title.includes("sci-fi") || title.includes("science fiction")) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=878&sort_by=vote_average.desc&vote_count.gte=100${year ? `&primary_release_year=${year}` : ""}&page=1`;
  } else if (title.includes("inception")) {
    url = `https://api.themoviedb.org/3/movie/27205/recommendations?api_key=${apiKey}&page=1`;
  } else if (title.includes("interstellar")) {
    url = `https://api.themoviedb.org/3/movie/157336/recommendations?api_key=${apiKey}&page=1`;
  } else if (title.includes("shawshank")) {
    url = `https://api.themoviedb.org/3/movie/278/recommendations?api_key=${apiKey}&page=1`;
  } else if (title.includes("alone") || title.includes("watch alone")) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=53&sort_by=vote_average.desc&vote_count.gte=200&page=1`;
  } else if (year) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${year}&sort_by=vote_average.desc&vote_count.gte=200&page=1`;
  } else {
    url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 } // Revalidate every hour for fresh TMDB data
    });

    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const data = await res.json();
    return data.results?.slice(0, 20) || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const list = await getList(slug);

  if (!list) {
    return { title: "List Not Found | TrendiMovies" };
  }

  return {
    title: `${list.title} | TrendiMovies`,
    description: list.description || `Curated list: ${list.title}`,
  };
}

export default async function ListPage({ params }: PageProps) {
  const { slug } = await params;
  const list = await getList(slug);

  if (!list) {
    notFound();
  }

  const movies = await getMoviesForList(list);

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link
          href="/discover/best-of"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lists
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {list.title}
          </h1>
          {list.description && (
            <p className="text-zinc-400 text-lg">{list.description}</p>
          )}
          {list.year && (
            <div className="flex items-center gap-2 mt-2 text-zinc-500">
              <Calendar className="w-4 h-4" />
              <span>{list.year}</span>
            </div>
          )}
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie, index) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group relative"
              >
                <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  #{index + 1}
                </div>
                <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-zinc-800">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-2">
                  <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-red-500 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-zinc-400 text-xs">
                      {movie.vote_average?.toFixed(1) || "N/A"}
                    </span>
                    {movie.release_date && (
                      <span className="text-zinc-500 text-xs">
                        {movie.release_date.split("-")[0]}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400">Loading movies... Please refresh the page.</p>
          </div>
        )}
      </div>
    </main>
  );
}
