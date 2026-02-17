import { Metadata } from "next";
export const revalidate = 3600;
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Calendar,
  Clock,
  Play,
  Bookmark,
  ExternalLink,
  Tv,
} from "lucide-react";
import { getMovieDetails, getPopularMovies } from "@/services/tmdb";
import {
  getImageUrl,
  getBackdropUrl,
  formatDate,
  formatYear,
  formatRuntime,
  formatMoney,
  formatVoteAverage,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/ShareButton";
import { PersonCard, MovieCard } from "@/components/ui/card";
import { Section, ScrollRow } from "@/components/ui/section";
import { VideoPlayer } from "@/components/movies/VideoPlayer";
import { WatchProviders } from "@/components/movies/WatchProviders";
import { Comments } from "@/components/engagement";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(parseInt(id));
    return {
      title: `${movie.title} (${formatYear(movie.release_date)})`,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: [getBackdropUrl(movie.backdrop_path, "original")],
      },
    };
  } catch {
    return {
      title: "Movie Not Found",
    };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  let movie;

  try {
    movie = await getMovieDetails(parseInt(id));
  } catch {
    notFound();
  }

  const director = movie.credits?.crew.find((c) => c.job === "Director");
  const writers = movie.credits?.crew.filter(
    (c) => c.department === "Writing"
  ).slice(0, 3);
  const cast = movie.credits?.cast.slice(0, 12) || [];
  const trailer = movie.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const similar = movie.similar?.results.slice(0, 10) || [];
  const recommendations = movie.recommendations?.results.slice(0, 10) || [];

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[70vh] min-h-[500px]">
        <Image
          src={getBackdropUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-80 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-64 md:w-72 lg:w-80 aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl mx-auto lg:mx-0">
              <Image
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                className="object-cover"
                priority
                sizes="320px"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-0 lg:pt-32">
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-xl text-zinc-400 italic mb-4">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-500" />
                <span className="text-lg font-bold">
                  {formatVoteAverage(movie.vote_average)}
                </span>
                <span className="text-zinc-400 text-sm">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-300">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(movie.release_date)}</span>
              </div>
              {movie.runtime && (
                <div className="flex items-center gap-1 text-zinc-300">
                  <Clock className="w-4 h-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1 bg-zinc-800 hover:bg-red-600 rounded-full text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Overview</h2>
              <p className="text-zinc-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Crew */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {director && (
                <div>
                  <p className="text-zinc-500 text-sm">Director</p>
                  <Link
                    href={`/person/${director.id}`}
                    className="text-white hover:text-red-500 transition-colors"
                  >
                    {director.name}
                  </Link>
                </div>
              )}
              {writers && writers.length > 0 && (
                <div>
                  <p className="text-zinc-500 text-sm">Writers</p>
                  <p className="text-white">
                    {writers.map((w) => w.name).join(", ")}
                  </p>
                </div>
              )}
              {movie.budget && movie.budget > 0 && (
                <div>
                  <p className="text-zinc-500 text-sm">Budget</p>
                  <p className="text-white">{formatMoney(movie.budget)}</p>
                </div>
              )}
              {movie.revenue && movie.revenue > 0 && (
                <div>
                  <p className="text-zinc-500 text-sm">Revenue</p>
                  <p className="text-white">{formatMoney(movie.revenue)}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              {/* Watch Now - Link to trendimovies.com */}
              <a
                href={`https://trendimovies.com/movie/${id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700">
                  <Tv className="w-5 h-5" />
                  Watch Now
                </Button>
              </a>
              {trailer && (
                <VideoPlayer videoKey={trailer.key} title={movie.title}>
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Play className="w-5 h-5 fill-white" />
                    Watch Trailer
                  </Button>
                </VideoPlayer>
              )}
              <Button variant="secondary" size="lg" className="gap-2">
                <Bookmark className="w-5 h-5" />
                Add to Watchlist
              </Button>
              <ShareButton title={movie.title} />
            </div>
          </div>
        </div>

        {/* Watch Providers */}
        {movie.watch_providers && (
          <WatchProviders providers={movie.watch_providers} title={movie.title} />
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <Section title="Cast" className="mt-12">
            <ScrollRow>
              {cast.map((person) => (
                <div key={person.id} className="flex-shrink-0 w-28">
                  <PersonCard
                    id={person.id}
                    name={person.name}
                    profilePath={person.profile_path}
                    character={person.character}
                  />
                </div>
              ))}
            </ScrollRow>
          </Section>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <Section title="Similar Movies" className="mt-8">
            <ScrollRow>
              {similar.map((m) => (
                <div key={m.id} className="flex-shrink-0 w-[180px]">
                  <MovieCard movie={m} />
                </div>
              ))}
            </ScrollRow>
          </Section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Section title="Recommended For You" className="mt-8">
            <ScrollRow>
              {recommendations.map((m) => (
                <div key={m.id} className="flex-shrink-0 w-[180px]">
                  <MovieCard movie={m} />
                </div>
              ))}
            </ScrollRow>
          </Section>
        )}

        {/* External Links */}
        {movie.external_ids && (
          <div className="mt-12 mb-8 flex flex-wrap gap-4">
            {movie.external_ids.imdb_id && (
              <a
                href={`https://www.imdb.com/title/${movie.external_ids.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                IMDb
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {movie.homepage && (
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Official Website
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-12 mb-8">
          <Comments
            contentType="movie"
            contentId={id}
            contentTitle={movie.title}
          />
        </div>
      </div>
    </div>
  );
}
