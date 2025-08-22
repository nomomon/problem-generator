import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

// Load .env first, then .env.local to allow local overrides
config({ path: ".env" });
config({ path: ".env.local", override: true });

export const db = drizzle(process.env.DATABASE_URL!);
