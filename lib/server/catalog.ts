import {
  ALL_CATEGORIES,
  CATEGORIES,
  PRODUCTS,
  WHATSAPP_NUMBER,
  type Badge,
  type Category,
  type CategoryKey,
  type Product,
} from "@/lib/data";
import { getDb, hasDatabase } from "./db";

export type StoreSettings = {
  whatsappNumber: string;
  announcement: string[];
  acceptOrders: boolean;
};

export type Storefront = {
  products: Product[];
  /** Every category (incl. "custom"), sorted */
  categories: Category[];
  /** The kinetic-row categories */
  featured: CategoryKey[];
  settings: StoreSettings;
  source: "database" | "fallback";
};

const DEFAULT_SETTINGS: StoreSettings = {
  whatsappNumber: WHATSAPP_NUMBER,
  announcement: ["طرحتك تجيك لاعندك", "توصيل طرابلس وليبيا", "رسم وتصميم حسب الطلب (Make Your Hoodie & Shirt)"],
  acceptOrders: true,
};

const FALLBACK: Storefront = {
  products: PRODUCTS,
  categories: ALL_CATEGORIES,
  featured: CATEGORIES.map((c) => c.key),
  settings: DEFAULT_SETTINGS,
  source: "fallback",
};

/** Loads the published catalog from Neon; falls back to the bundled launch catalog if the DB is unreachable. */
export async function getStorefront(): Promise<Storefront> {
  if (!hasDatabase()) return FALLBACK;
  try {
    const db = getDb();
    const [products, categories, admin] = await Promise.all([
      db.product.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
      db.category.findMany({ orderBy: { sortOrder: "asc" } }),
      db.admin.findUnique({ where: { id: 1 } }),
    ]);

    return {
      products: products.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        price: p.price,
        category: p.categoryKey as CategoryKey,
        tags: (p.tags.length ? p.tags : [p.categoryKey]) as CategoryKey[],
        badge: (p.badge || undefined) as Badge | undefined,
        edition: [p.editionNo, p.editionTotal],
        image: p.image,
        altImage: p.altImage || p.image,
        sizes: p.sizes.length ? p.sizes : undefined,
        description: p.description,
        stockStatus: p.stockStatus,
      })),
      categories: categories.map((c) => ({
        key: c.key as CategoryKey,
        label: c.label,
        latin: c.latin,
        image: c.image,
      })),
      featured: categories.filter((c) => c.featured).map((c) => c.key as CategoryKey),
      settings: admin
        ? {
            whatsappNumber: admin.whatsappNumber || WHATSAPP_NUMBER,
            announcement: admin.announcement.split("\n").map((l) => l.trim()).filter(Boolean),
            acceptOrders: admin.acceptOrders,
          }
        : DEFAULT_SETTINGS,
      source: "database",
    };
  } catch (err) {
    console.error("[storefront] database unavailable, serving fallback catalog:", err);
    return FALLBACK;
  }
}
