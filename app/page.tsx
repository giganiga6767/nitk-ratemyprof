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
    <main className="max-w-5xl mx-auto px-4 py-12">
      {/* --- HERO SECTION --- */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Rate Your NITK Professors
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          A 100% anonymous platform for NITKians to share honest, constructive feedback about courses and teaching styles.
        </p>
      </div>

      {/* --- GUIDELINES CARD --- */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-12 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-blue-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <h2 className="font-bold uppercase tracking-wider text-sm">Community Guidelines</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="space-y-2 text-sm text-blue-700 list-disc ml-5">
            <li><strong>Full Names Only:</strong> When adding a professor, use their official full name (e.g., Dr. Ramesh Kumar).</li>
            <li><strong>Constructive Criticism:</strong> Focus on teaching quality, grading patterns, and course difficulty.</li>
          </ul>
          <ul className="space-y-2 text-sm text-blue-700 list-disc ml-5">
            <li><strong>Professionalism:</strong> No profanity, personal attacks, or defamation. Bad words = Instant rejection.</li>
            <li><strong>Anonymity:</strong> Your identity is never recorded. Review safely.</li>
          </ul>
        </div>
      </div>

      {/* --- PROFESSOR LIST & SEARCH --- */}
      <ProfessorList professors={professors} />
      
      <div className="mt-16 text-center text-gray-400 text-sm">
        <p>© 2026 NITK RateMyProf. Built for NITKians by an ECE student.</p>
      </div>
    </main>
  );
}
