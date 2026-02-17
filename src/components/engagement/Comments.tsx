"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ThumbsUp, ThumbsDown, Send, User, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  // Load saved name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("commenterName");
    if (savedName) setName(savedName);

    // Load reactions
    const savedReactions = JSON.parse(localStorage.getItem("commentReactions") || "{}");
    setReactions(savedReactions);
  }, []);

  // Fetch comments
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
      console.error("Failed to fetch comments:", error);
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
        // Save name for future comments
        localStorage.setItem("commenterName", name.trim());
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post comment");
      }
    } catch (error) {
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReaction(commentId: string, type: "like" | "dislike") {
    const existingReaction = reactions[commentId];

    // If same reaction, remove it
    if (existingReaction === type) {
      return;
    }

    try {
      const res = await fetch("/api/engagement/comments/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, type }),
      });

      if (res.ok) {
        const updatedComment = await res.json();

        // Update comments list
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, ...updatedComment } : c))
        );

        // Save reaction
        const newReactions = { ...reactions, [commentId]: type };
        setReactions(newReactions);
        localStorage.setItem("commentReactions", JSON.stringify(newReactions));
      }
    } catch (error) {
      console.error("Failed to react:", error);
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-red-500" />
          <span className="font-semibold text-white">
            Comments ({comments.length})
          </span>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          Add Comment
        </Button>
      </div>

      {/* Comment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="p-4 bg-zinc-800/50 border-b border-zinc-800"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Your Comment</label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  maxLength={1000}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-zinc-500">
                    {commentText.length}/1000 characters
                  </span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="divide-y divide-zinc-800">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-800 rounded w-1/4 mb-2"></div>
                    <div className="h-16 bg-zinc-800 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">
                      {comment.author_name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.comment_text}
                  </p>

                  {/* Reactions */}
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => handleReaction(comment.id, "like")}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        reactions[comment.id] === "like"
                          ? "text-green-500"
                          : "text-zinc-500 hover:text-green-400"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => handleReaction(comment.id, "dislike")}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        reactions[comment.id] === "dislike"
                          ? "text-red-500"
                          : "text-zinc-500 hover:text-red-400"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{comment.dislikes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Hot Discussions component for homepage
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
      console.error("Failed to fetch hot discussions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-zinc-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (discussions.length === 0) {
    return null;
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
        <MessageCircle className="w-5 h-5 text-red-500" />
        <span className="font-semibold text-white">Hot Discussions</span>
      </div>

      <div className="divide-y divide-zinc-800">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
            <p className="text-zinc-300 text-sm line-clamp-2 mb-2">
              &ldquo;{discussion.comment_text}&rdquo;
            </p>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>- {discussion.author_name}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {discussion.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {(discussion.replies?.length || 0)} replies
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
