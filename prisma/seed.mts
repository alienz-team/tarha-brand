// Seeds TAR7A | طرحه categories, the 10 launch products and store settings.
// Runs on plain Node (>= 22.18, native TS type-stripping) over Neon's HTTP driver,
// so it doesn't need the Workers-targeted Prisma client.
// Idempotent: existing rows are left untouched (admin edits are never overwritten).
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { ALL_CATEGORIES, CATEGORIES, PRODUCTS } from "../lib/data.ts";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set (run `neon env pull`).");
const sql = neon(url);

for (const [i, c] of ALL_CATEGORIES.entries()) {
  const featured = CATEGORIES.some((f) => f.key === c.key);
  await sql`
    INSERT INTO "Category" ("key", "label", "latin", "image", "sortOrder", "featured", "createdAt", "updatedAt")
    VALUES (${c.key}, ${c.label}, ${c.latin ?? false}, ${c.image}, ${i}, ${featured}, now(), now())
    ON CONFLICT ("key") DO NOTHING`;
}

for (const [i, p] of PRODUCTS.entries()) {
  await sql`
    INSERT INTO "Product" ("id", "code", "name", "price", "categoryKey", "tags", "badge", "editionNo", "editionTotal",
      "image", "altImage", "sizes", "description", "stockStatus", "published", "sortOrder", "createdAt", "updatedAt")
    VALUES (${p.id}, ${p.code}, ${p.name}, ${p.price}, ${p.category}, ${p.tags}, ${p.badge ?? null}, ${p.edition[0]},
      ${p.edition[1]}, ${p.image}, ${p.altImage}, ${p.sizes ?? []}, ${p.description}, 'IN_STOCK'::"StockStatus", true, ${i},
      now(), now())
    ON CONFLICT ("id") DO NOTHING`;
}

await sql`INSERT INTO "Admin" ("id", "updatedAt") VALUES (1, now()) ON CONFLICT ("id") DO NOTHING`;

const [{ count: products }] = await sql`SELECT count(*)::int AS count FROM "Product"`;
const [{ count: categories }] = await sql`SELECT count(*)::int AS count FROM "Category"`;
console.log(`Seeded: ${categories} categories, ${products} products, store settings.`);
