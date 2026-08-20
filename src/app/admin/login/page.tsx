"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, Eye, EyeOff, ArrowRight, Link2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter your admin password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f5f5f7] via-[#eef2f8] to-[#e0e7f1] relative overflow-hidden">
      {/* Background Lighting Circles */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/25 mb-4 hover:scale-105 transition-transform"
          >
            <Link2 className="w-7 h-7" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Click Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Enter admin password to manage registration campaigns</p>
        </div>

        {/* macOS Style Login Box */}
        <div className="apple-glass-card p-8 rounded-3xl border border-white/80 shadow-xl backdrop-blur-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200/80 text-red-600 text-xs flex items-center space-x-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 pl-1">
                Admin Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="apple-input w-full pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white/90 border-gray-200/80 rounded-2xl focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="apple-btn-primary w-full py-3 text-sm flex items-center justify-center space-x-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Authenticating..." : "Unlock Dashboard"}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400 pt-4 border-t border-gray-200/50">
            Default password: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-mono">admin123</code>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
            ← Back to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
