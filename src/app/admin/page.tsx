import { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Film, ListOrdered, Calendar, Settings } from "lucide-react";

export const metadata: Metadata = { title: "Admin Dashboard | TrendiMovies" };

const adminSections = [
  { title: "News Articles", description: "Manage news articles and AI-generated content", href: "/admin/news", icon: Newspaper, color: "from-blue-600 to-cyan-600" },
  { title: "Franchises", description: "Manage movie franchise collections", href: "/admin/franchises", icon: Film, color: "from-red-600 to-orange-600" },
  { title: "Curated Lists", description: "Manage best-of and recommendation lists", href: "/admin/lists", icon: ListOrdered, color: "from-purple-600 to-pink-600" },
  { title: "Release Calendar", description: "Manage upcoming releases", href: "/admin/calendar", icon: Calendar, color: "from-green-600 to-emerald-600" },
  { title: "Settings", description: "Site settings and configuration", href: "/admin/settings", icon: Settings, color: "from-zinc-600 to-zinc-500" },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-zinc-400 mb-8">Manage your TrendiMovies content</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminSections.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.href} href={s.href} className="group bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all">
                <div className={"w-12 h-12 rounded-lg bg-gradient-to-br " + s.color + " flex items-center justify-center mb-4"}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white group-hover:text-red-500">{s.title}</h2>
                <p className="text-zinc-400 text-sm mt-1">{s.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
