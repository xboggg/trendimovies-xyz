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
import { getTVDetails } from "@/services/tmdb";
import {
  getImageUrl,
  getBackdropUrl,
  formatDate,
  formatYear,
  formatVoteAverage,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/ShareButton";
import { PersonCard, TVCard } from "@/components/ui/card";
import { Section, ScrollRow } from "@/components/ui/section";
import { VideoPlayer } from "@/components/movies/VideoPlayer";
import { WatchProviders } from "@/components/movies/WatchProviders";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const show = await getTVDetails(parseInt(id));
    return {
      title: `${show.name} (${formatYear(show.first_air_date)})`,
      description: show.overview,
      openGraph: {
        title: show.name,
        description: show.overview,
        images: [getBackdropUrl(show.backdrop_path, "original")],
      },
    };
  } catch {
    return {
      title: "TV Show Not Found",
    };
  }
}

export default async function TVDetailPage({ params }: Props) {
  const { id } = await params;
  let show;

  try {
    show = await getTVDetails(parseInt(id));
  } catch {
    notFound();
  }

  const creators = show.created_by || [];
  const cast = show.credits?.cast.slice(0, 12) || [];
  const trailer = show.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const similar = show.similar?.results.slice(0, 10) || [];
  const recommendations = show.recommendations?.results.slice(0, 10) || [];

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[70vh] min-h-[500px]">
        <Image
          src={getBackdropUrl(show.backdrop_path, "original")}
          alt={show.name}
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
                src={getImageUrl(show.poster_path, "w500")}
                alt={show.name}
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
              {show.name}
            </h1>

            {/* Tagline */}
            {show.tagline && (
              <p className="text-xl text-zinc-400 italic mb-4">
                &ldquo;{show.tagline}&rdquo;
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-500" />
                <span className="text-lg font-bold">
                  {formatVoteAverage(show.vote_average)}
                </span>
                <span className="text-zinc-400 text-sm">
                  ({show.vote_count.toLocaleString()} votes)
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-300">
                <Calendar className="w-4 h-4" />
                <span>{formatYear(show.first_air_date)}</span>
                {show.last_air_date && show.status === "Ended" && (
                  <span>- {formatYear(show.last_air_date)}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-zinc-300">
                <Tv className="w-4 h-4" />
                <span>
                  {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? "s" : ""}
                </span>
              </div>
              {show.status && (
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    show.status === "Returning Series"
                      ? "bg-green-500/20 text-green-400"
                      : show.status === "Ended"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-zinc-500/20 text-zinc-400"
                  }`}
                >
                  {show.status}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres?.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1 bg-zinc-800 hover:bg-red-600 rounded-full text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            {/* Networks */}
            {show.networks && show.networks.length > 0 && (
              <div className="flex items-center gap-4 mb-6">
                {show.networks.slice(0, 3).map((network) =>
                  network.logo_path ? (
                    <div
                      key={network.id}
                      className="h-8 relative bg-white rounded px-2"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${network.logo_path}`}
                        alt={network.name}
                        width={60}
                        height={30}
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <span key={network.id} className="text-zinc-400">
                      {network.name}
                    </span>
                  )
                )}
              </div>
            )}

            {/* Overview */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Overview</h2>
              <p className="text-zinc-300 leading-relaxed">{show.overview}</p>
            </div>

            {/* Creators */}
            {creators.length > 0 && (
              <div className="mb-6">
                <p className="text-zinc-500 text-sm">Created by</p>
                <p className="text-white">
                  {creators.map((c) => c.name).join(", ")}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              {/* Watch Now - Link to trendimovies.com */}
              <a
                href={`https://trendimovies.com/series/${id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700">
                  <Tv className="w-5 h-5" />
                  Watch Now
                </Button>
              </a>
              {trailer && (
                <VideoPlayer videoKey={trailer.key} title={show.name}>
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
              <ShareButton title={show.name} />
            </div>
          </div>
        </div>

        {/* Seasons */}
        {show.seasons && show.seasons.length > 0 && (
          <Section title="Seasons" className="mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {show.seasons
                .filter((s) => s.season_number > 0)
                .map((season) => (
                  <Link
                    key={season.id}
                    href={`/tv/${show.id}/season/${season.season_number}`}
                    className="group"
                  >
                    <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-zinc-800 mb-2">
                      <Image
                        src={getImageUrl(season.poster_path || show.poster_path, "w342")}
                        alt={season.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="180px"
                      />
                    </div>
                    <h4 className="font-medium text-white text-sm group-hover:text-red-500 transition-colors">
                      {season.name}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {season.episode_count} Episodes
                    </p>
                  </Link>
                ))}
            </div>
          </Section>
        )}

        {/* Watch Providers */}
        {show.watch_providers && (
          <WatchProviders providers={show.watch_providers} title={show.name} />
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

        {/* Similar Shows */}
        {similar.length > 0 && (
          <Section title="Similar TV Shows" className="mt-8">
            <ScrollRow>
              {similar.map((s) => (
                <div key={s.id} className="flex-shrink-0 w-[180px]">
                  <TVCard show={s} />
                </div>
              ))}
            </ScrollRow>
          </Section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Section title="Recommended For You" className="mt-8">
            <ScrollRow>
              {recommendations.map((s) => (
                <div key={s.id} className="flex-shrink-0 w-[180px]">
                  <TVCard show={s} />
                </div>
              ))}
            </ScrollRow>
          </Section>
        )}

        {/* External Links */}
        {show.external_ids && (
          <div className="mt-12 mb-8 flex flex-wrap gap-4">
            {show.external_ids.imdb_id && (
              <a
                href={`https://www.imdb.com/title/${show.external_ids.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                IMDb
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {show.homepage && (
              <a
                href={show.homepage}
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
      </div>
    </div>
  );
}
