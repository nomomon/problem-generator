import {
  pgTable,
  foreignKey,
  bigint,
  timestamp,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const problems = pgTable(
  "problems",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "problems_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    authorId: uuid("author_id"),
    functionJs: text("function_js"),
  },
  (table) => [
    foreignKey({
      columns: [table.authorId],
      foreignColumns: [users.id],
      name: "problems_author_id_fkey",
    }),
  ],
);
