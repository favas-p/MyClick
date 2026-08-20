"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Link2,
  Plus,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  Lock,
  LogOut,
  CheckCircle2,
  XCircle,
  BarChart3,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Check,
  Search,
  Sparkles,
  AlertCircle,
  X,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

interface RegistrationItem {
  _id: string;
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
  clickCount: number;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RegistrationItem | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toast / Alert state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form state for Create / Edit
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    customSlug: "",
    googleFormUrl: "",
    about: "",
    contactEmail: "",
    contactPhone: "",
    contactLocation: "",
    contactWebsite: "",
    terms: "",
    isActive: true,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Password Change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Check Auth & Fetch Data
  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/registrations");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
      }
    } catch {
      showToast("Failed to fetch registration data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      customSlug: "",
      googleFormUrl: "",
      about: "",
      contactEmail: "",
      contactPhone: "",
      contactLocation: "",
      contactWebsite: "",
      terms: "",
      isActive: true,
    });
    setFormError("");
    setEditingItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditModal = (item: RegistrationItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle || "",
      customSlug: item.slug,
      googleFormUrl: item.googleFormUrl,
      about: item.about || "",
      contactEmail: item.contact?.email || "",
      contactPhone: item.contact?.phone || "",
      contactLocation: item.contact?.location || "",
      contactWebsite: item.contact?.website || "",
      terms: item.terms || "",
      isActive: item.isActive,
    });
    setFormError("");
    setIsCreateOpen(true);
  };

  const handleSaveRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.googleFormUrl) {
      setFormError("Community Name and Google Form Link are required");
      return;
    }

    setFormSubmitting(true);
    setFormError("");

    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        customSlug: formData.customSlug,
        googleFormUrl: formData.googleFormUrl,
        about: formData.about,
        contact: {
          email: formData.contactEmail,
          phone: formData.contactPhone,
          location: formData.contactLocation,
          website: formData.contactWebsite,
        },
        terms: formData.terms,
        isActive: formData.isActive,
      };

      const url = editingItem ? `/api/registrations/${editingItem._id}` : "/api/registrations";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save registration");
      }

      showToast(editingItem ? "Registration updated successfully!" : "New registration form created!");
      setIsCreateOpen(false);
      resetForm();
      fetchRegistrations();
    } catch (err: any) {
      setFormError(err.message || "Error saving registration");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleActive = async (item: RegistrationItem) => {
    try {
      const res = await fetch(`/api/registrations/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setRegistrations((prev) =>
        prev.map((r) => (r._id === item._id ? { ...r, isActive: !item.isActive } : r))
      );
      showToast(`Registration "${item.title}" status set to ${!item.isActive ? "Active" : "Closed"}`);
    } catch {
      showToast("Error updating status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setRegistrations((prev) => prev.filter((r) => r._id !== id));
      setDeletingId(null);
      showToast("Registration deleted successfully");
    } catch {
      showToast("Error deleting registration", "error");
    }
  };

  const handleCopyLink = (slug: string, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/r/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    showToast("Shareable link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordSubmitting(true);
    setPasswordError("");

    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      showToast("Admin password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPasswordError(err.message || "Error changing password");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const filteredRegistrations = registrations.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = registrations.filter((r) => r.isActive).length;
  const totalClicks = registrations.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7]">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-500">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f7] via-[#eff3f8] to-[#e4e9f2] text-gray-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center space-x-2.5 backdrop-blur-xl ${
              toastMessage.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-700"
                : "bg-red-50/95 border-red-200 text-red-700"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-sm font-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top macOS Navbar */}
      <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-gray-200/70 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-gray-900 flex items-center space-x-2">
              <span>My Click Control Center</span>
            </h1>
            <p className="text-xs text-gray-500">Community Registration Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center space-x-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-gray-500" />
            <span className="hidden sm:inline">Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors flex items-center space-x-1.5 border border-red-200/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        {/* Header Title & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Registration Forms
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create registration sessions, link Google Forms, and share customized landing pages.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="apple-btn-primary px-5 py-2.5 text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Registration</span>
          </button>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="apple-glass-card p-5 rounded-2xl border border-white/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Forms</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{registrations.length}</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="apple-glass-card p-5 rounded-2xl border border-white/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Forms</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">{activeCount}</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="apple-glass-card p-5 rounded-2xl border border-white/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Form Redirect Clicks</p>
              <h3 className="text-3xl font-bold text-indigo-600 mt-1">{totalClicks}</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by community name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="apple-input w-full pl-10 pr-4 py-2.5 text-xs text-gray-900 bg-white/80 border-gray-200/80 rounded-2xl focus:bg-white"
            />
          </div>
        </div>

        {/* Registration Forms Grid / Cards */}
        {filteredRegistrations.length === 0 ? (
          <div className="apple-glass-card p-12 text-center rounded-3xl border border-white/80">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Registrations Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-6">
              {searchQuery
                ? "No registration forms match your search query."
                : "You haven't created any community registration forms yet."}
            </p>
            {!searchQuery && (
              <button
                onClick={openCreateModal}
                className="apple-btn-primary px-5 py-2.5 text-xs inline-flex items-center space-x-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Form</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRegistrations.map((item) => {
              const publicUrl = `/r/${item.slug}`;
              return (
                <div
                  key={item._id}
                  className="apple-glass-card apple-glass-card-hover p-6 rounded-3xl border border-white/80 shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Info Left */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight">{item.title}</h3>
                      {item.isActive ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-700 border border-emerald-300/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-700 border border-amber-300/40">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Closed / Inactive</span>
                        </span>
                      )}
                    </div>

                    {item.subtitle && <p className="text-xs text-gray-600 font-medium">{item.subtitle}</p>}

                    {/* Google Form Link indicator */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                      <span className="flex items-center space-x-1 text-blue-600 truncate max-w-xs">
                        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{item.googleFormUrl}</span>
                      </span>

                      <span className="flex items-center space-x-1 text-gray-500 font-medium">
                        <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{item.clickCount || 0} Redirect Clicks</span>
                      </span>
                    </div>

                    {/* Webpage Public Link display */}
                    <div className="mt-3 flex items-center space-x-2 bg-gray-100/80 p-2 rounded-xl text-xs font-mono border border-gray-200/60 max-w-md">
                      <Link2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate text-gray-700 font-semibold">{publicUrl}</span>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-200/50">
                    {/* Shareable Copy Button */}
                    <button
                      onClick={() => handleCopyLink(item.slug, item._id)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-xl flex items-center space-x-1.5 transition-all shadow-sm ${
                        copiedId === item._id
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200/60"
                      }`}
                    >
                      {copiedId === item._id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Share Link</span>
                        </>
                      )}
                    </button>

                    {/* Open Page */}
                    <Link
                      href={publicUrl}
                      target="_blank"
                      className="px-3 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl flex items-center space-x-1 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Link>

                    {/* Toggle Status */}
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center space-x-1 ${
                        item.isActive
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      <span>{item.isActive ? "Deactivate" : "Activate"}</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit Registration"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeletingId(item._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Registration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CREATE / EDIT REGISTRATION MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="apple-glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/90 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200/60">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? "Edit Registration Form" : "Create Registration Form"}
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRegistration} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Community Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tech Innovators Club"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="apple-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Membership 2026"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="apple-input w-full text-xs"
                  />
                </div>
              </div>

              {/* Google Form Link & Custom Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Google Form Link *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://docs.google.com/forms/d/e/..."
                    value={formData.googleFormUrl}
                    onChange={(e) => setFormData({ ...formData, googleFormUrl: e.target.value })}
                    className="apple-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Custom Page Link Slug
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. tech-club-2026 (auto-generated if empty)"
                    value={formData.customSlug}
                    onChange={(e) => setFormData({ ...formData, customSlug: e.target.value })}
                    className="apple-input w-full text-xs"
                  />
                </div>
              </div>

              {/* About Section */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  About Community
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your community, mission, member benefits..."
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="apple-input w-full text-xs resize-none"
                />
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60 space-y-3">
                <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                  Contact Details (Displayed on Page)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      placeholder="Contact Email (e.g. contact@community.org)"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="apple-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Contact Phone (e.g. +1 234 567 890)"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="apple-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Location / Address"
                      value={formData.contactLocation}
                      onChange={(e) => setFormData({ ...formData, contactLocation: e.target.value })}
                      className="apple-input w-full text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Website or Social Link"
                      value={formData.contactWebsite}
                      onChange={(e) => setFormData({ ...formData, contactWebsite: e.target.value })}
                      className="apple-input w-full text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Terms & Conditions (T&C)
                </label>
                <textarea
                  rows={3}
                  placeholder="State membership rules, privacy notes, eligibility guidelines..."
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  className="apple-input w-full text-xs resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
                <span className="font-semibold text-gray-800 text-xs">
                  Registration Status: {formData.isActive ? "Active (Open for Registrations)" : "Inactive (Registration Closed Banner)"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="apple-btn-primary px-6 py-2.5 text-xs font-semibold shadow-md disabled:opacity-60"
                >
                  {formSubmitting ? "Saving..." : editingItem ? "Update Form" : "Create Form"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE ADMIN PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="apple-glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 border border-white/90 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/60">
              <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                <span>Change Admin Password</span>
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Current Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="apple-input w-full text-xs pr-10"
                    placeholder="Enter current admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="apple-input w-full text-xs pr-10"
                    placeholder="Enter new admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="apple-input w-full text-xs"
                  placeholder="Re-enter new admin password"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200/60">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="apple-btn-primary px-5 py-2 text-xs font-semibold shadow-md disabled:opacity-60"
                >
                  {passwordSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="apple-glass-card max-w-sm w-full rounded-3xl p-6 border border-white/90 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Registration?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              This action cannot be undone. Users will no longer be able to view or access this registration link.
            </p>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-md shadow-red-500/20"
              >
                Delete Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
