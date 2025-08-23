"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";

export async function createProblem(functionJs: string) {
  try {
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

    // Insert the problem
    const result = await sql`
            INSERT INTO problems (function_js, author_id) 
            VALUES (${functionJs}, ${user.id}) 
            RETURNING id
        `;

    await sql.end(); // Close the connection

    const newProblem = result[0] as { id: number };

    if (!newProblem || !newProblem.id) {
      throw new Error("Failed to create problem");
    }

    // Revalidate the dashboard page to show the new problem
    revalidatePath("/dashboard");

    // Redirect to the new problem page
    redirect(`/dashboard/problems/${newProblem.id}`);
  } catch (error) {
    console.error("Error creating problem:", error);
    throw new Error("Failed to create problem");
  }
}
