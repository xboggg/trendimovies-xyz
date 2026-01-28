import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Calendar } from "lucide-react";
import { supabase, Franchise } from "@/lib/supabase";
import { getCollection } from "@/services/tmdb";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getFranchise(slug: string): Promise<Franchise | null> {
  const { data } = await supabase.from("franchises").select("*").eq("slug", slug).single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const franchise = await getFranchise(slug);
  if (!franchise) return { title: "Not Found" };
  return { title: `${franchise.name} | TrendiMovies`, description: franchise.description || "" };
}

export default async function FranchisePage({ params }: Props) {
  const { slug } = await params;
  const franchise = await getFranchise(slug);
  if (!franchise) notFound();

  let movies: any[] = [];
  let backdrop = null;

  if (franchise.tmdb_collection_id) {
    const collection = await getCollection(franchise.tmdb_collection_id);
    if (collection?.parts) {
      movies = collection.parts.sort((a: any, b: any) =>
        new Date(a.release_date || "9999").getTime() - new Date(b.release_date || "9999").getTime()
      );
      backdrop = collection.backdrop_path;
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="relative h-[40vh] min-h-[300px]">
        {backdrop && <Image src={`https://image.tmdb.org/t/p/original${backdrop}`} alt={franchise.name} fill className="object-cover" priority />}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <Link href="/discover/franchises" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4"><ArrowLeft className="w-4 h-4" />Back</Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{franchise.name}</h1>
          {franchise.description && <p className="text-zinc-300 mt-2 max-w-2xl">{franchise.description}</p>}
          <p className="text-zinc-400 mt-2">{movies.length} Movies</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Release Order</h2>
        <div className="space-y-4">
          {movies.map((movie: any, i: number) => (
            <Link key={movie.id} href={`/movies/${movie.id}`} className="flex gap-4 bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">{i + 1}</div>
              <div className="w-20 h-30 relative rounded overflow-hidden flex-shrink-0">
                {movie.poster_path ? <Image src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={movie.title} fill className="object-cover" /> : <div className="w-full h-full bg-zinc-800" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                <div className="flex gap-4 text-sm text-zinc-400 mt-1">
                  {movie.release_date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(movie.release_date).getFullYear()}</span>}
                  {movie.vote_average > 0 && <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" />{movie.vote_average.toFixed(1)}</span>}
                </div>
                {movie.overview && <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{movie.overview}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
