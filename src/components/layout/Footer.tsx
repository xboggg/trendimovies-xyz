import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Film,
} from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <span className="text-red-600">Trendi</span>
              <span className="text-white">Movies</span>
            </Link>
            <p className="text-zinc-400 text-sm mb-6 max-w-md">
              Your ultimate destination for discovering movies, TV shows, reviews,
              and finding where to stream your favorites. Join millions of movie
              enthusiasts.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/trendimovies"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/trendimovies"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/trendimovies"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/trendimovies"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-white font-semibold mb-4">Discover</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.discover.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-red-500 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-white font-semibold mb-4">Genres</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.genres.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-red-500 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-red-500 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold mb-1">
                Subscribe to our newsletter
              </h3>
              <p className="text-zinc-400 text-sm">
                Get the latest movie news and recommendations delivered to your inbox.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <Film className="w-4 h-4" />
            <span>
              Data provided by{" "}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400"
              >
                TMDB
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
