import { Metadata } from "next";
export const revalidate = 3600;
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, Star, ChevronLeft, Tv } from "lucide-react";
import { getTVDetails, getTVSeasonDetails } from "@/services/tmdb";
import {
  getImageUrl,
  formatDate,
  formatVoteAverage,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/ShareButton";

interface Props {
  params: Promise<{ id: string; seasonNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, seasonNumber } = await params;
  try {
    const show = await getTVDetails(parseInt(id));
    return {
      title: `${show.name} - Season ${seasonNumber}`,
      description: `Watch Season ${seasonNumber} of ${show.name}. View all episodes, air dates, and ratings.`,
    };
  } catch {
    return {
      title: "Season Not Found",
    };
  }
}

export default async function SeasonPage({ params }: Props) {
  const { id, seasonNumber } = await params;

  let show;
  let season;

  try {
    [show, season] = await Promise.all([
      getTVDetails(parseInt(id)),
      getTVSeasonDetails(parseInt(id), parseInt(seasonNumber)),
    ]);
  } catch {
    notFound();
  }

  if (!show || !season) {
    notFound();
  }

  const episodes = season.episodes || [];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href={`/tv/${id}`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to {show.name}
          </Button>
        </Link>

        {/* Season Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Season Poster */}
          <div className="w-48 aspect-[2/3] relative rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 mx-auto md:mx-0">
            <Image
              src={getImageUrl(season.poster_path || show.poster_path, "w342")}
              alt={season.name}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>

          {/* Season Info */}
          <div>
            <p className="text-red-500 font-medium mb-2">{show.name}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {season.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-4 text-zinc-300">
              {season.air_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>{formatDate(season.air_date)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{episodes.length}</span>
                <span>Episodes</span>
              </div>
              {season.vote_average > 0 && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span>{formatVoteAverage(season.vote_average)}</span>
                </div>
              )}
            </div>

            {season.overview && (
              <p className="text-zinc-400 max-w-2xl mb-4">{season.overview}</p>
            )}

            {/* Season Actions */}
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://trendimovies.com/tmdb-redirect.php?id=${id}&type=tv`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700">
                  <Tv className="w-5 h-5" />
                  Watch on TrendiMovies
                </Button>
              </a>
              <ShareButton title={`${show.name} - ${season.name}`} />
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <h2 className="text-2xl font-bold text-white mb-6">Episodes</h2>

        <div className="space-y-4">
          {episodes.map((episode: any) => (
            <div
              key={episode.id}
              className="flex flex-col md:flex-row gap-4 p-4 bg-zinc-900/50 rounded-xl hover:bg-zinc-800/50 transition-colors"
            >
              {/* Episode Still */}
              <div className="w-full md:w-64 aspect-video relative rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                {episode.still_path ? (
                  <Image
                    src={getImageUrl(episode.still_path, "w342")}
                    alt={episode.name}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <span className="text-4xl font-bold">{episode.episode_number}</span>
                  </div>
                )}

                {/* Episode number badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs font-medium text-white">
                  E{episode.episode_number}
                </div>

                {/* Watch Episode Button Overlay */}
                <a
                  href={`https://trendimovies.com/tmdb-redirect.php?id=${id}&type=episode&season=${seasonNumber}&episode=${episode.episode_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Button size="sm" className="gap-2 bg-red-600 hover:bg-red-700">
                    <Tv className="w-4 h-4" />
                    Watch
                  </Button>
                </a>
              </div>

              {/* Episode Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {episode.episode_number}. {episode.name}
                  </h3>
                  {episode.vote_average > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="text-sm font-medium">
                        {formatVoteAverage(episode.vote_average)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-zinc-400">
                  {episode.air_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(episode.air_date)}</span>
                    </div>
                  )}
                  {episode.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{episode.runtime} min</span>
                    </div>
                  )}
                </div>

                {episode.overview && (
                  <p className="text-zinc-400 text-sm line-clamp-3">
                    {episode.overview}
                  </p>
                )}

                {/* Guest Stars */}
                {episode.guest_stars && episode.guest_stars.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-zinc-500 mb-1">Guest Stars:</p>
                    <p className="text-xs text-zinc-400">
                      {episode.guest_stars
                        .slice(0, 5)
                        .map((g: any) => g.name)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {episodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">No episode information available yet.</p>
          </div>
        )}

        {/* Other Seasons */}
        {show.seasons && show.seasons.length > 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Other Seasons</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {show.seasons
                .filter((s: any) => s.season_number > 0 && s.season_number !== parseInt(seasonNumber))
                .map((s: any) => (
                  <Link
                    key={s.id}
                    href={`/tv/${id}/season/${s.season_number}`}
                    className="flex-shrink-0 w-32 group"
                  >
                    <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-zinc-800 mb-2">
                      <Image
                        src={getImageUrl(s.poster_path || show.poster_path, "w185")}
                        alt={s.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="128px"
                      />
                    </div>
                    <h4 className="font-medium text-white text-sm group-hover:text-red-500 transition-colors">
                      {s.name}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {s.episode_count} Episodes
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
