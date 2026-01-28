import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Release Calendar | Admin" };

export default function AdminCalendarPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Release Calendar</h1>
            <p className="text-zinc-400 mt-2">Manage upcoming movie and TV show releases</p>
          </div>
          <Link
            href="/admin/calendar/new"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Release
          </Link>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
          <p className="text-zinc-400 mb-4">Release calendar management coming soon</p>
          <p className="text-sm text-zinc-500">
            This feature will sync with TMDB to show upcoming releases automatically.
          </p>
        </div>
      </div>
    </main>
  );
}
