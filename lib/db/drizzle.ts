import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Load .env first, then .env.local to allow local overrides
config({ path: ".env" });
config({ path: ".env.local", override: true });

export const db = drizzle(process.env.DATABASE_URL!, { schema });
