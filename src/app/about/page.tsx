import { Metadata } from "next";
import Link from "next/link";
import { Film, Users, Globe, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | TrendiMovies",
  description: "Learn about TrendiMovies - your ultimate destination for movie and TV show information, reviews, and entertainment news.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About TrendiMovies
          </h1>
          <p className="text-xl text-zinc-400">
            Your ultimate destination for movies and TV shows
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            At TrendiMovies, we believe that great entertainment should be accessible to everyone.
            Our mission is to provide movie and TV enthusiasts with comprehensive, accurate, and
            up-to-date information about their favorite content.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Whether you're looking for the latest blockbuster releases, classic films, trending
            TV series, or entertainment news, TrendiMovies is your go-to platform for all things
            movies and television.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
              <Film className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Extensive Database</h3>
            <p className="text-zinc-400">
              Access information on thousands of movies and TV shows, powered by TMDB's
              comprehensive database with ratings, cast details, and more.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Community Driven</h3>
            <p className="text-zinc-400">
              Join a community of movie lovers. Share your favorites, discover new content,
              and stay updated with the latest entertainment trends.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Global Content</h3>
            <p className="text-zinc-400">
              Explore content from around the world including Hollywood blockbusters,
              international cinema, anime, and regional productions.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Curated Collections</h3>
            <p className="text-zinc-400">
              Discover handpicked collections, franchise guides, watch orders, and
              best-of lists curated by our team of entertainment enthusiasts.
            </p>
          </div>
        </div>

        {/* Data Attribution */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Data Attribution</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            TrendiMovies uses data from The Movie Database (TMDB) API. We are grateful for
            their comprehensive database that makes our service possible.
          </p>
          <p className="text-zinc-400 text-sm">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <p className="text-zinc-400 mb-4">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
