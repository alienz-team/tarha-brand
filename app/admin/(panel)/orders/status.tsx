import type { OrderStatus } from "@/lib/generated/prisma/client";

export const ORDER_STATUSES: OrderStatus[] = ["NEW", "CONFIRMED", "IN_PROGRESS", "DONE", "CANCELLED"];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "جديد",
  CONFIRMED: "متأكد",
  IN_PROGRESS: "قيد الرسم",
  DONE: "تسلم",
  CANCELLED: "ملغي",
};

const STYLES: Record<OrderStatus, string> = {
  NEW: "bg-brand text-white",
  CONFIRMED: "bg-ink text-white",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  DONE: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-chalk-2 text-mute",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STYLES[status]}`}>{ORDER_STATUS_LABELS[status]}</span>;
}
