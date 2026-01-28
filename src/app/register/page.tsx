"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span className="text-red-600">Trendi</span>
              <span className="text-white">Movies</span>
            </h1>
          </Link>
          <p className="text-zinc-400 mt-2">Create your account</p>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-600/20 border border-red-600/50">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-600/20 border border-green-600/50">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400 text-sm">
                  Account created! Redirecting to login...
                </p>
              </div>
            )}

            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-red-500 hover:text-red-400 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
