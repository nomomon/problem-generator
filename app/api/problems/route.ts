import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/utils/supabase/server";
import postgres from "postgres";

export async function GET() {
  try {
    // Get the current user from Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = postgres(process.env.DATABASE_URL!);

    const result = await sql`
            SELECT 
                p.id, 
                p.created_at, 
                p.name,
                p.function_js,
                p.difficulty,
                p.assets,
                COALESCE(
                    array_agg(t.name ORDER BY t.name) FILTER (WHERE t.name IS NOT NULL), 
                    ARRAY[]::text[]
                ) as topics
            FROM problems p
            LEFT JOIN problem_topics pt ON p.id = pt.problem_id
            LEFT JOIN topics t ON pt.topic_id = t.id
            WHERE p.author_id = ${user.id}
            GROUP BY p.id, p.created_at, p.name, p.function_js, p.difficulty, p.assets
            ORDER BY p.created_at DESC
        `;

    await sql.end();

    const problems = result.map((row: any) => ({
      id: row.id,
      createdAt: row.created_at,
      name: row.name || `Problem #${row.id}`,
      functionJs: row.function_js,
      difficulty: row.difficulty,
      assets: row.assets || [],
      topics: row.topics || [],
      hasCode: Boolean(row.function_js),
      assetCount: (row.assets || []).length,
    }));

    return NextResponse.json({ problems });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
