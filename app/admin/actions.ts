"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BADGES } from "@/lib/data";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import type { OrderStatus, StockStatus } from "@/lib/generated/prisma/client";

// ─── helpers ──────────────────────────────────────────────────────────────

const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? "").trim().slice(0, max);
const int = (fd: FormData, k: string, fallback = 0) => {
  const n = Number.parseInt(str(fd, k, 12), 10);
  return Number.isFinite(n) ? n : fallback;
};
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const list = (v: string) =>
  v
    .split(/[,،\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const STOCK: StockStatus[] = ["IN_STOCK", "LOW_STOCK", "SOLD_OUT"];
const ORDER: OrderStatus[] = ["NEW", "CONFIRMED", "IN_PROGRESS", "DONE", "CANCELLED"];

const fail = (path: string, msg: string): never => redirect(`${path}?error=${encodeURIComponent(msg)}`);

function refreshStore() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

// ─── auth ─────────────────────────────────────────────────────────────────

export async function loginAction(fd: FormData) {
  const ok = await checkPassword(str(fd, "password", 200));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    fail("/admin/login", "كلمة السر غلط");
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ─── products ─────────────────────────────────────────────────────────────

function readProduct(fd: FormData) {
  const badge = str(fd, "badge", 40);
  const stock = str(fd, "stockStatus", 20) as StockStatus;
  const categoryKey = str(fd, "categoryKey", 40);
  const tags = Array.from(new Set([categoryKey, ...fd.getAll("tags").map((t) => String(t).slice(0, 40))])).filter(Boolean);
  return {
    code: str(fd, "code", 30),
    name: str(fd, "name", 120),
    price: Math.max(0, int(fd, "price")),
    categoryKey,
    tags,
    badge: (BADGES as string[]).includes(badge) ? badge : null,
    editionNo: Math.max(0, int(fd, "editionNo", 1)),
    editionTotal: Math.max(1, int(fd, "editionTotal", 50)),
    image: str(fd, "image", 600),
    altImage: str(fd, "altImage", 600),
    sizes: list(str(fd, "sizes", 300)),
    description: str(fd, "description", 2000),
    stockStatus: STOCK.includes(stock) ? stock : "IN_STOCK",
    published: bool(fd, "published"),
    sortOrder: int(fd, "sortOrder"),
  };
}

export async function createProduct(fd: FormData) {
  await requireAdmin();
  const data = readProduct(fd);
  const id = slugify(str(fd, "id", 80) || data.name);
  if (!id || !data.name || !data.code || !data.categoryKey || !data.image) {
    fail("/admin/products/new", "الاسم، الكود، القسم، والصورة إجبارية");
  }
  try {
    await getDb().product.create({ data: { id, ...data, altImage: data.altImage || data.image } });
  } catch (err) {
    console.error("[createProduct]", err);
    fail("/admin/products/new", "ما قدرناش نضيفوا القطعة — الكود أو المعرّف مستعمل قبل");
  }
  refreshStore();
  redirect("/admin/products?saved=1");
}

export async function updateProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 80);
  const data = readProduct(fd);
  if (!id || !data.name || !data.code || !data.categoryKey || !data.image) {
    fail(`/admin/products/${id}`, "الاسم، الكود، القسم، والصورة إجبارية");
  }
  try {
    await getDb().product.update({ where: { id }, data: { ...data, altImage: data.altImage || data.image } });
  } catch (err) {
    console.error("[updateProduct]", err);
    fail(`/admin/products/${id}`, "ما قدرناش نحفظوا — تأكد إن الكود مش مكرر");
  }
  refreshStore();
  redirect("/admin/products?saved=1");
}

/** Quick inline edits from the products table (price / stock / published). */
export async function quickUpdateProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 80);
  const stock = str(fd, "stockStatus", 20) as StockStatus;
  try {
    await getDb().product.update({
      where: { id },
      data: {
        price: Math.max(0, int(fd, "price")),
        stockStatus: STOCK.includes(stock) ? stock : "IN_STOCK",
        published: bool(fd, "published"),
      },
    });
  } catch (err) {
    console.error("[quickUpdateProduct]", err);
    fail("/admin/products", "ما تحفظش التعديل");
  }
  refreshStore();
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 80);
  try {
    await getDb().product.delete({ where: { id } });
  } catch (err) {
    console.error("[deleteProduct]", err);
    fail("/admin/products", "ما قدرناش نمسحوا القطعة");
  }
  refreshStore();
  redirect("/admin/products?deleted=1");
}

// ─── categories ───────────────────────────────────────────────────────────

export async function saveCategory(fd: FormData) {
  await requireAdmin();
  const isNew = str(fd, "mode", 10) === "new";
  const key = slugify(str(fd, "key", 40));
  const data = {
    label: str(fd, "label", 80),
    latin: bool(fd, "latin"),
    image: str(fd, "image", 600),
    sortOrder: int(fd, "sortOrder"),
    featured: bool(fd, "featured"),
  };
  if (!key || !data.label || !data.image) fail("/admin/categories", "المفتاح، الاسم، والصورة إجبارية");
  try {
    if (isNew) await getDb().category.create({ data: { key, ...data } });
    else await getDb().category.update({ where: { key }, data });
  } catch (err) {
    console.error("[saveCategory]", err);
    fail("/admin/categories", isNew ? "المفتاح مستعمل قبل" : "ما تحفظش القسم");
  }
  refreshStore();
  redirect("/admin/categories?saved=1");
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  const key = str(fd, "key", 40);
  const db = getDb();
  const inUse = await db.product.count({ where: { categoryKey: key } });
  if (inUse > 0) fail("/admin/categories", `القسم فيه ${inUse} قطع — انقلهم لقسم ثاني قبل`);
  try {
    await db.category.delete({ where: { key } });
  } catch (err) {
    console.error("[deleteCategory]", err);
    fail("/admin/categories", "ما قدرناش نمسحوا القسم");
  }
  refreshStore();
  redirect("/admin/categories?deleted=1");
}

// ─── custom art orders ────────────────────────────────────────────────────

export async function updateOrder(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 40);
  const status = str(fd, "status", 20) as OrderStatus;
  const back = str(fd, "back", 200) || "/admin/orders";
  const safeBack = back.startsWith("/admin") ? back : "/admin/orders";
  try {
    await getDb().customArtOrder.update({
      where: { id },
      data: { status: ORDER.includes(status) ? status : "NEW", adminNote: str(fd, "adminNote", 1000) || null },
    });
  } catch (err) {
    console.error("[updateOrder]", err);
    fail("/admin/orders", "ما تحفظش الطلب");
  }
  revalidatePath("/admin", "layout");
  redirect(safeBack);
}

export async function deleteOrder(fd: FormData) {
  await requireAdmin();
  try {
    await getDb().customArtOrder.delete({ where: { id: str(fd, "id", 40) } });
  } catch (err) {
    console.error("[deleteOrder]", err);
    fail("/admin/orders", "ما قدرناش نمسحوا الطلب");
  }
  revalidatePath("/admin", "layout");
  redirect("/admin/orders?deleted=1");
}

// ─── settings ─────────────────────────────────────────────────────────────

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const whatsappNumber = str(fd, "whatsappNumber", 20).replace(/\D/g, "");
  if (whatsappNumber.length < 8) fail("/admin/settings", "رقم الواتساب لازم يكون بالصيغة الدولية، مثلاً 218910073418");
  const data = {
    storeName: str(fd, "storeName", 80) || "TAR7A | طرحه",
    whatsappNumber,
    announcement: str(fd, "announcement", 1000),
    acceptOrders: bool(fd, "acceptOrders"),
  };
  try {
    await getDb().admin.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
  } catch (err) {
    console.error("[saveSettings]", err);
    fail("/admin/settings", "ما تحفظوش الإعدادات");
  }
  refreshStore();
  redirect("/admin/settings?saved=1");
}
