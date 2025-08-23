import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/utils/supabase/server";
import postgres from "postgres";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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
            SELECT id, function_js, created_at 
            FROM problems 
            WHERE id = ${id} AND author_id = ${user.id}
        `;

    await sql.end();

    if (result.length === 0) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const problem = result[0] as {
      id: number;
      function_js: string;
      created_at: string;
    };

    return NextResponse.json({
      id: problem.id,
      functionJs: problem.function_js,
      createdAt: problem.created_at,
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

    const body = await request.json();
    const { functionJs } = body;

    if (!functionJs || typeof functionJs !== "string") {
      return NextResponse.json(
        { error: "functionJs is required and must be a string" },
        { status: 400 },
      );
    }

    const sql = postgres(process.env.DATABASE_URL!);

    const result = await sql`
            UPDATE problems 
            SET function_js = ${functionJs}
            WHERE id = ${id} AND author_id = ${user.id}
            RETURNING id, function_js, created_at
        `;

    await sql.end();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Problem not found or unauthorized" },
        { status: 404 },
      );
    }

    const updatedProblem = result[0] as {
      id: number;
      function_js: string;
      created_at: string;
    };

    return NextResponse.json({
      id: updatedProblem.id,
      functionJs: updatedProblem.function_js,
      createdAt: updatedProblem.created_at,
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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
            DELETE FROM problems 
            WHERE id = ${id} AND author_id = ${user.id}
            RETURNING id
        `;

    await sql.end();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Problem not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
