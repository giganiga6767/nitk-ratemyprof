import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Keep your existing GET function
export async function GET() {
  try {
    const [pendingResult, professorsResult, statsResult] = await Promise.all([
      pool.query(`
        SELECT r.*, p.name AS professor_name, p.department AS professor_department
        FROM reviews r
        JOIN professors p ON p.id = r.professor_id
        WHERE r.is_approved = false
        ORDER BY r.id DESC
      `),
      pool.query("SELECT * FROM professors ORDER BY name ASC"),
      pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM professors) AS total_profs,
          (SELECT COUNT(*) FROM reviews) AS total_reviews,
          (SELECT COUNT(*) FROM reviews WHERE is_approved = true) AS approved_reviews,
          (SELECT COUNT(*) FROM reviews WHERE is_approved = false) AS pending_reviews
      `),
    ]);

    return NextResponse.json({
      pendingReviews: pendingResult.rows,
      professors: professorsResult.rows,
      stats: statsResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}

// --- ADD THIS DELETE FUNCTION BELOW ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Professor ID is required" }, { status: 400 });
    }

    // This deletes the professor from the database
    await pool.query("DELETE FROM professors WHERE id = $1", [id]);

    return NextResponse.json({ message: "Professor deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete professor" }, { status: 500 });
  }
}
