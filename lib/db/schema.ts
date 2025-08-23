import {
  pgTable,
  bigint,
  timestamp,
  uuid,
  text,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

// Define the difficulty enum
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

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
  // New fields
  name: text("name"),
  assets: text("assets").array(), // Array of file URLs
  difficulty: difficultyEnum("difficulty"), // Can be null
});

export const topics = pgTable("topics", {
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
    name: "topics_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    cache: 1,
  }),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// Junction table for many-to-many relationship between problems and topics
export const problemTopics = pgTable(
  "problem_topics",
  {
    problemId: bigint("problem_id", { mode: "number" })
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    topicId: bigint("topic_id", { mode: "number" })
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.problemId, table.topicId] }),
    };
  },
);
