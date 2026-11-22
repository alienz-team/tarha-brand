import { BADGES, STOCK_LABELS, img } from "@/lib/data";
import type { Category, Product } from "@/lib/generated/prisma/client";
import { SubmitButton, inputCls, labelCls } from "../../ui";

export function ProductForm({
  action,
  product,
  categories,
}: {
  action: (fd: FormData) => Promise<void>;
  product?: Product;
  categories: Category[];
}) {
  const p = product;
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      <div className="grid gap-5 rounded-3xl border border-line-light bg-white p-6 lg:col-span-2 sm:grid-cols-2">
        {p ? (
          <input type="hidden" name="id" value={p.id} />
        ) : (
          <Field label="المعرّف (slug بالإنجليزي، اختياري)">
            <input name="id" dir="ltr" placeholder="nike-air-force-art" className={inputCls} />
          </Field>
        )}
        <Field label="الكود *">
          <input name="code" dir="ltr" required defaultValue={p?.code} placeholder="TR-011" className={inputCls} />
        </Field>
        <Field label="اسم القطعة *" wide={!!p}>
          <input name="name" dir="auto" required defaultValue={p?.name} className={inputCls} />
        </Field>
        <Field label="السعر (ل.د) *">
          <input name="price" type="number" min={0} required defaultValue={p?.price ?? 0} className={inputCls} />
        </Field>
        <Field label="القسم الأساسي *">
          <select name="categoryKey" required defaultValue={p?.categoryKey} className={inputCls}>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="يظهر كمان في الأقسام" wide>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <label key={c.key} className="flex items-center gap-1.5 rounded-full border border-line-light px-3 py-1.5 text-xs font-bold">
                <input type="checkbox" name="tags" value={c.key} defaultChecked={p?.tags.includes(c.key)} className="accent-[#0057FF]" />
                {c.label}
              </label>
            ))}
          </div>
        </Field>
        <Field label="الوصف" wide>
          <textarea name="description" rows={4} defaultValue={p?.description} className={inputCls} />
        </Field>
        <Field label="المقاسات (افصل بفاصلة — فاضي = مقاس واحد)" wide>
          <input name="sizes" dir="ltr" defaultValue={p?.sizes.join(", ")} placeholder="S, M, L, XL, XXL  أو  39, 40, 41, 42" className={inputCls} />
        </Field>
        <Field label="الصورة الأساسية * (رابط أو Unsplash id)" wide>
          <input name="image" dir="ltr" required defaultValue={p?.image} className={inputCls} />
        </Field>
        <Field label="صورة الهوفر (اختياري)" wide>
          <input name="altImage" dir="ltr" defaultValue={p?.altImage} className={inputCls} />
        </Field>
      </div>

      <div className="flex flex-col gap-5 rounded-3xl border border-line-light bg-white p-6">
        {p && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img(p.image, 500)} alt="" className="aspect-[4/5] w-full rounded-2xl object-cover" />
        )}
        <Field label="المخزون">
          <select name="stockStatus" defaultValue={p?.stockStatus ?? "IN_STOCK"} className={inputCls}>
            {Object.entries(STOCK_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="البادج">
          <select name="badge" defaultValue={p?.badge ?? ""} className={inputCls}>
            <option value="">بدون</option>
            {BADGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="رقم الإصدار">
            <input name="editionNo" type="number" min={0} defaultValue={p?.editionNo ?? 1} className={inputCls} />
          </Field>
          <Field label="من أصل">
            <input name="editionTotal" type="number" min={1} defaultValue={p?.editionTotal ?? 50} className={inputCls} />
          </Field>
        </div>
        <Field label="الترتيب">
          <input name="sortOrder" type="number" defaultValue={p?.sortOrder ?? 0} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" name="published" defaultChecked={p?.published ?? true} className="h-4 w-4 accent-[#0057FF]" />
          منشور في المتجر
        </label>
        <SubmitButton className="mt-auto py-3">{p ? "حفظ التعديلات" : "ضيف القطعة"}</SubmitButton>
      </div>
    </form>
  );
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}
