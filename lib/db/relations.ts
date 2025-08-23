import { relations } from "drizzle-orm/relations";
import { problems } from "./schema";

// We don't define relations to auth.users since it's managed by Supabase
// and we can't create foreign key constraints to it from our schema
export const problemsRelations = relations(problems, ({ one }) => ({}));
