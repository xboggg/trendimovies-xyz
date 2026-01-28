"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function NewFranchisePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    tmdb_collection_id: "",
    logo_url: "",
    banner_url: "",
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Franchise name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/franchises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || generateSlug(formData.name),
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/franchises");
      } else {
        setError(data.error || "Failed to create franchise");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/franchises" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Franchises
          </Link>
          <h1 className="text-3xl font-bold text-white">Add New Franchise</h1>
          <p className="text-zinc-400 mt-2">Create a new movie franchise collection</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Franchise Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Franchise Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g., Marvel Cinematic Universe"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="mcu (auto-generated from name)"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the franchise..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">TMDB Collection ID</label>
                <input
                  type="number"
                  value={formData.tmdb_collection_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, tmdb_collection_id: e.target.value }))}
                  placeholder="e.g., 86311 for Avengers"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Find collection IDs at themoviedb.org
                </p>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Banner URL</label>
                <input
                  type="url"
                  value={formData.banner_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, banner_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Franchise
                </>
              )}
            </button>
            <Link
              href="/admin/franchises"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
