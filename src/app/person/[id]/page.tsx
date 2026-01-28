import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  ExternalLink,
  Film,
  Tv,
} from "lucide-react";
import { getPersonDetails } from "@/services/tmdb";
import {
  getImageUrl,
  formatDate,
} from "@/lib/utils";
import { MovieCard, TVCard } from "@/components/ui/card";
import { Section, ScrollRow } from "@/components/ui/section";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const person = await getPersonDetails(parseInt(id));
    return {
      title: person.name,
      description: person.biography?.slice(0, 160) || `Learn about ${person.name}`,
      openGraph: {
        title: person.name,
        description: person.biography?.slice(0, 160),
        images: person.profile_path ? [getImageUrl(person.profile_path, "w500")] : [],
      },
    };
  } catch {
    return {
      title: "Person Not Found",
    };
  }
}

export default async function PersonPage({ params }: Props) {
  const { id } = await params;
  let person;

  try {
    person = await getPersonDetails(parseInt(id));
  } catch {
    notFound();
  }

  if (!person || !person.id) {
    notFound();
  }

  // Separate movie and TV credits
  const movieCredits = person.combined_credits?.cast
    ?.filter((credit: any) => credit.media_type === "movie")
    ?.sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
    ?.slice(0, 20) || [];

  const tvCredits = person.combined_credits?.cast
    ?.filter((credit: any) => credit.media_type === "tv")
    ?.sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
    ?.slice(0, 20) || [];

  const age = person.birthday
    ? Math.floor(
        (new Date().getTime() - new Date(person.birthday).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-64 md:w-72 lg:w-80 aspect-[2/3] relative rounded-xl overflow-hidden shadow-2xl mx-auto lg:mx-0 bg-zinc-800">
              {person.profile_path ? (
                <Image
                  src={getImageUrl(person.profile_path, "w500")}
                  alt={person.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="320px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <Film className="w-20 h-20" />
                </div>
              )}
            </div>

            {/* External Links */}
            {person.external_ids && (
              <div className="flex justify-center gap-3 mt-4">
                {person.external_ids.imdb_id && (
                  <a
                    href={`https://www.imdb.com/name/${person.external_ids.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                  >
                    IMDb
                  </a>
                )}
                {person.external_ids.instagram_id && (
                  <a
                    href={`https://instagram.com/${person.external_ids.instagram_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Instagram
                  </a>
                )}
                {person.external_ids.twitter_id && (
                  <a
                    href={`https://twitter.com/${person.external_ids.twitter_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors text-sm"
                  >
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {person.name}
            </h1>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-zinc-300">
              {person.known_for_department && (
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-red-500" />
                  <span>{person.known_for_department}</span>
                </div>
              )}
              {person.birthday && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>
                    {formatDate(person.birthday)}
                    {age && !person.deathday && ` (${age} years old)`}
                  </span>
                </div>
              )}
              {person.deathday && (
                <div className="flex items-center gap-2 text-zinc-500">
                  <Calendar className="w-4 h-4" />
                  <span>Died: {formatDate(person.deathday)}</span>
                </div>
              )}
              {person.place_of_birth && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{person.place_of_birth}</span>
                </div>
              )}
            </div>

            {/* Biography */}
            {person.biography && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Biography</h2>
                <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {person.biography.length > 1000
                    ? person.biography.slice(0, 1000) + "..."
                    : person.biography}
                </div>
              </div>
            )}

            {/* Also Known As */}
            {person.also_known_as && person.also_known_as.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-zinc-500 mb-2">Also Known As</h3>
                <div className="flex flex-wrap gap-2">
                  {person.also_known_as.slice(0, 5).map((name, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Movie Credits */}
        {movieCredits.length > 0 && (
          <Section title="Known For (Movies)" className="mt-12">
            <ScrollRow>
              {movieCredits.map((movie: any) => (
                <div key={`movie-${movie.id}-${movie.credit_id}`} className="flex-shrink-0 w-[180px]">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </ScrollRow>
          </Section>
        )}

        {/* TV Credits */}
        {tvCredits.length > 0 && (
          <Section title="TV Shows" className="mt-8">
            <ScrollRow>
              {tvCredits.map((show: any) => (
                <div key={`tv-${show.id}-${show.credit_id}`} className="flex-shrink-0 w-[180px]">
                  <TVCard show={show} />
                </div>
              ))}
            </ScrollRow>
          </Section>
        )}

        {/* Photos */}
        {person.images?.profiles && person.images.profiles.length > 1 && (
          <Section title="Photos" className="mt-8">
            <ScrollRow>
              {person.images.profiles.slice(0, 10).map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-32 aspect-[2/3] relative rounded-lg overflow-hidden bg-zinc-800"
                >
                  <Image
                    src={getImageUrl(image.file_path, "w185")}
                    alt={`${person.name} photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              ))}
            </ScrollRow>
          </Section>
        )}
      </div>
    </div>
  );
}
