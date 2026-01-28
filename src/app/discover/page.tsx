import { Metadata } from "next";
import Link from "next/link";
import { Film, Calendar, ListOrdered, Trophy, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover | TrendiMovies",
  description: "Explore movie franchises, release calendars, watch order guides, and curated best-of lists.",
};

const discoverSections = [
  {
    title: "Franchises",
    description: "Explore complete movie franchises like Marvel, Star Wars, Harry Potter, and more.",
    href: "/discover/franchises",
    icon: Film,
    color: "from-red-600 to-orange-600",
  },
  {
    title: "Release Calendar",
    description: "Upcoming movie releases for 2025, 2026, and beyond. Never miss a premiere.",
    href: "/discover/calendar",
    icon: Calendar,
    color: "from-blue-600 to-cyan-600",
  },
  {
    title: "Watch Order Guides",
    description: "Chronological vs release order guides for complex movie universes.",
    href: "/discover/watch-order",
    icon: ListOrdered,
    color: "from-purple-600 to-pink-600",
  },
  {
    title: "Best Of Lists",
    description: "Curated lists of the best action, horror, comedy, and more by year.",
    href: "/discover/best-of",
    icon: Trophy,
    color: "from-yellow-600 to-amber-600",
  },
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Explore curated collections, franchise guides, release calendars, and the best movies handpicked for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {discoverSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-zinc-400 mb-4">
                    {section.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-red-500 font-medium group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
