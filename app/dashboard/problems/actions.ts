"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateProblemTopics } from "@/lib/utils/topic-helpers";
import postgres from "postgres";

export type ProblemData = {
  name?: string;
  assets?: string[];
  difficulty?: "easy" | "medium" | "hard" | null;
  topics?: string[];
  // Source fields
  sourceId?: number;
  sourceName?: string; // create new source if provided
  sourceEditionYear?: number | null;
  sourceEditionExtra?: string | null;
};

export async function createProblem(
  functionJs: string,
  problemData?: ProblemData,
) {
  // Get the current user from Supabase
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Create postgres client
  const sql = postgres(process.env.DATABASE_URL!);

  let newProblemId: number;

  try {
    // Insert the problem with new fields
    const result = await sql`
      INSERT INTO problems (function_js, author_id, name, assets, difficulty) 
      VALUES (
        ${functionJs}, 
        ${user.id}, 
        ${problemData?.name || null},
        ${problemData?.assets || null},
        ${problemData?.difficulty || null}
      ) 
      RETURNING id
    `;

    const newProblem = result[0] as { id: number };

    if (!newProblem || !newProblem.id) {
      throw new Error("Failed to create problem");
    }

    newProblemId = newProblem.id;

    // Handle topic associations
    if (problemData?.topics && problemData.topics.length > 0) {
      await updateProblemTopics(sql, newProblemId, problemData.topics);
    }
    // Handle source and edition if provided
    if (problemData?.sourceName || problemData?.sourceId) {
      // If sourceName provided, insert or get existing
      let sourceId = problemData.sourceId;
      if (!sourceId && problemData.sourceName) {
        const existing = await sql`
          SELECT id FROM sources WHERE name = ${problemData.sourceName}
        `;
        if (existing.length > 0) {
          sourceId = existing[0].id as number;
        } else {
          const ins = await sql`
            INSERT INTO sources (name) VALUES (${problemData.sourceName}) RETURNING id
          `;
          sourceId = ins[0].id as number;
        }
      }

      let editionId: number | null = null;
      if (sourceId && problemData.sourceEditionYear) {
        // try find existing edition
        const exEd = await sql`
          SELECT id FROM source_editions WHERE source_id = ${sourceId} AND year = ${problemData.sourceEditionYear} AND extra_info = ${problemData.sourceEditionExtra ?? null}
        `;
        if (exEd.length > 0) {
          editionId = exEd[0].id as number;
        } else {
          const insEd = await sql`
            INSERT INTO source_editions (source_id, year, extra_info) VALUES (${sourceId}, ${problemData.sourceEditionYear}, ${problemData.sourceEditionExtra ?? null}) RETURNING id
          `;
          editionId = insEd[0].id as number;
        }
      }

      // update problem with source ids
      await sql`
        UPDATE problems SET source_id = ${sourceId || null}, source_edition_id = ${editionId || null} WHERE id = ${newProblemId}
      `;
    }
  } catch (error) {
    console.error("Error creating problem:", error);
    throw new Error("Failed to create problem");
  } finally {
    await sql.end(); // Close the connection in finally block
  }

  // Revalidate the dashboard page to show the new problem
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/problems");

  // Redirect to the new problem page (outside try-catch to avoid catching NEXT_REDIRECT)
  redirect(`/dashboard/problems/${newProblemId}`);
}

export async function updateProblem(
  problemId: string,
  functionJs: string,
  problemData?: ProblemData,
) {
  // Get the current user from Supabase
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Create postgres client
  const sql = postgres(process.env.DATABASE_URL!);

  try {
    // Update the problem - only allow updating if the user is the author
    const result = await sql`
      UPDATE problems 
      SET 
        function_js = ${functionJs},
        name = ${problemData?.name || null},
        assets = ${problemData?.assets || null},
        difficulty = ${problemData?.difficulty || null}
  -- source fields updated below
      WHERE id = ${problemId} AND author_id = ${user.id}
      RETURNING id
    `;

    if (result.length === 0) {
      throw new Error("Problem not found or unauthorized");
    }

    // Handle topic associations
    if (problemData?.topics !== undefined) {
      await updateProblemTopics(sql, parseInt(problemId), problemData.topics);
    }

    // Handle source updates
    if (
      problemData?.sourceName ||
      problemData?.sourceId ||
      problemData?.sourceEditionYear !== undefined
    ) {
      let sourceId = problemData.sourceId;
      if (!sourceId && problemData.sourceName) {
        const existing = await sql`
          SELECT id FROM sources WHERE name = ${problemData.sourceName}
        `;
        if (existing.length > 0) {
          sourceId = existing[0].id as number;
        } else {
          const ins = await sql`
            INSERT INTO sources (name) VALUES (${problemData.sourceName}) RETURNING id
          `;
          sourceId = ins[0].id as number;
        }
      }

      let editionId: number | null = null;
      if (sourceId && problemData.sourceEditionYear) {
        const exEd = await sql`
          SELECT id FROM source_editions WHERE source_id = ${sourceId} AND year = ${problemData.sourceEditionYear} AND extra_info = ${problemData.sourceEditionExtra ?? null}
        `;
        if (exEd.length > 0) {
          editionId = exEd[0].id as number;
        } else {
          const insEd = await sql`
            INSERT INTO source_editions (source_id, year, extra_info) VALUES (${sourceId}, ${problemData.sourceEditionYear}, ${problemData.sourceEditionExtra ?? null}) RETURNING id
          `;
          editionId = insEd[0].id as number;
        }
      }

      await sql`
        UPDATE problems SET source_id = ${sourceId || null}, source_edition_id = ${editionId || null} WHERE id = ${problemId} AND author_id = ${user.id}
      `;
    }

    // Revalidate the current problem page
    revalidatePath(`/dashboard/problems/${problemId}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/problems");

    return { success: true };
  } catch (error) {
    console.error("Error updating problem:", error);
    throw new Error("Failed to update problem");
  } finally {
    await sql.end(); // Close the connection in finally block
  }
}

export async function deleteProblem(problemId: string) {
  // Get the current user from Supabase
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Create postgres client
  const sql = postgres(process.env.DATABASE_URL!);

  try {
    // Delete the problem - only allow deleting if the user is the author
    const result = await sql`
      DELETE FROM problems 
      WHERE id = ${problemId} AND author_id = ${user.id}
      RETURNING id
    `;

    if (result.length === 0) {
      throw new Error("Problem not found or unauthorized");
    }

    // Revalidate the dashboard pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/problems");

    return { success: true };
  } catch (error) {
    console.error("Error deleting problem:", error);
    throw new Error("Failed to delete problem");
  } finally {
    await sql.end(); // Close the connection in finally block
  }
}

export async function getProblemDetails(problemId: string) {
  // Get the current user from Supabase
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Create postgres client
  const sql = postgres(process.env.DATABASE_URL!);

  try {
    // Get the problem details including source and edition info
    const problemResult = await sql`
      SELECT 
        p.id, 
        p.function_js, 
        p.name, 
        p.assets, 
        p.difficulty,
        p.created_at as "createdAt",
        p.author_id as "authorId",
        s.id as source_id,
        s.name as source_name,
        se.id as source_edition_id,
        se.year as source_edition_year,
        se.extra_info as source_edition_extra
      FROM problems p
      LEFT JOIN sources s ON p.source_id = s.id
      LEFT JOIN source_editions se ON p.source_edition_id = se.id
      WHERE p.id = ${problemId} AND p.author_id = ${user.id}
    `;

    if (problemResult.length === 0) {
      throw new Error("Problem not found or unauthorized");
    }

    const problem = problemResult[0] as {
      id: number;
      function_js: string | null;
      name: string | null;
      assets: string[] | null;
      difficulty: "easy" | "medium" | "hard" | null;
      createdAt: string;
      authorId: string;
      source_id?: number | null;
      source_name?: string | null;
      source_edition_id?: number | null;
      source_edition_year?: number | null;
      source_edition_extra?: string | null;
    };

    // Get associated topics
    const topicsResult = await sql`
      SELECT t.name
      FROM topics t
      INNER JOIN problem_topics pt ON t.id = pt.topic_id
      WHERE pt.problem_id = ${problemId}
      ORDER BY t.name
    `;

    const topics = topicsResult.map((t) => t.name);

    return {
      ...problem,
      topics: topics.length > 0 ? topics : undefined,
      sourceId: problem.source_id || undefined,
      sourceName: problem.source_name || undefined,
      sourceEditionId: problem.source_edition_id || undefined,
      sourceEditionYear: problem.source_edition_year || undefined,
      sourceEditionExtra: problem.source_edition_extra || undefined,
    };
  } catch (error) {
    console.error("Error fetching problem details:", error);
    throw new Error("Failed to fetch problem details");
  } finally {
    await sql.end();
  }
}
