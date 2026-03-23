export const dynamic = 'force-dynamic';
import pool from "@/lib/db";
import type { Professor } from "@/lib/constants";
import ProfessorList from "./ProfessorList";
import Link from "next/link";

async function getProfessorsWithStats() {
  const result = await pool.query<
    Professor & { avg_quality: string; avg_difficulty: string; review_count: string }
  >(`
    SELECT 
      p.*,
      COALESCE(AVG(r.quality_rating)::numeric(3,1), 0) AS avg_quality,
      COALESCE(AVG(r.difficulty_rating)::numeric(3,1), 0) AS avg_difficulty,
      COUNT(r.id) AS review_count
    FROM professors p
    LEFT JOIN reviews r ON r.professor_id = p.id AND r.is_approved = true
    GROUP BY p.id
    ORDER BY p.name ASC
  `);
  return result.rows;
}

export default async function HomePage() {
  const professors = await getProfessorsWithStats();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-500"
      style={{ 
        backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.8)), url('https://upload.wikimedia.org/wikipedia/commons/a/a2/NITK_Main_Building.jpg')" 
      }}
    >
      <div className="min-h-screen backdrop-blur-[6px]">
        <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter drop-shadow-md">
              Rate Your NITK Professors
            </h1>
            <p className="text-gray-800 text-lg max-w-2xl mx-auto font-bold opacity-90">
              The 100% anonymous platform for NITKians to share real feedback.
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-8 mb-12 shadow-2xl ring-1 ring-black/5">
            <div className="flex items-center gap-3 mb-4 text-blue-900">
              <div className="p-2 bg-blue-100/50 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="font-black uppercase tracking-widest text-xs">Community Guidelines</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <ul className="space-y-3 text-sm text-gray-900 font-bold">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">●</span>
                  <span>Full Names Only: Use official professor names.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">●</span>
                  <span>Constructive: Focus on teaching and grading styles.</span>
                </li>
              </ul>
              <ul className="space-y-3 text-sm text-gray-900 font-bold">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">●</span>
                  <span>Professional: No profanity or personal attacks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">●</span>
                  <span>Anonymity: Your identity is never stored.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-2">
            <ProfessorList professors={professors} />
          </div>
          
          <div className="mt-20 text-center text-gray-900 font-black text-xs tracking-widest uppercase opacity-60">
            <p>© 2026 NITK RateMyProf • Built by an ECE student</p>
          </div>
        </main>
      </div>
    </div>
  );
}
