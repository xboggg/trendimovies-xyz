import { Suspense } from "react";
import { Metadata } from "next";
import { TVCard } from "@/components/ui/card";
import { ContentGrid } from "@/components/ui/section";
import { MovieCardSkeleton } from "@/components/ui/skeleton";
import { getTVByCategory } from "@/services/tmdb";
import { Pagination } from "@/components/common/Pagination";
import { CategoryTabs } from "@/components/common/CategoryTabs";

// Revalidate every 10 minutes for fresh TV data
export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category || "popular";
  const titles: Record<string, string> = {
    popular: "Popular TV Shows",
    airing_today: "Airing Today",
    on_the_air: "Currently Airing",
    top_rated: "Top Rated TV Shows",
    trending: "Trending TV Shows",
  };

  return {
    title: titles[category] || "TV Shows",
    description: `Browse ${titles[category]?.toLowerCase() || "TV shows"} on TrendiMovies. Find ratings, reviews, and where to watch.`,
  };
}

const categories = [
  { id: "popular", label: "Popular" },
  { id: "airing_today", label: "Airing Today" },
  { id: "on_the_air", label: "On TV" },
  { id: "top_rated", label: "Top Rated" },
  { id: "trending", label: "Trending" },
];

export default async function TVShowsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = (params.category || "popular") as "popular" | "airing_today" | "on_the_air" | "top_rated" | "trending";
  const page = parseInt(params.page || "1");

  const data = await getTVByCategory(category, page);

  const titles: Record<string, string> = {
    popular: "Popular TV Shows",
    airing_today: "Airing Today",
    on_the_air: "Currently Airing",
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
            Discover the best TV shows to binge watch
          </p>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={category}
          baseUrl="/tv"
        />

        {/* TV Shows Grid */}
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
            {data.results.map((show, index) => (
              <TVCard key={show.id} show={show} priority={index < 10} />
            ))}
          </ContentGrid>
        </Suspense>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.min(data.total_pages, 500)}
          baseUrl={`/tv?category=${category}`}
        />
      </div>
    </div>
  );
}
