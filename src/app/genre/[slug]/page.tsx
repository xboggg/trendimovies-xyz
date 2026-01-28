import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MovieCard, TVCard } from "@/components/ui/card";
import { ContentGrid } from "@/components/ui/section";
import { Pagination } from "@/components/common/Pagination";
import { getMoviesByGenre, getTVByGenre } from "@/services/tmdb";
import { MOVIE_GENRES, TV_GENRES } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const genre = MOVIE_GENRES.find((g) => g.slug === slug) || TV_GENRES.find((g) => g.slug === slug);

  if (!genre) {
    return { title: "Genre Not Found" };
  }

  return {
    title: `${genre.name} Movies & TV Shows`,
    description: `Browse the best ${genre.name.toLowerCase()} movies and TV shows. Find ratings, reviews, and where to watch.`,
  };
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam, type } = await searchParams;
  const page = parseInt(pageParam || "1");
  const contentType = type || "movie";

  // Find genre in both movie and TV genres
  const movieGenre = MOVIE_GENRES.find((g) => g.slug === slug);
  const tvGenre = TV_GENRES.find((g) => g.slug === slug);

  if (!movieGenre && !tvGenre) {
    notFound();
  }

  const genre = movieGenre || tvGenre;
  const genreId = genre!.id;

  // Fetch content based on type
  let data;
  if (contentType === "tv" && tvGenre) {
    data = await getTVByGenre(tvGenre.id, page);
  } else if (movieGenre) {
    data = await getMoviesByGenre(movieGenre.id, page);
  } else if (tvGenre) {
    data = await getTVByGenre(tvGenre.id, page);
  } else {
    notFound();
  }

  const showMovies = contentType === "movie" && movieGenre;
  const showTV = contentType === "tv" && tvGenre;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {genre!.name}
          </h1>
          <p className="text-zinc-400">
            Discover the best {genre!.name.toLowerCase()} {contentType === "tv" ? "TV shows" : "movies"}
          </p>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-2 mb-8">
          {movieGenre && (
            <a
              href={`/genre/${slug}?type=movie`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                contentType === "movie"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Movies
            </a>
          )}
          {tvGenre && (
            <a
              href={`/genre/${slug}?type=tv`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                contentType === "tv"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              TV Shows
            </a>
          )}
        </div>

        {/* Content Grid */}
        <ContentGrid columns={5}>
          {data.results.map((item: any, index: number) =>
            showTV ? (
              <TVCard key={item.id} show={item} priority={index < 10} />
            ) : (
              <MovieCard key={item.id} movie={item} priority={index < 10} />
            )
          )}
        </ContentGrid>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.min(data.total_pages, 500)}
          baseUrl={`/genre/${slug}?type=${contentType}`}
        />
      </div>
    </div>
  );
}
