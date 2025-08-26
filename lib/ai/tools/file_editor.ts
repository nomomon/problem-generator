import z from "zod";

const read_file = {
  description:
    "read contents of the file user is working with to understand its current state before editing",
  inputSchema: z.object({}),
};

const replace_string_in_file = {
  description:
    "replace a specific string in the file user is working at with new content",
  inputSchema: z.object({
    old_string: z.string().describe("the exact string to replace"),
    new_string: z.string().describe("the new string to replace it with"),
  }),
};

// const insert_edit_into_file = {
//     description: "smart tool that can understand and apply edits to files with minimal hints",
//     inputSchema: z.object({
//         edit: z.string().describe("the edit to apply, can use comments like '// ...existing code...' to represent unchanged regions"),
//     }),
// };

export default { read_file, replace_string_in_file };
