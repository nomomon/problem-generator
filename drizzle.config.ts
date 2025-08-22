import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load env vars from .env and .env.local (local takes precedence)
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
