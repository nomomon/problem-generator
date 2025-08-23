import { pgTable, bigint, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const problems = pgTable("problems", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
    name: "problems_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    // Remove maxValue to use PostgreSQL's default maximum for bigint
    cache: 1,
  }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  // Just store the UUID without a foreign key constraint since auth.users is managed by Supabase
  authorId: uuid("author_id"),
  functionJs: text("function_js"),
});
