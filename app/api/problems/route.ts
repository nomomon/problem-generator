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
            SELECT id, created_at 
            FROM problems 
            WHERE author_id = ${user.id}
            ORDER BY created_at DESC
        `;

    await sql.end();

    const problems = result.map((row: any) => ({
      id: row.id,
      createdAt: row.created_at,
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
