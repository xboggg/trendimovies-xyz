"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, CheckCircle, X, Film, Tv, Sparkles } from "lucide-react";

interface NewsletterProps {
  variant?: "inline" | "card" | "footer";
  className?: string;
}

export function Newsletter({ variant = "card", className = "" }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState({
    movies: true,
    tvShows: true,
    trivia: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, preferences }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Welcome to TrendiMovies! Check your email for confirmation.");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (variant === "footer") {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold text-white mb-3">Stay Updated</h3>
        <p className="text-zinc-400 text-sm mb-4">
          Get the latest movie news and recommendations.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
          </button>
        </form>
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm mt-2 ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">
              Never Miss a Movie Update
            </h3>
            <p className="text-zinc-400 text-sm">
              Weekly picks, release alerts, and exclusive trivia!
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 sm:w-48 px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              disabled={status === "loading" || status === "success"}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "..." : status === "success" ? "✓" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-zinc-900 via-zinc-900 to-red-900/20 border border-zinc-800 rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-600/20 rounded-lg">
          <Mail className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Join the Newsletter</h3>
          <p className="text-zinc-400 text-sm">
            Get weekly movie picks and entertainment news
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">You&apos;re In!</h4>
            <p className="text-zinc-400">{message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Preferences */}
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">I&apos;m interested in:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => togglePreference("movies")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    preferences.movies
                      ? "bg-red-600/20 border-red-500 text-red-400"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400"
                  } border`}
                >
                  <Film className="w-4 h-4" />
                  Movies
                </button>
                <button
                  type="button"
                  onClick={() => togglePreference("tvShows")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    preferences.tvShows
                      ? "bg-red-600/20 border-red-500 text-red-400"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400"
                  } border`}
                >
                  <Tv className="w-4 h-4" />
                  TV Shows
                </button>
                <button
                  type="button"
                  onClick={() => togglePreference("trivia")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    preferences.trivia
                      ? "bg-red-600/20 border-red-500 text-red-400"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400"
                  } border`}
                >
                  <Sparkles className="w-4 h-4" />
                  Trivia
                </button>
              </div>
            </div>

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg"
              >
                <X className="w-4 h-4" />
                {message}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Subscribe Now
                </>
              )}
            </button>

            <p className="text-xs text-zinc-500 text-center">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
