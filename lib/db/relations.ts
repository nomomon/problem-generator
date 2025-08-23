import { relations } from "drizzle-orm/relations";
import { usersInAuth, problems } from "./schema";

export const problemsRelations = relations(problems, ({ one }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [problems.authorId],
    references: [usersInAuth.id],
  }),
}));

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  problems: many(problems),
}));
