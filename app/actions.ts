"use server";

import { STUDIO_PIECES } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/server/db";

export type CustomOrderInput = {
  pieceId: string;
  color: string;
  size: string;
  idea: string;
  details?: string;
  qty: number;
  customerName?: string;
  phone?: string;
  city?: string;
  source?: "studio" | "bag";
};

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const opt = (v: unknown, max: number) => clip(v, max) || null;

/**
 * Saves a TARHA ART Studio request. The price is always recomputed on the server
 * from the piece catalog — never trusted from the client.
 * Fire-and-forget from the UI: the WhatsApp redirect never waits on this.
 */
export async function saveCustomArtOrder(input: CustomOrderInput): Promise<{ ok: boolean; id?: string }> {
  if (!hasDatabase()) return { ok: false };
  const piece = STUDIO_PIECES.find((p) => p.id === input?.pieceId);
  if (!piece) return { ok: false };

  const size = clip(input.size, 8);
  if (!piece.sizes.includes(size)) return { ok: false };
  const qty = Math.min(20, Math.max(1, Math.floor(Number(input.qty) || 1)));

  try {
    const order = await getDb().customArtOrder.create({
      data: {
        piece: piece.kind,
        pieceLabel: piece.label,
        color: clip(input.color, 40) || "—",
        size,
        idea: clip(input.idea, 80) || "—",
        details: opt(input.details, 1000),
        qty,
        unitPrice: piece.price,
        total: piece.price * qty,
        customerName: opt(input.customerName, 80),
        phone: opt(input.phone, 30),
        city: opt(input.city, 120),
        source: input.source === "bag" ? "bag" : "studio",
      },
      select: { id: true },
    });
    return { ok: true, id: order.id };
  } catch (err) {
    console.error("[saveCustomArtOrder]", err);
    return { ok: false };
  }
}

/** Saves every custom-art line from the bag when the customer sends the order to WhatsApp. */
export async function saveBagCustomOrders(items: CustomOrderInput[]): Promise<{ saved: number }> {
  if (!Array.isArray(items)) return { saved: 0 };
  const results = await Promise.all(items.slice(0, 10).map((i) => saveCustomArtOrder({ ...i, source: "bag" })));
  return { saved: results.filter((r) => r.ok).length };
}
