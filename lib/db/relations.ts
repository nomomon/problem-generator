import { relations } from "drizzle-orm/relations";
import { problems, topics, problemTopics } from "./schema";

// We don't define relations to auth.users since it's managed by Supabase
// and we can't create foreign key constraints to it from our schema
export const problemsRelations = relations(problems, ({ many }) => ({
  problemTopics: many(problemTopics),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  problemTopics: many(problemTopics),
}));

export const problemTopicsRelations = relations(problemTopics, ({ one }) => ({
  problem: one(problems, {
    fields: [problemTopics.problemId],
    references: [problems.id],
  }),
  topic: one(topics, {
    fields: [problemTopics.topicId],
    references: [topics.id],
  }),
}));
