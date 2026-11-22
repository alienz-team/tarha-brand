import { img } from "@/lib/data";
import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import type { Category } from "@/lib/generated/prisma/client";
import { deleteCategory, saveCategory } from "../../actions";
import { Flash, PageTitle } from "../../parts";
import { SubmitButton, inputCls, labelCls } from "../../ui";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const db = getDb();
  const [categories, counts] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.product.groupBy({ by: ["categoryKey"], _count: { _all: true } }),
  ]);
  const countOf = new Map(counts.map((c) => [c.categoryKey, c._count._all]));

  return (
    <>
      <PageTitle title="الأقسام" />
      <Flash error={sp.error} ok={sp.saved ? "تحفظ ✓" : sp.deleted ? "تمسح ✓" : undefined} />

      <div className="grid gap-4">
        {categories.map((c) => (
          <div key={c.key} className="flex flex-col gap-4 rounded-3xl border border-line-light bg-white p-5 lg:flex-row lg:items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(c.image, 200)} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
            <CategoryFields category={c} />
            <div className="flex items-center gap-2 text-xs font-bold text-mute lg:pb-2.5">{countOf.get(c.key) ?? 0} قطع</div>
            <form action={deleteCategory}>
              <input type="hidden" name="key" value={c.key} />
              <SubmitButton variant="danger" confirm={`تمسح قسم ${c.label}؟`}>
                مسح
              </SubmitButton>
            </form>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-xl font-black">قسم جديد</h2>
      <div className="rounded-3xl border border-dashed border-brand/50 bg-white p-5">
        <CategoryFields />
      </div>
    </>
  );
}

function CategoryFields({ category: c }: { category?: Category }) {
  return (
    <form action={saveCategory} className="grid flex-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr_1.6fr_5rem_auto_auto]">
      <input type="hidden" name="mode" value={c ? "edit" : "new"} />
      <div>
        <span className={labelCls}>المفتاح</span>
        {c ? (
          <>
            <input type="hidden" name="key" value={c.key} />
            <div dir="ltr" className={`${inputCls} bg-chalk text-end font-display text-mute`}>
              {c.key}
            </div>
          </>
        ) : (
          <input name="key" dir="ltr" required placeholder="hats" className={inputCls} />
        )}
      </div>
      <div>
        <span className={labelCls}>الاسم</span>
        <input name="label" dir="auto" required defaultValue={c?.label} className={inputCls} />
      </div>
      <div>
        <span className={labelCls}>الصورة (رابط أو Unsplash id)</span>
        <input name="image" dir="ltr" required defaultValue={c?.image} className={inputCls} />
      </div>
      <div>
        <span className={labelCls}>الترتيب</span>
        <input name="sortOrder" type="number" defaultValue={c?.sortOrder ?? 0} className={inputCls} />
      </div>
      <div className="flex flex-col gap-1.5 pb-1 text-xs font-bold">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" name="featured" defaultChecked={c?.featured ?? true} className="accent-[#0057FF]" />
          في الصفوف المتحركة
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" name="latin" defaultChecked={c?.latin} className="accent-[#0057FF]" />
          اسم لاتيني
        </label>
      </div>
      <SubmitButton variant={c ? "ghost" : "primary"}>{c ? "حفظ" : "ضيف القسم"}</SubmitButton>
    </form>
  );
}
