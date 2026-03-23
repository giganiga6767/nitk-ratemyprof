"use client";

import { useState } from "react";
import Link from "next/link";
import type { Professor } from "@/lib/constants";

type ProfWithStats = Professor & {
  avg_quality: string;
  avg_difficulty: string;
  review_count: string;
};

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(value) ? "text-gray-800" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProfessorList({ professors }: { professors: ProfWithStats[] }) {
  const [search, setSearch] = useState("");

  const filtered = professors.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#333_0%,_transparent_60%)] opacity-40" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.666 1.94.831A1 1 0 0011 10v5a1 1 0 01-1.832.534l-2-3.5A1 1 0 017 12v-2.374L2.606 7.643A2 2 0 010 5.77V5a1 1 0 011-1l8-3.5z" />
            </svg>
            NIT Karnataka, Surathkal
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-5 tracking-tight leading-tight">
            Rate Your <span className="text-gray-300">Professors</span>
          </h1>
          <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
            100% anonymous. Help your fellow NITKians make informed choices about courses and professors.
          </p>
          <Link
            href="/professors/add"
            className="inline-flex items-center gap-2 bg-white text-black font-bold text-base px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Can&apos;t find a professor? Add them here
          </Link>
        </div>
      </section>

      {/* Search + List */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Search bar */}
        <div className="mb-7">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or department…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            {search ? `Results for "${search}"` : "All Professors"}{" "}
            <span className="text-gray-400 font-normal text-base">({filtered.length})</span>
          </h2>
        </div>

        {professors.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">No professors yet</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
              Be the first to add a professor and kick off the ratings!
            </p>
            <Link
              href="/professors/add"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add the first professor
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">No professors match &ldquo;{search}&rdquo;</p>
            <p className="text-gray-400 text-sm mt-1">Try a different name or department</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((prof) => {
                const quality = parseFloat(prof.avg_quality);
                const difficulty = parseFloat(prof.avg_difficulty);
                const count = parseInt(prof.review_count);
                return (
                  <Link
                    key={prof.id}
                    href={`/professors/${prof.id}`}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-gray-400 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center text-white text-lg font-black flex-shrink-0 shadow-sm">
                        {prof.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                        {prof.department}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-gray-600 transition-colors duration-200 mb-1">
                      {prof.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">
                      {count === 0 ? "No reviews yet" : `${count} ${count === 1 ? "review" : "reviews"}`}
                    </p>
                    {count > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Quality</span>
                          <div className="flex items-center gap-1.5">
                            <StarDisplay value={quality} />
                            <span className="text-xs font-bold text-gray-900">{quality.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="w-px bg-gray-100 mx-1" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Difficulty</span>
                          <div className="flex items-center gap-1.5">
                            <StarDisplay value={difficulty} />
                            <span className="text-xs font-bold text-gray-900">{difficulty.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-4 bg-black text-white rounded-xl px-7 py-4 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.666 1.94.831A1 1 0 0011 10v5a1 1 0 01-1.832.534l-2-3.5A1 1 0 017 12v-2.374L2.606 7.643A2 2 0 010 5.77V5a1 1 0 011-1l8-3.5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Missing a professor?</p>
                  <Link href="/professors/add" className="text-gray-400 hover:text-white transition-colors text-xs">
                    Add them to the database →
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
