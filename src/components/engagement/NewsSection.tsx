"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Clock, ArrowRight, Zap, ChevronUp, ChevronDown } from "lucide-react";
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

// Breaking News Ticker Component
function NewsTicker({ articles }: { articles: NewsArticle[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) return null;

  return (
    <div className="relative overflow-hidden h-10 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-lg">
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
          backgroundSize: "200% 100%",
        }}
      />

      <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 bg-black/30 z-10">
        <Zap className="w-4 h-4 text-yellow-300 mr-1" />
        <span className="text-white text-xs font-bold uppercase tracking-wider">Breaking</span>
      </div>

      <div className="h-full flex items-center pl-28 pr-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <Link
              href={"/news/" + articles[currentIndex].slug}
              className="text-white text-sm font-medium hover:underline line-clamp-1"
            >
              {articles[currentIndex].title}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
        {articles.slice(0, 4).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={"w-1.5 h-1.5 rounded-full transition-all " + (idx === currentIndex ? "bg-white w-4" : "bg-white/40")}
          />
        ))}
      </div>
    </div>
  );
}

// Vertical News Stack with 3D effect
function VerticalNewsStack({ articles }: { articles: NewsArticle[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goUp = () => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex(activeIndex - 1);
    }
  };

  const goDown = () => {
    if (activeIndex < articles.length - 1) {
      setDirection(1);
      setActiveIndex(activeIndex + 1);
    }
  };

  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) return null;

  return (
    <div className="relative h-[320px]">
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goUp}
          disabled={activeIndex === 0}
          className={"p-2 rounded-full transition-all " + (activeIndex === 0 ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-500")}
        >
          <ChevronUp className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goDown}
          disabled={activeIndex === articles.length - 1}
          className={"p-2 rounded-full transition-all " + (activeIndex === articles.length - 1 ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-500")}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="relative h-full perspective-1000">
        <AnimatePresence mode="popLayout" custom={direction}>
          {articles.map((article, idx) => {
            const offset = idx - activeIndex;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={article.id}
                custom={direction}
                initial={{ y: direction > 0 ? 100 : -100, opacity: 0, scale: 0.8 }}
                animate={{
                  y: offset * 8,
                  opacity: offset === 0 ? 1 : 0.3 - Math.abs(offset) * 0.1,
                  scale: 1 - Math.abs(offset) * 0.05,
                  zIndex: articles.length - Math.abs(offset),
                  rotateX: offset * -2,
                }}
                exit={{ y: direction > 0 ? -100 : 100, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 origin-center"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link href={"/news/" + article.slug} className="block h-full">
                  <div className={"h-full rounded-2xl overflow-hidden border transition-all " + (offset === 0 ? "border-red-500/30 shadow-xl shadow-red-500/10" : "border-zinc-800/50")}>
                    <div className="relative h-48 overflow-hidden">
                      {article.image_url ? (
                        <Image src={article.image_url} alt={article.title} fill className="object-cover" sizes="400px" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                          <Newspaper className="w-12 h-12 text-zinc-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                      {article.category && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase">
                          {article.category}
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-zinc-900">
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-2 text-zinc-500 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: ((activeIndex + 1) / articles.length) * 100 + "%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// Mini news list WITH THUMBNAILS
function MiniNewsList({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="space-y-3">
      {articles.map((article, idx) => (
        <Link key={article.id} href={"/news/" + article.slug}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ x: 5, backgroundColor: "rgba(239,68,68,0.1)" }}
            className="group flex gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-red-500/30 transition-all"
          >
            {/* Thumbnail with number badge */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden relative">
              {article.image_url ? (
                <Image src={article.image_url} alt={article.title} fill className="object-cover" sizes="64px" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-zinc-700" />
                </div>
              )}
              {/* Number badge overlay */}
              <div className="absolute top-0 left-0 w-6 h-6 rounded-br-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{idx + 1}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-zinc-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Arrow */}
            <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="self-center">
              <ArrowRight className="w-4 h-4 text-red-400" />
            </motion.div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

export function NewsSection({ articles }: NewsSectionProps) {
  if (articles.length === 0) return null;

  const featured = articles.slice(0, 4);
  const rest = articles.slice(1, 4);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(239,68,68,0)",
                "0 0 0 8px rgba(239,68,68,0.2)",
                "0 0 0 0 rgba(239,68,68,0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2.5 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl"
          >
            <Newspaper className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-white">Entertainment News</h2>
            <p className="text-zinc-500 text-xs">Latest updates from Hollywood</p>
          </div>
        </div>
        <Link
          href="/news"
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800/50 hover:bg-red-600 text-zinc-300 hover:text-white text-sm font-medium rounded-full transition-all group"
        >
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="mb-5">
        <NewsTicker articles={articles} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <VerticalNewsStack articles={featured} />
        </div>

        <div className="lg:col-span-5">
          <div className="mb-4">
            <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
              <span className="w-8 h-px bg-zinc-700" />
              Top Stories
            </h3>
          </div>
          <MiniNewsList articles={rest} />
        </div>
      </div>
    </section>
  );
}
