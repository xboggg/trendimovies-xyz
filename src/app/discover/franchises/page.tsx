import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BackToDiscover } from "@/components/common/BackToDiscover";
import { Film, ArrowRight } from "lucide-react";
import { supabase, Franchise } from "@/lib/supabase";
import { getCollection } from "@/services/tmdb";

export const metadata: Metadata = {
  title: "Movie Franchises | TrendiMovies",
  description: "Explore complete movie franchises like Marvel, Star Wars, Harry Potter, Fast & Furious, and more.",
};

// Revalidate every 5 minutes for balance between freshness and speed
export const revalidate = 3600;

async function getFranchises(): Promise<Franchise[]> {
  const { data, error } = await supabase
    .from("franchises")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching franchises:", error);
    return [];
  }

  return data || [];
}

export default async function FranchisesPage() {
  const franchises = await getFranchises();

  // Get TMDB collection data for images
  const franchisesWithImages = await Promise.all(
    franchises.map(async (franchise) => {
      if (franchise.tmdb_collection_id) {
        try {
          const collection = await getCollection(franchise.tmdb_collection_id);
          return {
            ...franchise,
            backdrop: collection?.backdrop_path,
            poster: collection?.poster_path,
            movieCount: collection?.parts?.length || 0,
          };
        } catch {
          return { ...franchise, backdrop: null, poster: null, movieCount: 0 };
        }
      }
      return { ...franchise, backdrop: null, poster: null, movieCount: 0 };
    })
  );

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <BackToDiscover />
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Movie Franchises
          </h1>
          <p className="text-zinc-400">
            Complete guides to your favorite movie universes
          </p>
        </div>

        {franchisesWithImages.length === 0 ? (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No franchises added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {franchisesWithImages.map((franchise) => (
              <Link
                key={franchise.id}
                href={`/discover/franchises/${franchise.slug}`}
                className="group relative aspect-[16/9] rounded-xl overflow-hidden"
              >
                {franchise.backdrop ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w780${franchise.backdrop}`}
                    alt={franchise.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
                    {franchise.name}
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">
                      {franchise.movieCount} movies
                    </span>
                    <span className="flex items-center gap-1 text-red-500 text-sm group-hover:gap-2 transition-all">
                      View Guide <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
