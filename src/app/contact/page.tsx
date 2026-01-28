"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Message Sent!</h1>
            <p className="text-zinc-400 mb-6">
              Thank you for reaching out. We'll get back to you as soon as possible.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-zinc-400">
            We'd love to hear from you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
              <p className="text-zinc-400 text-sm mb-2">
                For general inquiries and support
              </p>
              <a
                href="mailto:contact@trendimovies.xyz"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                contact@trendimovies.xyz
              </a>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Feedback</h3>
              <p className="text-zinc-400 text-sm">
                We appreciate your feedback! Help us improve TrendiMovies by sharing your thoughts and suggestions.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-zinc-400 mb-2">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="How can we help?"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">Message *</label>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
