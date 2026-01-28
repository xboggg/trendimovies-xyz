"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditNewsPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    category: "entertainment",
    image_url: "",
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/admin/news?id=${id}`);
        const data = await res.json();
        if (data.success && data.article) {
          setFormData({
            title: data.article.title || "",
            content: data.article.content || "",
            excerpt: data.article.excerpt || "",
            status: data.article.status || "draft",
            category: data.article.category || "entertainment",
            image_url: data.article.image_url || "",
          });
        } else {
          setError(data.error || "Article not found");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...formData }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/news");
      } else {
        setError(data.error || "Failed to update article");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/news" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Article</h1>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Excerpt</label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Content</label>
              <textarea
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="entertainment">Entertainment</option>
                  <option value="movies">Movies</option>
                  <option value="tv">TV Shows</option>
                  <option value="streaming">Streaming</option>
                  <option value="celebrity">Celebrity</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/news"
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
