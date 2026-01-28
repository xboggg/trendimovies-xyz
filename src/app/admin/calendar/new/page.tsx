import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export const metadata: Metadata = { title: "Add Release | Admin" };

export default function NewReleasePage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/calendar" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Calendar
          </Link>
          <h1 className="text-3xl font-bold text-white">Add Release</h1>
          <p className="text-zinc-400 mt-2">Add a movie or TV show to the release calendar</p>
        </div>

        <form className="space-y-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Release Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Media Type *</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none">
                  <option value="">Select type...</option>
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">TMDB ID *</label>
                <input
                  type="number"
                  placeholder="e.g., 299536"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Find IDs at themoviedb.org
                </p>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Movie or show title"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Release Date *</label>
                <input
                  type="date"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Release Type</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none">
                  <option value="theatrical">Theatrical</option>
                  <option value="streaming">Streaming</option>
                  <option value="digital">Digital</option>
                  <option value="tv">TV Premiere</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Platform (if streaming/digital)</label>
                <input
                  type="text"
                  placeholder="e.g., Netflix, Disney+"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlighted"
                  className="w-4 h-4 bg-zinc-800 border-zinc-700 rounded"
                />
                <label htmlFor="highlighted" className="text-sm text-zinc-400">
                  Highlight this release
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Add Release
            </button>
            <Link
              href="/admin/calendar"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </Link>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
            <p className="text-zinc-400 mb-2">Form submission not yet implemented</p>
            <p className="text-sm text-zinc-500">
              This is a placeholder. The calendar will auto-sync with TMDB in a future update.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
