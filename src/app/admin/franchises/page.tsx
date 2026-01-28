"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";

interface Franchise {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tmdb_collection_id: number | null;
  logo_url: string | null;
  banner_url: string | null;
  created_at: string;
}

export default function AdminFranchisesPage() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/franchises");
      const data = await res.json();
      if (data.success) {
        setFranchises(data.franchises || []);
      } else {
        setError(data.error || "Failed to fetch franchises");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFranchises();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(id);
      const res = await fetch(`/api/admin/franchises?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFranchises(franchises.filter(f => f.id !== id));
      } else {
        alert(data.error || "Failed to delete franchise");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Manage Franchises</h1>
            <p className="text-zinc-400 mt-2">Add and manage movie franchise collections ({franchises.length} total)</p>
          </div>
          <Link
            href="/admin/franchises/new"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Franchise
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchFranchises} className="mt-4 text-white underline">Try again</button>
          </div>
        ) : franchises.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
            <p className="text-zinc-400 mb-4">No franchises added yet</p>
            <Link
              href="/admin/franchises/new"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Franchise
            </Link>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">TMDB ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {franchises.map((franchise) => (
                  <tr key={franchise.id} className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{franchise.name}</div>
                      {franchise.description && (
                        <div className="text-sm text-zinc-500 truncate max-w-xs">{franchise.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{franchise.slug}</td>
                    <td className="px-6 py-4">
                      {franchise.tmdb_collection_id ? (
                        <a 
                          href={`https://www.themoviedb.org/collection/${franchise.tmdb_collection_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          {franchise.tmdb_collection_id}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {new Date(franchise.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/discover/franchises/${franchise.slug}`}
                          target="_blank"
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          title="View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/franchises/edit/${franchise.id}`}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(franchise.id, franchise.name)}
                          disabled={deleting === franchise.id}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === franchise.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
