"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Link2, Sparkles, CheckCircle2, XCircle } from "lucide-react";

interface RegistrationItem {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  isActive: boolean;
  clickCount: number;
}

export default function HomePage() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch registrations if user is logged in as admin, or show friendly welcome screen
    fetch("/api/registrations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.registrations) {
          setRegistrations(data.registrations);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#f5f5f7] via-[#eef2f7] to-[#e4e9f0]">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-xl">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight text-gray-900">My Click</h1>
            <p className="text-xs text-gray-500">Community Registration Portal</p>
          </div>
        </div>

        <Link
          href="/admin/login"
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/70 hover:bg-white border border-gray-200/80 rounded-full shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-[1.02]"
        >
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Admin Portal</span>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12 z-10 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-600 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Community Member Registration Platform</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15] max-w-3xl mx-auto">
          Effortless Member Registrations for Your Community
        </h2>

        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Create, manage, and share active registration forms integrated with Google Forms. Beautiful Apple-inspired design for your community members.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/admin/dashboard"
            className="apple-btn-primary px-8 py-3.5 text-base flex items-center space-x-2 shadow-lg shadow-blue-500/25"
          >
            <span>Go to Admin Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Existing Registrations Preview Card if available */}
        {!loading && registrations.length > 0 && (
          <div className="mt-16 text-left max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 px-1">
              Active Community Campaigns
            </h3>
            <div className="space-y-3">
              {registrations.map((reg) => (
                <Link
                  key={reg._id}
                  href={`/r/${reg.slug}`}
                  target="_blank"
                  className="apple-glass-card apple-glass-card-hover p-5 rounded-2xl flex items-center justify-between group block border border-white/60"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {reg.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {reg.title}
                      </h4>
                      {reg.subtitle && (
                        <p className="text-xs text-gray-500">{reg.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {reg.isActive ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200/50">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Closed</span>
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full z-10 pt-8 border-t border-gray-200/50 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© {new Date().getFullYear()} My Click. Designed for Community Management.</p>
        <div className="flex items-center space-x-4">
          <Link href="/admin/login" className="hover:text-gray-900 transition-colors">
            Admin Login
          </Link>
        </div>
      </footer>
    </div>
  );
}
