import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export const metadata: Metadata = { title: "Settings | Admin" };

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-zinc-400 mt-2">Configure your TrendiMovies site</p>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Site Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Site Name</label>
                <input
                  type="text"
                  defaultValue="TrendiMovies"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Site Description</label>
                <textarea
                  defaultValue="Discover trending movies, TV shows, reviews, and find where to watch your favorites."
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">TMDB API Key</label>
                <input
                  type="password"
                  value="configured"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Groq API Key (AI Rewriting)</label>
                <input
                  type="password"
                  value="configured"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">News API Configuration</h2>
            <p className="text-sm text-zinc-500 mb-4">Auto-fetch runs daily at 8:00 AM GMT (10 articles)</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">NewsAPI Key</label>
                <input
                  type="password"
                  value="configured"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                  disabled
                />
                <p className="text-xs text-zinc-500 mt-1">Source 1: newsapi.org - 5 articles/day</p>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">GNews API Key</label>
                <input
                  type="password"
                  value="configured"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                  disabled
                />
                <p className="text-xs text-zinc-500 mt-1">Source 2: gnews.io - 5 articles/day</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">News Fetch Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400">NewsAPI</p>
                <p className="text-lg font-semibold text-green-400">Active</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400">GNews</p>
                <p className="text-lg font-semibold text-green-400">Active</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400">AI Rewriting</p>
                <p className="text-lg font-semibold text-green-400">Enabled</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400">Duplicate Filter</p>
                <p className="text-lg font-semibold text-green-400">Enabled</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
            <p className="text-zinc-400 mb-2">Settings management coming soon</p>
            <p className="text-sm text-zinc-500">
              Full configuration interface will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
