"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, CheckCircle2 } from "lucide-react";

export default function NewListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    list_type: "",
    year: new Date().getFullYear().toString(),
    image_url: "",
    is_featured: false,
    display_order: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/admin/lists"), 1500);
      } else {
        setError(data.error || "Failed to create list");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/lists" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Lists
          </Link>
          <h1 className="text-3xl font-bold text-white">Create New List</h1>
          <p className="text-zinc-400 mt-2">Create a curated list of movies or TV shows</p>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-green-600/20 border border-green-600/50">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-green-400">List created successfully! Redirecting...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-red-600/20 border border-red-600/50">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">List Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">List Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Best Action Movies of 2025"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="best-action-2025 (auto-generated from title)"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Brief description of this list..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">List Type *</label>
                <select
                  name="list_type"
                  value={form.list_type}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="">Select type...</option>
                  <option value="best-of">Best Of</option>
                  <option value="awards">Awards</option>
                  <option value="recommendations">Recommendations</option>
                  <option value="trending">Trending</option>
                  <option value="hidden-gems">Hidden Gems</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="2025"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Cover Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  id="featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 bg-zinc-800 border-zinc-700 rounded"
                />
                <label htmlFor="featured" className="text-sm text-zinc-400">
                  Feature this list on the homepage
                </label>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={form.display_order}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <p className="text-xs text-zinc-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Creating..." : "Create List"}
            </button>
            <Link
              href="/admin/lists"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
