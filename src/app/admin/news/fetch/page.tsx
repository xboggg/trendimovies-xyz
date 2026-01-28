"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, Loader2, CheckCircle, AlertCircle, Upload, X, ImageIcon } from "lucide-react";

export default function FetchNewsPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; article?: any } | null>(null);
  const [form, setForm] = useState({ title: "", content: "", source_url: "", source_name: "", image_url: "", category: "entertainment" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "news");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        setForm({ ...form, image_url: data.url });
        setImagePreview(data.url);
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      alert("Failed to upload image");
    }

    setUploading(false);
  };

  const clearImage = () => {
    setForm({ ...form, image_url: "" });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/news/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        setForm({ title: "", content: "", source_url: "", source_name: "", image_url: "", category: "entertainment" });
        setImagePreview(null);
      }
    } catch (error) {
      setResult({ error: "Failed to process" });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/admin/news" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />Back to News
        </Link>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI News Generator</h1>
              <p className="text-zinc-400 text-sm">Paste news content to rewrite with AI</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Original Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="Original news title" />
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-1">Original Content *</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={8} className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none resize-none" placeholder="Paste the original news content here..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-1">Source URL</label>
                <input type="url" value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-1">Source Name</label>
                <input type="text" value={form.source_name} onChange={(e) => setForm({ ...form, source_name: e.target.value })} className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="Variety, THR, etc." />
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Article Image</label>

              {imagePreview || form.image_url ? (
                <div className="relative">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
                    <Image
                      src={imagePreview || form.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Upload Button */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 hover:border-zinc-600 rounded-lg p-6 text-center cursor-pointer transition-colors"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                        <p className="text-zinc-400 text-sm">Uploading...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-zinc-400" />
                        </div>
                        <p className="text-zinc-400 text-sm">Click to upload image</p>
                        <p className="text-zinc-500 text-xs">PNG, JPG, WebP (max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* OR divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-zinc-700" />
                    <span className="text-zinc-500 text-sm">OR</span>
                    <div className="flex-1 h-px bg-zinc-700" />
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={form.image_url}
                        onChange={(e) => {
                          setForm({ ...form, image_url: e.target.value });
                          if (e.target.value) setImagePreview(e.target.value);
                        }}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        placeholder="Paste image URL..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => form.image_url && setImagePreview(form.image_url)}
                      className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none">
                <option value="entertainment">Entertainment</option>
                <option value="movies">Movies</option>
                <option value="tv">TV Shows</option>
                <option value="streaming">Streaming</option>
                <option value="celebrity">Celebrity</option>
              </select>
            </div>

            <button type="submit" disabled={loading || uploading} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium rounded-lg transition-colors">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing with AI...</> : <><Sparkles className="w-5 h-5" />Generate Article</>}
            </button>
          </form>

          {result && (
            <div className={"mt-6 p-4 rounded-lg " + (result.success ? "bg-green-600/20 border border-green-600/50" : "bg-red-600/20 border border-red-600/50")}>
              {result.success ? (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-medium">Article created successfully!</p>
                    <p className="text-zinc-400 text-sm mt-1">{result.article?.title}</p>
                    <Link href="/admin/news" className="text-green-400 text-sm hover:underline mt-2 inline-block">View in dashboard →</Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400">{result.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
