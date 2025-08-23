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
    // Get the problem details
    const problemResult = await sql`
      SELECT 
        id, 
        function_js, 
        name, 
        assets, 
        difficulty,
        created_at as "createdAt",
        author_id as "authorId"
      FROM problems 
      WHERE id = ${problemId} AND author_id = ${user.id}
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
    };
  } catch (error) {
    console.error("Error fetching problem details:", error);
    throw new Error("Failed to fetch problem details");
  } finally {
    await sql.end();
  }
}
