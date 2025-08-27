import { tool } from "ai";
import z from "zod";

const read_file = tool({
  description:
    "Read the entire contents of a file to understand the current problem generator or template.",
  inputSchema: z.object({}),
});

const update_problem_code = tool({
  description:
    "Safely replace or update the generateProblem() function or part of the problem code with new content.",
  inputSchema: z.object({
    old_code: z.string().describe("Exact old code snippet you want to replace"),
    new_code: z
      .string()
      .describe("New code snippet or problem generator to replace it with"),
  }),
});

const patch_code = tool({
  description:
    "Apply small targeted code edits (like changing variable ranges, text phrasing) inside the problem generator.",
  inputSchema: z.object({
    target: z
      .string()
      .describe(
        "Identifier or keyword to locate in the file (e.g. variable name or phrase)",
      ),
    replacement: z.string().describe("New replacement content for the target"),
    mode: z
      .enum(["before", "after", "replace"])
      .describe("How to apply the replacement relative to the target"),
  }),
});

// const insert_edit_into_file = tool({
//     description: "smart tool that can understand and apply edits to files with minimal hints",
//     inputSchema: z.object({
//         edit: z.string().describe("the edit to apply, can use comments like '// ...existing code...' to represent unchanged regions"),
//     }),
// });

export default { read_file, update_problem_code, patch_code };
