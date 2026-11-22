"use client";

import { useState } from "react";
import { formatPrice, pad } from "@/lib/data";
import { saveBagCustomOrders } from "@/app/actions";
import { useShop, type CartItem } from "./ShopProvider";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, SmartImage, WhatsAppIcon } from "./ui";

export function buildOrderMessage(cart: CartItem[], subtotal: number, name: string, city: string, phone: string) {
  const lines = cart.map((c, i) => {
    const extras = [
      c.size && `المقاس: ${c.size}`,
      c.color && `اللون: ${c.color}`,
      c.note && `الفكرة: ${c.note}`,
    ]
      .filter(Boolean)
      .join(" — ");
    return `${i + 1}) ${c.name}${extras ? ` — ${extras}` : ""}\n   الكمية: ${c.qty} × ${formatPrice(c.price)} = ${formatPrice(c.qty * c.price)}`;
  });

  return [
    "السلام عليكم TAR7A 👋",
    "طلب جديد من الموقع:",
    "",
    ...lines,
    "",
    `المجموع: ${formatPrice(subtotal)}`,
    "",
    name.trim() ? `الاسم: ${name.trim()}` : null,
    phone.trim() ? `رقم الهاتف: ${phone.trim()}` : null,
    city.trim() ? `العنوان / المدينة: ${city.trim()}` : null,
    "طرحتي تجيني لاعندي ✌️",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem, subtotal, count, clearCart, wa } = useShop();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const send = () => {
    if (!cart.length) return;
    window.open(wa(buildOrderMessage(cart, subtotal, name, city, phone)), "_blank", "noopener,noreferrer");

    // Persist custom-art lines (Make your hoodie / Shirts / Custom Art Shoes) to Neon in the background.
    const custom = cart
      .filter((c) => c.productId.startsWith("studio-"))
      .map((c) => {
        const [idea, ...rest] = (c.note ?? "").split(" — ");
        return {
          pieceId: c.productId.replace("studio-", ""),
          color: c.color ?? "",
          size: c.size ?? "",
          idea,
          details: rest.join(" — "),
          qty: c.qty,
          customerName: name,
          phone,
          city,
        };
      });
    if (custom.length) void saveBagCustomOrders(custom).catch(() => {});
  };

  return (
    <div className={`fixed inset-0 z-[70] ${cartOpen ? "" : "pointer-events-none"}`} aria-hidden={!cartOpen}>
      <div
        className={`absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سلة التسوق"
        className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-chalk shadow-2xl transition-transform duration-500 ease-out-expo ${
          cartOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line-light p-5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black">السلة</h2>
            <span dir="ltr" className="rounded-full bg-brand px-2.5 py-0.5 font-display text-sm font-bold text-white">
              {pad(count)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line-light transition-colors hover:border-brand hover:bg-brand hover:text-white"
            aria-label="سكر السلة"
          >
            <CloseIcon />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-chalk-2 text-mute">
              <BagIcon className="h-8 w-8" />
            </div>
            <p className="text-xl font-black">السلة فاضية</p>
            <p className="text-sm text-mute">ركب طرحتك من الدروب وارجع هني.</p>
            <a
              href="#drop"
              onClick={() => setCartOpen(false)}
              className="mt-2 rounded-full bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-hover"
            >
              ركب طرحتك ↗
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line-light overflow-y-auto px-5">
              {cart.map((c) => (
                <li key={c.key} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-chalk-2">
                    <SmartImage id={c.image} alt={c.name} w={200} className="absolute inset-0 h-full w-full" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 dir="auto" className="truncate font-display text-sm font-bold uppercase">{c.name}</h3>
                      <button type="button" onClick={() => removeItem(c.key)} className="text-xs font-semibold text-mute hover:text-brand">
                        نحّي
                      </button>
                    </div>
                    <div className="mt-1 space-y-0.5 text-xs text-mute">
                      {c.size && <div>المقاس: <span dir="ltr" className="font-display">{c.size}</span></div>}
                      {c.color && <div>اللون: {c.color}</div>}
                      {c.note && <div className="line-clamp-2">الفكرة: {c.note}</div>}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-line-light">
                        <button type="button" onClick={() => updateQty(c.key, -1)} className="grid h-8 w-8 place-items-center" aria-label="نقص">
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-display text-sm font-bold tabular-nums">{c.qty}</span>
                        <button type="button" onClick={() => updateQty(c.key, 1)} className="grid h-8 w-8 place-items-center" aria-label="زيد">
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-black text-brand">{formatPrice(c.qty * c.price)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-line-light bg-white p-5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم"
                  autoComplete="name"
                  className="rounded-xl border border-line-light bg-chalk px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  inputMode="tel"
                  autoComplete="tel"
                  className="rounded-xl border border-line-light bg-chalk px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
                />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="المدينة / المنطقة (طرابلس، بنغازي…)"
                  autoComplete="address-level2"
                  className="col-span-2 rounded-xl border border-line-light bg-chalk px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold">المجموع</span>
                <span className="text-2xl font-black">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-mute">التوصيل يتحسب حسب المدينة ونأكدوه معاك عالواتساب.</p>
              <button
                type="button"
                onClick={send}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 font-bold text-white transition-colors hover:bg-brand-hover"
              >
                <WhatsAppIcon />
                ابعت الطلب عالواتساب
              </button>
              <button type="button" onClick={clearCart} className="w-full py-1 text-xs font-semibold text-mute hover:text-brand">
                فضّي السلة
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
