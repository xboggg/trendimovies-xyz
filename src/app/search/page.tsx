import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Film, Tv, User, Search as SearchIcon } from "lucide-react";
import { searchMulti } from "@/services/tmdb";
import { getImageUrl, formatYear, formatVoteAverage } from "@/lib/utils";
import { ContentGrid } from "@/components/ui/section";
import { MovieCardSkeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/common/Pagination";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";

  return {
    title: query ? `Search results for "${query}"` : "Search",
    description: query
      ? `Search results for "${query}" on TrendiMovies`
      : "Search for movies, TV shows, and people on TrendiMovies",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1");

  let data = null;

  if (query) {
    data = await searchMulti(query, page);
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {query ? `Search results for "${query}"` : "Search"}
          </h1>
          {data && (
            <p className="text-zinc-400">
              Found {data.total_results.toLocaleString()} results
            </p>
          )}
        </div>

        {/* No Query State */}
        {!query && (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl text-zinc-400 mb-2">
              Search for movies, TV shows, and people
            </h2>
            <p className="text-zinc-500">
              Use the search bar above to find your favorite content
            </p>
          </div>
        )}

        {/* Results */}
        {data && data.results.length > 0 && (
          <Suspense
            fallback={
              <ContentGrid columns={5}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </ContentGrid>
            }
          >
            <div className="grid gap-4">
              {data.results.map((item: any) => (
                <SearchResultCard key={`${item.media_type}-${item.id}`} item={item} />
              ))}
            </div>
          </Suspense>
        )}

        {/* No Results */}
        {data && data.results.length === 0 && (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl text-zinc-400 mb-2">No results found</h2>
            <p className="text-zinc-500">
              Try a different search term or browse our categories
            </p>
          </div>
        )}

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={Math.min(data.total_pages, 500)}
            baseUrl={`/search?q=${encodeURIComponent(query)}`}
          />
        )}
      </div>
    </div>
  );
}

function SearchResultCard({ item }: { item: any }) {
  const isMovie = item.media_type === "movie";
  const isPerson = item.media_type === "person";
  const isTv = item.media_type === "tv";

  const title = isMovie ? item.title : item.name;
  const date = isMovie ? item.release_date : item.first_air_date;
  const href = isMovie
    ? `/movies/${item.id}`
    : isTv
    ? `/tv/${item.id}`
    : `/person/${item.id}`;
  const imagePath = isPerson ? item.profile_path : item.poster_path;

  const Icon = isMovie ? Film : isTv ? Tv : User;
  const typeLabel = isMovie ? "Movie" : isTv ? "TV Show" : "Person";
  const typeColor = isMovie
    ? "text-red-500"
    : isTv
    ? "text-blue-500"
    : "text-green-500";

  return (
    <Link
      href={href}
      className="flex gap-4 p-4 bg-zinc-900/50 hover:bg-zinc-800/50 rounded-xl transition-colors group"
    >
      {/* Image */}
      <div className="w-20 h-28 md:w-24 md:h-36 relative flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
        {imagePath ? (
          <Image
            src={getImageUrl(imagePath, "w185")}
            alt={title}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className={`w-8 h-8 ${typeColor}`} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`w-4 h-4 ${typeColor}`} />
          <span className={`text-xs font-medium ${typeColor}`}>{typeLabel}</span>
        </div>
        <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-1">
          {title}
        </h3>
        {date && (
          <p className="text-sm text-zinc-400 mb-2">{formatYear(date)}</p>
        )}
        {!isPerson && item.overview && (
          <p className="text-sm text-zinc-500 line-clamp-2">{item.overview}</p>
        )}
        {isPerson && item.known_for_department && (
          <p className="text-sm text-zinc-400">
            Known for: {item.known_for_department}
          </p>
        )}
        {!isPerson && item.vote_average > 0 && (
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            <span className="text-sm font-medium">
              {formatVoteAverage(item.vote_average)}
            </span>
            <span className="text-xs text-zinc-500">
              ({item.vote_count} votes)
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
