import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Local CLI only (db push / studio). Load Neon env pulled by `neon env pull`.
config({ path: ".env.local", quiet: true });
config({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.mts",
  },
  datasource: {
    // Direct (unpooled) connection for schema changes; empty during `prisma generate` in CI is fine.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
});
