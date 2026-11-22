import Link from "next/link";
import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { logoutAction } from "../actions";
import { SubmitButton } from "../ui";

const NAV = [
  { href: "/admin", label: "الرئيسية" },
  { href: "/admin/products", label: "القطع" },
  { href: "/admin/categories", label: "الأقسام" },
  { href: "/admin/orders", label: "طلبات الرسم" },
  { href: "/admin/settings", label: "الإعدادات" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const newOrders = await getDb()
    .customArtOrder.count({ where: { status: "NEW" } })
    .catch(() => 0);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line-dark bg-ink text-chalk">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/admin" dir="ltr" className="font-display text-lg font-bold">
            <span className="text-brand">TAR7A</span> <span className="text-chalk/50">/ admin</span>
          </Link>
          <nav className="no-scrollbar order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold hover:bg-white/10"
              >
                {n.label}
                {n.href === "/admin/orders" && newOrders > 0 && (
                  <span className="rounded-full bg-brand px-1.5 font-display text-xs text-white">{newOrders}</span>
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="text-sm font-semibold text-chalk/70 hover:text-brand">
              شوف المتجر ↖
            </Link>
            <form action={logoutAction}>
              <SubmitButton variant="ghost" className="!py-1.5">
                خروج
              </SubmitButton>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
