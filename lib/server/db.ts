import { cache } from "react";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/lib/generated/prisma/client";

/**
 * One Prisma client per request. On Cloudflare Workers, I/O objects (the Neon
 * WebSocket pool) must not be shared across requests, so we scope the client to
 * the request with React's `cache()` instead of a module-level singleton.
 */
export const getDb = cache(() => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
});

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);
