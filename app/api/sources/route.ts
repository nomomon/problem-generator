import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/utils/supabase/server";
import postgres from "postgres";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sql = postgres(process.env.DATABASE_URL!);
    const result = await sql`SELECT id, name FROM sources ORDER BY name`;
    await sql.end();

    return NextResponse.json({ sources: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const name = body?.name;
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const sql = postgres(process.env.DATABASE_URL!);
    // avoid duplicates
    const existing =
      await sql`SELECT id, name FROM sources WHERE name = ${name}`;
    if (existing.length > 0) {
      await sql.end();
      return NextResponse.json({ source: existing[0] });
    }

    const ins =
      await sql`INSERT INTO sources (name) VALUES (${name}) RETURNING id, name`;
    await sql.end();

    return NextResponse.json({ source: ins[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
