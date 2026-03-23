"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_PIN = "nitk123";
const STORAGE_KEY = "nitk_admin_session";

interface ReviewWithProf {
  id: string;
  professor_id: string;
  professor_name: string;
  professor_department: string;
  quality_rating: number;
  difficulty_rating: number;
  course_code: string;
  comment: string;
  is_approved: boolean;
}

interface Professor {
  id: string;
  name: string;
  department: string;
}

interface AdminData {
  pendingReviews: ReviewWithProf[];
  professors: Professor[];
  stats: {
    total_profs: string;
    total_reviews: string;
    approved_reviews: string;
    pending_reviews: string;
  };
}

function PinGate({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      localStorage.setItem(STORAGE_KEY, "true");
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 400);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .shake { animation: shake 0.4s ease-in-out; }
      `}</style>

      <div className={`bg-white rounded-2xl border border-gray-200 shadow-lg p-10 w-full max-w-sm ${shake ? "shake" : ""}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-black flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-400 text-sm mt-1">Enter your PIN to continue</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg px-3 py-2.5 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Incorrect PIN. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              placeholder="Enter admin PIN"
              autoFocus
              autoComplete="new-password"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-200 text-center tracking-widest font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            Unlock Dashboard
          </button>
        </form>

        <Link href="/" className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-5 transition-colors">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleApprove(reviewId: string) {
    await fetch(`/api/reviews/${reviewId}/approve`, { method: "PATCH" });
    fetchData();
  }

  async function handleReject(reviewId: string) {
    await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    fetchData();
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    router.refresh();
    window.location.reload();
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-400 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const pendingReviews = data?.pendingReviews ?? [];
  const professors = data?.professors ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Admin
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <p className="text-gray-400 text-sm">Moderate submitted reviews for NITK professors</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-gray-900 flex items-center gap-1.5 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Professors", value: stats.total_profs },
            { label: "Total Reviews", value: stats.total_reviews },
            { label: "Approved", value: stats.approved_reviews },
            { label: "Pending", value: stats.pending_reviews, highlight: parseInt(stats.pending_reviews) > 0 },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border p-4 text-center shadow-sm ${
                s.highlight ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <p className={`text-2xl font-extrabold ${s.highlight ? "text-white" : "text-gray-900"}`}>
                {s.value}
              </p>
              <p className={`text-xs mt-0.5 ${s.highlight ? "text-gray-400" : "text-gray-500"}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Professors */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          All Professors ({professors.length})
        </h2>
        {professors.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center">
            <p className="text-gray-400 text-sm">No professors in the database yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
            {professors.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.department}</p>
                </div>
                <a
                  href={`/professors/${p.id}`}
                  target="_blank"
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 flex items-center gap-1"
                >
                  View
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Reviews */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Pending Reviews ({pendingReviews.length})
        </h2>

        {pendingReviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 shadow-sm p-10 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-bold text-gray-900 mb-1">All caught up!</p>
            <p className="text-gray-400 text-sm">No pending reviews at this time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.professor_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {review.professor_department} ·{" "}
                      <span className="font-mono font-semibold text-gray-700">{review.course_code}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-md border border-gray-200">
                      Q {review.quality_rating}/5
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-md border border-gray-200">
                      D {review.difficulty_rating}/5
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-4">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-black text-white text-sm font-semibold py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white text-gray-700 text-sm font-semibold py-2 rounded-lg border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 hover:scale-[1.02] shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setAuthenticated(stored === "true");
  }, []);

  if (authenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="w-6 h-6 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!authenticated) {
    return <PinGate onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard />;
}
