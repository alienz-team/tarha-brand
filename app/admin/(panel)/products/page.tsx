import Link from "next/link";
import { STOCK_LABELS, img } from "@/lib/data";
import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { deleteProduct, quickUpdateProduct } from "../../actions";
import { Flash, PageTitle } from "../../parts";
import { SubmitButton, inputCls } from "../../ui";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const db = getDb();
  const [products, categories] = await Promise.all([
    db.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    db.category.findMany(),
  ]);
  const labelOf = new Map(categories.map((c) => [c.key, c.label]));

  return (
    <>
      <PageTitle title="القطع">
        <Link href="/admin/products/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-hover">
          + قطعة جديدة
        </Link>
      </PageTitle>
      <Flash error={sp.error} ok={sp.saved ? "تحفظ ✓" : sp.deleted ? "تمسحت ✓" : undefined} />

      <div className="overflow-x-auto rounded-3xl border border-line-light bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-line-light bg-chalk text-xs text-mute">
            <tr>
              <th className="p-3 text-start">القطعة</th>
              <th className="p-3 text-start">القسم</th>
              <th className="p-3 text-start">السعر (ل.د) · المخزون · منشور</th>
              <th className="p-3 text-start" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light">
            {products.map((p) => (
              <tr key={p.id} className={p.published ? "" : "opacity-60"}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(p.image, 120)} alt="" className="h-14 w-12 rounded-lg object-cover" />
                    <div>
                      <div dir="auto" className="font-display font-bold">
                        {p.name}
                      </div>
                      <div dir="ltr" className="text-end font-display text-xs text-mute">
                        {p.code}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-mute">{labelOf.get(p.categoryKey) ?? p.categoryKey}</td>
                <td className="p-3">
                  <form action={quickUpdateProduct} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <input name="price" type="number" min={0} defaultValue={p.price} className={`${inputCls} !w-24`} aria-label="السعر" />
                    <select name="stockStatus" defaultValue={p.stockStatus} className={`${inputCls} !w-32`} aria-label="المخزون">
                      {Object.entries(STOCK_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1.5 text-xs font-bold">
                      <input type="checkbox" name="published" defaultChecked={p.published} className="h-4 w-4 accent-[#0057FF]" />
                      منشور
                    </label>
                    <SubmitButton variant="ghost">حفظ</SubmitButton>
                  </form>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${p.id}`} className="rounded-full border border-line-light px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand">
                      تعديل
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <SubmitButton variant="danger" confirm={`تمسح ${p.name}؟`}>
                        مسح
                      </SubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-mute">ما فيش قطع. ضيف أول قطعة.</p>}
      </div>
    </>
  );
}
