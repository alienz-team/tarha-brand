import Link from "next/link";
import { formatPrice, waLink } from "@/lib/data";
import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import type { OrderStatus } from "@/lib/generated/prisma/client";
import { deleteOrder, updateOrder } from "../../actions";
import { Flash, PageTitle } from "../../parts";
import { SubmitButton, inputCls } from "../../ui";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, StatusPill } from "./status";

/** Libyan local numbers (09xxxxxxxx) → 2189xxxxxxxx for wa.me */
const toIntl = (phone: string) => {
  const d = phone.replace(/\D/g, "").replace(/^00/, "");
  return d.startsWith("0") ? `218${d.slice(1)}` : d;
};

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("ar-LY", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Tripoli" }).format(d);

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const status = ORDER_STATUSES.includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : undefined;
  const orders = await getDb().customArtOrder.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const back = status ? `/admin/orders?status=${status}` : "/admin/orders";

  return (
    <>
      <PageTitle title="طلبات الرسم (TARHA ART Studio)" />
      <Flash error={sp.error} ok={sp.deleted ? "تمسح ✓" : undefined} />

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {[undefined, ...ORDER_STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${
              status === s ? "border-brand bg-brand text-white" : "border-line-light bg-white hover:border-brand"
            }`}
          >
            {s ? ORDER_STATUS_LABELS[s] : "الكل"}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="rounded-3xl border border-line-light bg-white p-10 text-center text-mute">ما فيش طلبات هني.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {orders.map((o) => (
            <article key={o.id} className="rounded-3xl border border-line-light bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div dir="ltr" className="text-end font-display text-lg font-bold">
                    {o.pieceLabel}
                  </div>
                  <div className="text-xs text-mute">
                    {fmtDate(o.createdAt)} · {o.source === "bag" ? "من السلة" : "من الستوديو"}
                  </div>
                </div>
                <StatusPill status={o.status} />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                {[
                  ["اللون", o.color],
                  ["المقاس", o.size],
                  ["الفكرة", o.idea],
                  ["الكمية", `${o.qty} × ${formatPrice(o.unitPrice)}`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-mute">{k}</dt>
                    <dd className="font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
              {o.details && <p className="mt-3 rounded-2xl bg-chalk p-3 text-sm">{o.details}</p>}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line-light pt-4 text-sm">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-bold">{o.customerName || "بدون اسم"}</span>
                  {o.city && <span className="text-mute">· {o.city}</span>}
                  {o.phone && (
                    <a dir="ltr" href={`tel:${o.phone}`} className="font-display text-brand">
                      {o.phone}
                    </a>
                  )}
                </div>
                <span className="text-lg font-black text-brand">{formatPrice(o.total)}</span>
              </div>

              <form action={updateOrder} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="back" value={back} />
                <select name="status" defaultValue={o.status} className={`${inputCls} sm:!w-36`}>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <input name="adminNote" defaultValue={o.adminNote ?? ""} placeholder="ملاحظة داخلية" className={inputCls} />
                <SubmitButton variant="ghost">حفظ</SubmitButton>
              </form>

              <div className="mt-3 flex items-center justify-between">
                {o.phone ? (
                  <a
                    href={waLink(`السلام عليكم ${o.customerName ?? ""} 👋\nبخصوص طلبك ${o.pieceLabel} من TAR7A…`, toIntl(o.phone))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-brand"
                  >
                    كلم الزبون عالواتساب ↖
                  </a>
                ) : (
                  <span />
                )}
                <form action={deleteOrder}>
                  <input type="hidden" name="id" value={o.id} />
                  <SubmitButton variant="danger" confirm="تمسح الطلب؟" className="!px-3 !py-1.5 text-xs">
                    مسح
                  </SubmitButton>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
