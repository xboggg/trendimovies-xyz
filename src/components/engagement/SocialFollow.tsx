"use client";

import { motion } from "framer-motion";

const socials = [
  {
    name: "Twitter",
    url: "https://twitter.com/trendimovies",
    followers: "12.5K",
    gradient: "from-zinc-800 to-zinc-900",
  },
  {
    name: "Facebook",
    url: "https://facebook.com/trendimovies",
    followers: "28K",
    gradient: "from-blue-600 to-blue-700",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/trendimovies",
    followers: "45K",
    gradient: "from-pink-500 via-purple-500 to-orange-400",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@trendimovies",
    followers: "67K",
    gradient: "from-zinc-900 to-zinc-800",
  },
  {
    name: "Telegram",
    url: "https://t.me/trendimoviex",
    followers: "35K",
    gradient: "from-sky-500 to-sky-600",
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@trendimovies",
    followers: "89K",
    gradient: "from-red-600 to-red-700",
  },
];

export function SocialFollow() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-800/40 border border-zinc-700/50 backdrop-blur-sm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Join Our Community</h3>
        <p className="text-zinc-400 text-sm">Follow us for trailers, news & memes</p>
      </div>
      <div className="flex justify-center mb-5">
        <div className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full">
          <span className="text-amber-400 font-bold text-sm">275K+ Followers</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {socials.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`group flex flex-col items-center p-3 rounded-xl bg-gradient-to-br ${social.gradient} transition-all duration-300 shadow-lg hover:shadow-xl`}
          >
            <span className="text-white font-semibold text-xs">{social.followers}</span>
            <span className="text-white/60 text-[10px] truncate w-full text-center">{social.name}</span>
          </motion.a>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
        <span className="text-zinc-500 text-xs">Updated daily</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
      </div>
    </div>
  );
}
