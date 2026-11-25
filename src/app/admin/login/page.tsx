"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiUser, FiAlertCircle } from "react-icons/fi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin/blogs");
        router.refresh();
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C120C] text-[#F3EDE4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2A1810] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-black.svg"
            alt="Nivoseas Logo"
            className="h-8 mx-auto brightness-0 invert mb-3"
          />
          <h1 className="font-display text-2xl text-white">Admin Authentication</h1>
          <p className="text-xs text-[#F3EDE4]/60">
            Sign in to manage blog posts and website content
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
            <FiAlertCircle className="shrink-0 text-sm" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#F3EDE4]/80 mb-1">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F3EDE4]/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#1C120C] border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8782A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F3EDE4]/80 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F3EDE4]/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1C120C] border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8782A]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-3d btn-3d-amber w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Admin"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[11px] text-[#F3EDE4]/40">
            Nivoseas Lighting LLP &bull; Secure Atelier Console
          </p>
        </div>
      </div>
    </div>
  );
}
