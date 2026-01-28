"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, RefreshCw, Sparkles, Zap, Loader2 } from "lucide-react";
import { supabase, NewsArticle } from "@/lib/supabase";

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoFetching, setAutoFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    const { data } = await supabase.from("news_articles").select("*").order("created_at", { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  const autoFetchNews = async () => {
    setAutoFetching(true);
    setFetchResult(null);
    try {
      const res = await fetch("/api/news/fetch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ count: 10 }) });
      const data = await res.json();
      setFetchResult(data);
      if (data.success) {
        fetchArticles(); // Refresh the list
      }
    } catch (error) {
      setFetchResult({ error: "Failed to fetch news" });
    }
    setAutoFetching(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const deleteArticle = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await supabase.from("news_articles").delete().eq("id", id);
    fetchArticles();
  };

  const publishArticle = async (id: string) => {
    await supabase.from("news_articles").update({ status: "published", published_at: new Date().toISOString() }).eq("id", id);
    fetchArticles();
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">News Articles</h1>
            <p className="text-zinc-400">Manage and publish news content</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={autoFetchNews}
              disabled={autoFetching}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
            >
              {autoFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {autoFetching ? "Fetching..." : "Auto-Fetch News"}
            </button>
            <Link href="/admin/news/fetch" className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Sparkles className="w-4 h-4" />Manual Fetch
            </Link>
            <Link href="/admin/news/new" className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />New Article
            </Link>
          </div>
        </div>

        {fetchResult && (
          <div className={`mb-6 p-4 rounded-lg ${fetchResult.success ? "bg-green-600/20 border border-green-600/50" : "bg-red-600/20 border border-red-600/50"}`}>
            <p className={fetchResult.success ? "text-green-400" : "text-red-400"}>
              {fetchResult.message || fetchResult.error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 text-zinc-400 animate-spin" /></div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 mb-4">No articles yet</p>
            <Link href="/admin/news/new" className="text-red-500 hover:text-red-400">Create your first article</Link>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Views</th>
                  <th className="text-right px-4 py-3 text-zinc-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                    <td className="px-4 py-3">
                      <div className="text-white font-medium line-clamp-1">{article.title}</div>
                      <div className="text-zinc-500 text-sm">{article.category}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={"px-2 py-1 rounded text-xs font-medium " + (article.status === "published" ? "bg-green-600/20 text-green-400" : article.status === "pending" ? "bg-yellow-600/20 text-yellow-400" : "bg-zinc-600/20 text-zinc-400")}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-sm">{new Date(article.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-zinc-400 text-sm">{article.views}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={"/news/" + article.slug} className="p-2 text-zinc-400 hover:text-white"><Eye className="w-4 h-4" /></Link>
                        <Link href={"/admin/news/" + article.id} className="p-2 text-zinc-400 hover:text-white"><Edit className="w-4 h-4" /></Link>
                        {article.status !== "published" && (
                          <button onClick={() => publishArticle(article.id)} className="p-2 text-green-400 hover:text-green-300">Publish</button>
                        )}
                        <button onClick={() => deleteArticle(article.id)} className="p-2 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
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
