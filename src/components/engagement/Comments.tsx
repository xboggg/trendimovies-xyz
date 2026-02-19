"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ThumbsUp, ThumbsDown, Send, User, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author_name: string;
  comment_text: string;
  likes: number;
  dislikes: number;
  created_at: string;
  replies?: Comment[];
}

interface CommentsProps {
  contentType: "movie" | "tv" | "news";
  contentId: string;
  contentTitle?: string;
}

export function Comments({ contentType, contentId, contentTitle }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reactions, setReactions] = useState<Record<string, "like" | "dislike">>({});
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("commenterName");
    if (savedName) setName(savedName);
    const savedReactions = JSON.parse(localStorage.getItem("commentReactions") || "{}");
    setReactions(savedReactions);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [contentType, contentId]);

  async function fetchComments() {
    try {
      const res = await fetch(`/api/engagement/comments?type=${contentType}&id=${contentId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      // console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) {
      setError("Please fill in both fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/engagement/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          contentId,
          contentTitle,
          authorName: name.trim(),
          commentText: commentText.trim(),
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
        setShowForm(false);
        localStorage.setItem("commenterName", name.trim());
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post comment");
      }
    } catch {
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReaction(commentId: string, type: "like" | "dislike") {
    const existingReaction = reactions[commentId];
    if (existingReaction === type) return;

    try {
      const res = await fetch("/api/engagement/comments/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, type }),
      });

      if (res.ok) {
        const updatedComment = await res.json();
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, ...updatedComment } : c))
        );
        const newReactions = { ...reactions, [commentId]: type };
        setReactions(newReactions);
        localStorage.setItem("commentReactions", JSON.stringify(newReactions));
      }
    } catch (error) {
      // console.error("Failed to react:", error);
    }
  }

  const displayedComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm rounded-2xl border border-zinc-800/50 overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-500/10 rounded-lg">
            <MessageCircle className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-medium text-white text-sm">
            Comments
          </span>
          <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs text-zinc-400">
            {comments.length}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          Add Comment
        </motion.button>
      </div>

      {/* Compact Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="px-4 py-3 bg-zinc-800/30 border-b border-zinc-800/50"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={50}
                  className="w-full px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-500/50 transition-colors"
                />
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={2}
                  maxLength={500}
                  className="w-full px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-3 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    {isSubmitting ? "..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Comments List - Compact */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-2 animate-pulse">
                <div className="w-8 h-8 bg-zinc-800 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
                  <div className="h-8 bg-zinc-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center">
            <MessageCircle className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <>
            {displayedComments.map((comment, idx) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="px-4 py-3 hover:bg-zinc-800/20 transition-colors border-b border-zinc-800/30 last:border-0"
              >
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-white text-sm">
                        {comment.author_name}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
                      {comment.comment_text}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        onClick={() => handleReaction(comment.id, "like")}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          reactions[comment.id] === "like"
                            ? "text-green-400"
                            : "text-zinc-500 hover:text-green-400"
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.likes}</span>
                      </button>
                      <button
                        onClick={() => handleReaction(comment.id, "dislike")}
                        className={`flex items-center gap-1 text-xs transition-colors ${
                          reactions[comment.id] === "dislike"
                            ? "text-red-400"
                            : "text-zinc-500 hover:text-red-400"
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>{comment.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Show More/Less */}
            {comments.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full py-2 flex items-center justify-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    View {comments.length - 3} More Comments
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Hot Discussions - Compact Version
interface HotDiscussionsProps {
  limit?: number;
}

export function HotDiscussions({ limit = 5 }: HotDiscussionsProps) {
  const [discussions, setDiscussions] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHotDiscussions();
  }, []);

  async function fetchHotDiscussions() {
    try {
      const res = await fetch(`/api/engagement/comments/hot?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setDiscussions(data);
      }
    } catch (error) {
      // console.error("Failed to fetch hot discussions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-zinc-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (discussions.length === 0) return null;

  return (
    <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm rounded-2xl border border-zinc-800/50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50">
        <div className="p-1.5 bg-orange-500/10 rounded-lg">
          <Sparkles className="w-4 h-4 text-orange-500" />
        </div>
        <span className="font-medium text-white text-sm">Hot Discussions</span>
      </div>

      <div className="divide-y divide-zinc-800/30">
        {discussions.map((discussion, idx) => (
          <motion.div
            key={discussion.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="px-4 py-3 hover:bg-zinc-800/20 transition-colors"
          >
            <p className="text-zinc-300 text-sm line-clamp-2 mb-1">
              &ldquo;{discussion.comment_text}&rdquo;
            </p>
            <div className="flex items-center justify-between text-[10px] text-zinc-500">
              <span>- {discussion.author_name}</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  <ThumbsUp className="w-2.5 h-2.5" />
                  {discussion.likes}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
