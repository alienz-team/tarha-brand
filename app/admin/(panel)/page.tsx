import Link from "next/link";
import { formatPrice } from "@/lib/data";
import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { PageTitle } from "../parts";
import { ORDER_STATUS_LABELS, StatusPill } from "./orders/status";

export default async function AdminHome() {
  await requireAdmin();
  const db = getDb();
  const [products, soldOut, lowStock, categories, newOrders, openOrders, recent] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { stockStatus: "SOLD_OUT" } }),
    db.product.count({ where: { stockStatus: "LOW_STOCK" } }),
    db.category.count(),
    db.customArtOrder.count({ where: { status: "NEW" } }),
    db.customArtOrder.count({ where: { status: { in: ["NEW", "CONFIRMED", "IN_PROGRESS"] } } }),
    db.customArtOrder.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { label: "القطع", value: products, href: "/admin/products" },
    { label: "خلصت", value: soldOut, href: "/admin/products" },
    { label: "قطع قليلة", value: lowStock, href: "/admin/products" },
    { label: "الأقسام", value: categories, href: "/admin/categories" },
    { label: "طلبات جديدة", value: newOrders, href: "/admin/orders?status=NEW", accent: true },
    { label: "طلبات مفتوحة", value: openOrders, href: "/admin/orders" },
  ];

  return (
    <>
      <PageTitle title="أهلاً بيك 👋" />
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line-light bg-line-light sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white p-5 transition-colors hover:bg-chalk">
            <div className="text-xs font-bold text-mute">{s.label}</div>
            <div className={`mt-2 font-display text-4xl font-bold ${s.accent ? "text-brand" : ""}`}>{s.value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-black">آخر طلبات الرسم</h2>
        <Link href="/admin/orders" className="text-sm font-bold text-brand">
          كل الطلبات ↖
        </Link>
      </div>
      <div className="mt-4 overflow-hidden rounded-3xl border border-line-light bg-white">
        {recent.length === 0 ? (
          <p className="p-8 text-center text-mute">ما فيش طلبات لتوا.</p>
        ) : (
          <ul className="divide-y divide-line-light">
            {recent.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div dir="ltr" className="text-end font-display font-bold">
                    {o.pieceLabel}
                  </div>
                  <div className="text-xs text-mute">
                    {o.color} · {o.size} · {o.idea} · {o.customerName || "بدون اسم"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-brand">{formatPrice(o.total)}</span>
                  <StatusPill status={o.status} />
                  <span className="sr-only">{ORDER_STATUS_LABELS[o.status]}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
