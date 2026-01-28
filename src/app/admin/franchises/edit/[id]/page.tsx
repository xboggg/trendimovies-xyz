"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditFranchisePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    tmdb_collection_id: "",
    logo_url: "",
    banner_url: "",
  });

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        const res = await fetch("/api/admin/franchises");
        const data = await res.json();
        if (data.success) {
          const franchise = data.franchises.find((f: any) => f.id === id);
          if (franchise) {
            setFormData({
              name: franchise.name || "",
              slug: franchise.slug || "",
              description: franchise.description || "",
              tmdb_collection_id: franchise.tmdb_collection_id?.toString() || "",
              logo_url: franchise.logo_url || "",
              banner_url: franchise.banner_url || "",
            });
          } else {
            setError("Franchise not found");
          }
        } else {
          setError(data.error || "Failed to fetch franchise");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchFranchise();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim()) {
      setError("Franchise name is required");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch("/api/admin/franchises", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...formData }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/franchises");
      } else {
        setError(data.error || "Failed to update franchise");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/admin/franchises" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Franchises
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Franchise</h1>
        </div>
        {error && <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6"><p className="text-red-400">{error}</p></div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" required />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Slug</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData(p => ({...p, slug: e.target.value}))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Description</label>
              <textarea rows={4} value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">TMDB Collection ID</label>
              <input type="number" value={formData.tmdb_collection_id} onChange={(e) => setFormData(p => ({...p, tmdb_collection_id: e.target.value}))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Logo URL</label>
              <input type="url" value={formData.logo_url} onChange={(e) => setFormData(p => ({...p, logo_url: e.target.value}))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Banner URL</label>
              <input type="url" value={formData.banner_url} onChange={(e) => setFormData(p => ({...p, banner_url: e.target.value}))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link href="/admin/franchises" className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
