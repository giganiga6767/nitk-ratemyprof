import pool from "@/lib/db";
import type { Professor } from "@/lib/constants";
import ProfessorList from "./ProfessorList";

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
  return <ProfessorList professors={professors} />;
}
