import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { saveSettings } from "../../actions";
import { Flash, PageTitle } from "../../parts";
import { SubmitButton, inputCls, labelCls } from "../../ui";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const s = await getDb().admin.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  return (
    <>
      <PageTitle title="الإعدادات" />
      <Flash error={sp.error} ok={sp.saved ? "تحفظت الإعدادات ✓" : undefined} />
      <form action={saveSettings} className="grid max-w-2xl gap-5 rounded-3xl border border-line-light bg-white p-6">
        <div>
          <label className={labelCls} htmlFor="storeName">اسم المتجر</label>
          <input id="storeName" name="storeName" defaultValue={s.storeName} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="wa">رقم الواتساب للطلبات (صيغة دولية بدون +)</label>
          <input id="wa" name="whatsappNumber" dir="ltr" required defaultValue={s.whatsappNumber} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="ann">الشريط العلوي (كل سطر رسالة)</label>
          <textarea id="ann" name="announcement" rows={4} defaultValue={s.announcement} className={inputCls} />
        </div>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" name="acceptOrders" defaultChecked={s.acceptOrders} className="h-4 w-4 accent-[#0057FF]" />
          نستقبل طلبات رسم جديدة (لو مقفول، الستوديو يوري رسالة إن الطلبات موقفة)
        </label>
        <SubmitButton className="justify-self-start px-8 py-3">حفظ</SubmitButton>
      </form>
    </>
  );
}
