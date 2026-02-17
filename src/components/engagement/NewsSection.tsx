"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Clock, ArrowRight, TrendingUp, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image_url?: string;
  category?: string;
  published_at: string;
}

interface NewsSectionProps {
  articles: NewsArticle[];
}

export function NewsSection({ articles }: NewsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (articles.length === 0) return null;

  const featured = articles[0];
  const rest = articles.slice(1);

  const categories = ["All", ...new Set(articles.map((a) => a.category).filter(Boolean))];

  const filteredArticles = activeCategory && activeCategory !== "All"
    ? articles.filter((a) => a.category === activeCategory)
    : articles;

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
            className="p-2 bg-red-500/10 rounded-xl"
          >
            <Newspaper className="w-5 h-5 text-red-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Latest News</h2>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-full"
          >
            <Flame className="w-3 h-3 text-orange-500" />
            <span className="text-orange-400 text-xs font-medium">Hot</span>
          </motion.span>
        </div>
        <Link
          href="/news"
          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium transition-colors group"
        >
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat === "All" ? null : cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              (cat === "All" && !activeCategory) || cat === activeCategory
                ? "bg-red-600 text-white"
                : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured Article - Large */}
        <motion.div
          layout
          className="lg:col-span-7"
        >
          <Link href={`/news/${featured.slug}`}>
            <motion.article
              whileHover={{ y: -5 }}
              className="group relative h-full bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-red-500/30 transition-all"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {featured.image_url ? (
                  <Image
                    src={featured.image_url}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <Newspaper className="w-16 h-16 text-zinc-700" />
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                {/* Category Badge */}
                {featured.category && (
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider"
                  >
                    {featured.category}
                  </motion.span>
                )}

                {/* Trending indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full"
                >
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-xs font-medium">Trending</span>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition-colors mb-3 line-clamp-2">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {featured.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(featured.published_at), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 70%)",
                }}
              />
            </motion.article>
          </Link>
        </motion.div>

        {/* Side Articles */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {rest.slice(0, 3).map((article, idx) => (
            <Link key={article.id} href={`/news/${article.slug}`}>
              <motion.article
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 5 }}
                onHoverStart={() => setHoveredIndex(idx)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="group flex gap-4 p-3 bg-zinc-900/50 hover:bg-zinc-800/50 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <Newspaper className="w-6 h-6 text-zinc-700" />
                    </div>
                  )}
                  {article.category && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-medium rounded capitalize">
                      {article.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-1">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-1 text-zinc-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: hoveredIndex === idx ? 1 : 0, x: hoveredIndex === idx ? 0 : -10 }}
                  className="self-center"
                >
                  <ArrowRight className="w-4 h-4 text-red-400" />
                </motion.div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
