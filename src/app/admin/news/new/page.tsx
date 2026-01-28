import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Create Article | Admin" };

export default function NewArticlePage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/news" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
          <h1 className="text-3xl font-bold text-white">Create News Article</h1>
          <p className="text-zinc-400 mt-2">Write a new article or use AI to generate content</p>
        </div>

        <div className="bg-blue-900/20 border border-blue-600/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-400 font-medium mb-1">AI Content Generation</p>
              <p className="text-sm text-blue-300">
                For AI-powered article generation,{" "}
                <Link href="/admin/news/fetch" className="underline hover:text-white">
                  use the AI News Generator
                </Link>
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Article Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Article headline..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Slug</label>
                <input
                  type="text"
                  placeholder="article-slug (auto-generated from title)"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary (shown in listings)..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Content *</label>
                <textarea
                  rows={12}
                  placeholder="Article content in markdown format..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none font-mono text-sm"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Supports Markdown formatting
                </p>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Category *</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none">
                  <option value="">Select category...</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="movies">Movies</option>
                  <option value="tv">TV Shows</option>
                  <option value="streaming">Streaming</option>
                  <option value="celebrity">Celebrity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="marvel, action, superhero (comma-separated)"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Featured Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Image Alt Text</label>
                <input
                  type="text"
                  placeholder="Description for accessibility..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Related Movie (TMDB ID)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Related TV Show (TMDB ID)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Source URL</label>
                <input
                  type="url"
                  placeholder="Original source (if applicable)"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Source Name</label>
                <input
                  type="text"
                  placeholder="Publication name"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Status *</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none">
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Article
            </button>
            <Link
              href="/admin/news"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </Link>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
            <p className="text-zinc-400 mb-2">Form submission not yet implemented</p>
            <p className="text-sm text-zinc-500">
              This is a placeholder. Use the AI News Generator for automated content creation.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
