import z from "zod";

const read_file = {
  description: "read contents of the file the user is currently working with",
  inputSchema: z.object({}),
  execute: async () => {
    return "";
  },
};

export default read_file;
