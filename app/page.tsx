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
    <div className="relative min-h-screen">
      {/* --- 1. THE FOOLPROOF BACKGROUND IMAGE --- */}
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/a/a2/NITK_Main_Building.jpg" 
        alt="NITK Campus" 
        className="fixed inset-0 w-full h-full object-cover z-0"
      />
      
      {/* --- 2. THE GLASS OVERLAY (Only 40% white, not 80%!) --- */}
      <div className="fixed inset-0 bg-white/40 backdrop-blur-md z-10"></div>

      {/* --- 3. THE ACTUAL CONTENT --- */}
      <main className="relative z-20 max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter drop-shadow-xl">
            Rate Your NITK Professors
          </h1>
          <p className="text-gray-900 text-lg max-w-2xl mx-auto font-bold drop-shadow-md">
            The 100% anonymous platform for NITKians to share real feedback.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 mb-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-4 text-blue-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h2 className="font-black uppercase tracking-widest text-xs">Community Guidelines</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <ul className="space-y-3 text-sm text-gray-900 font-bold">
              <li>● Full Names Only: Use official professor names.</li>
              <li>● Constructive: Focus on teaching and grading styles.</li>
            </ul>
            <ul className="space-y-3 text-sm text-gray-900 font-bold">
              <li>● Professional: No profanity or personal attacks.</li>
              <li>● Anonymity: Your identity is never stored.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-2">
          <ProfessorList professors={professors} />
        </div>
        
        <div className="mt-20 text-center text-gray-900 font-black text-xs tracking-widest uppercase drop-shadow-md">
          <p>© 2026 NITK RateMyProf • Built by a student:)</p>
        </div>
      </main>
    </div>
  );
}
