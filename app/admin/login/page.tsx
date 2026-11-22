import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/server/auth";
import { loginAction } from "../actions";
import { SubmitButton, inputCls, labelCls } from "../ui";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  const configured = Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <form action={loginAction} className="w-full max-w-sm rounded-3xl bg-chalk p-8 shadow-2xl">
        <div dir="ltr" className="text-end font-display text-2xl font-bold">
          <span className="text-brand">TAR7A</span> | طرحه
        </div>
        <h1 className="mt-6 text-2xl font-black">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-mute">ادخل كلمة السر باش تكمل.</p>

        {!configured && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
            ADMIN_PASSWORD و ADMIN_SESSION_SECRET مش مضبوطين في البيئة.
          </p>
        )}
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

        <label className={`${labelCls} mt-6`} htmlFor="password">
          كلمة السر
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={inputCls} />
        <SubmitButton className="mt-6 w-full py-3">دخول</SubmitButton>
      </form>
    </main>
  );
}
