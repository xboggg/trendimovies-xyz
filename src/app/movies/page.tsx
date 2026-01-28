import { Suspense } from "react";
import { Metadata } from "next";
import { MovieCard } from "@/components/ui/card";
import { ContentGrid, Section } from "@/components/ui/section";
import { MovieCardSkeleton } from "@/components/ui/skeleton";
import { getMoviesByCategory } from "@/services/tmdb";
import { Pagination } from "@/components/common/Pagination";
import { CategoryTabs } from "@/components/common/CategoryTabs";

// Revalidate every 10 minutes for fresh movie data
export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category || "popular";
  const titles: Record<string, string> = {
    popular: "Popular Movies",
    now_playing: "Now Playing Movies",
    upcoming: "Upcoming Movies",
    top_rated: "Top Rated Movies",
    trending: "Trending Movies",
  };

  return {
    title: titles[category] || "Movies",
    description: `Browse ${titles[category]?.toLowerCase() || "movies"} on TrendiMovies. Find ratings, reviews, and where to watch.`,
  };
}

const categories = [
  { id: "popular", label: "Popular" },
  { id: "now_playing", label: "Now Playing" },
  { id: "upcoming", label: "Upcoming" },
  { id: "top_rated", label: "Top Rated" },
  { id: "trending", label: "Trending" },
];

export default async function MoviesPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = (params.category || "popular") as "popular" | "now_playing" | "upcoming" | "top_rated" | "trending";
  const page = parseInt(params.page || "1");

  const data = await getMoviesByCategory(category, page);

  const titles: Record<string, string> = {
    popular: "Popular Movies",
    now_playing: "Now Playing",
    upcoming: "Coming Soon",
    top_rated: "Top Rated",
    trending: "Trending Now",
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {titles[category]}
          </h1>
          <p className="text-zinc-400">
            Discover the best movies to watch right now
          </p>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={category}
          baseUrl="/movies"
        />

        {/* Movies Grid */}
        <Suspense
          fallback={
            <ContentGrid columns={5}>
              {Array.from({ length: 20 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </ContentGrid>
          }
        >
          <ContentGrid columns={5}>
            {data.results.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} priority={index < 10} />
            ))}
          </ContentGrid>
        </Suspense>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.min(data.total_pages, 500)}
          baseUrl={`/movies?category=${category}`}
        />
      </div>
    </div>
  );
}
