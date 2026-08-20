"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Link2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Info,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface RegistrationPublicData {
  title: string;
  subtitle?: string;
  slug: string;
  googleFormUrl: string;
  about?: string;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    social?: string;
  };
  terms?: string;
  isActive: boolean;
}

export default function PublicRegistrationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [data, setData] = useState<RegistrationPublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/public/r/${slug}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.registration) {
          setData(resData.registration);
        } else {
          setError(resData.error || "Registration page not found");
        }
      })
      .catch(() => setError("Failed to load registration details"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleOpenForm = async () => {
    if (!data || !data.isActive || !data.googleFormUrl) return;

    setRedirecting(true);

    // Track click asynchronously
    try {
      fetch(`/api/public/r/${slug}/click`, { method: "POST" });
    } catch {
      // Ignore click tracking failure
    }

    // Direct redirect to Google Form
    setTimeout(() => {
      window.location.href = data.googleFormUrl;
    }, 150);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7]">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-500">Loading Community Registration...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f5f7]">
        <div className="apple-glass-card max-w-md w-full p-8 rounded-3xl text-center border border-white/80 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            The registration page you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/"
            className="apple-btn-primary px-6 py-2.5 text-xs inline-flex items-center space-x-2"
          >
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f7] via-[#eff3f9] to-[#e2e8f1] text-gray-900 pb-20 relative overflow-hidden">
      {/* Background Lighting Graphics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-blue-400/20 to-purple-400/0 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between z-10 relative">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Link2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-tight text-gray-900">My Click</span>
        </Link>

        <div>
          {data.isActive ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/90 text-emerald-700 border border-emerald-300/50 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Registration Open</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/90 text-amber-700 border border-amber-300/50 shadow-sm">
              <XCircle className="w-3.5 h-3.5" />
              <span>Registration Closed</span>
            </span>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6 z-10 relative">
        {/* HERO CARD */}
        <div className="apple-glass-card p-8 sm:p-10 rounded-3xl border border-white/90 shadow-xl backdrop-blur-2xl text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-600 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Registration Form</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {data.title}
          </h1>

          {data.subtitle && (
            <p className="mt-3 text-base sm:text-lg text-gray-600 font-medium max-w-xl mx-auto">
              {data.subtitle}
            </p>
          )}

          {/* Registration Status Banner if Inactive */}
          {!data.isActive && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-800 text-xs sm:text-sm font-medium flex items-center justify-center space-x-2 max-w-md mx-auto">
              <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>This registration is currently closed or inactive.</span>
            </div>
          )}

          {/* Primary CTA Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {data.isActive ? (
              <button
                onClick={handleOpenForm}
                disabled={redirecting}
                className="apple-btn-primary w-full sm:w-auto px-10 py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-3 shadow-xl shadow-blue-500/30 group"
              >
                <span>{redirecting ? "Redirecting to Google Form..." : "Click to Register Now"}</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-gray-400 bg-gray-200/80 rounded-full cursor-not-allowed border border-gray-300/60"
              >
                Registration Closed
              </button>
            )}
          </div>
        </div>

        {/* ABOUT SECTION */}
        {data.about && (
          <div className="apple-glass-card p-6 sm:p-8 rounded-3xl border border-white/80 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-3">
              <Info className="w-4 h-4" />
              <span>About Community</span>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {data.about}
            </p>
          </div>
        )}

        {/* CONTACT SECTION */}
        {data.contact &&
          (data.contact.email ||
            data.contact.phone ||
            data.contact.location ||
            data.contact.website) && (
            <div className="apple-glass-card p-6 sm:p-8 rounded-3xl border border-white/80 shadow-sm">
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-4">
                <Mail className="w-4 h-4" />
                <span>Contact & Support</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.contact.email && (
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-gray-200/70 flex items-center space-x-3 transition-colors text-xs text-gray-800"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="font-semibold truncate">{data.contact.email}</span>
                  </a>
                )}

                {data.contact.phone && (
                  <a
                    href={`tel:${data.contact.phone}`}
                    className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-gray-200/70 flex items-center space-x-3 transition-colors text-xs text-gray-800"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-semibold truncate">{data.contact.phone}</span>
                  </a>
                )}

                {data.contact.location && (
                  <div className="p-3.5 rounded-2xl bg-white/70 border border-gray-200/70 flex items-center space-x-3 text-xs text-gray-800">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-semibold truncate">{data.contact.location}</span>
                  </div>
                )}

                {data.contact.website && (
                  <a
                    href={
                      data.contact.website.startsWith("http")
                        ? data.contact.website
                        : `https://${data.contact.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-gray-200/70 flex items-center space-x-3 transition-colors text-xs text-gray-800"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="font-semibold truncate">{data.contact.website}</span>
                  </a>
                )}
              </div>
            </div>
          )}

        {/* TERMS & CONDITIONS (T&C) SECTION */}
        {data.terms && (
          <div className="apple-glass-card p-6 sm:p-8 rounded-3xl border border-white/80 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-3">
              <FileText className="w-4 h-4" />
              <span>Terms & Conditions</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {data.terms}
            </p>
          </div>
        )}

        {/* Bottom CTA for Active Registrations */}
        {data.isActive && (
          <div className="pt-4 text-center">
            <button
              onClick={handleOpenForm}
              className="apple-btn-primary px-8 py-3.5 text-sm font-semibold inline-flex items-center space-x-2 shadow-lg shadow-blue-500/20"
            >
              <span>Fill Form on Google Forms</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 mt-12 text-center text-xs text-gray-400">
        <p>Powered by My Click Community Manager</p>
      </footer>
    </div>
  );
}
