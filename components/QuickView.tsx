"use client";

import { useEffect, useState } from "react";
import { STOCK_LABELS, formatPrice, img, pad } from "@/lib/data";
import { badgeClass, productWaText } from "./ProductGrid";
import { useShop } from "./ShopProvider";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, SmartImage, WhatsAppIcon } from "./ui";

export function QuickView() {
  const { quickView: p, closeQuickView, addToCart, setCartOpen, labelOf, wa } = useShop();
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [showAlt, setShowAlt] = useState(false);
  const [needSize, setNeedSize] = useState(false);

  // Reset local state whenever a different product opens
  useEffect(() => {
    setSize(undefined);
    setQty(1);
    setShowAlt(false);
    setNeedSize(false);
  }, [p?.id]);

  const open = !!p;

  const add = () => {
    if (!p || p.stockStatus === "SOLD_OUT") return;
    if (p.sizes?.length && !size) {
      setNeedSize(true);
      return;
    }
    addToCart({ productId: p.id, name: p.name, price: p.price, image: p.image, size }, qty);
    closeQuickView();
    setCartOpen(true);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end justify-center transition-opacity duration-300 sm:items-center sm:p-6 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={closeQuickView} />
      {p && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`استعراض سريع — ${p.name}`}
          className={`relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-chalk transition-transform duration-500 ease-out-expo sm:rounded-3xl md:grid-cols-2 ${
            open ? "translate-y-0" : "translate-y-10"
          }`}
        >
          <button
            type="button"
            onClick={closeQuickView}
            className="absolute end-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-brand"
            aria-label="سكر"
          >
            <CloseIcon />
          </button>

          <div
            className="relative aspect-square bg-chalk-2 bg-cover bg-center md:aspect-auto md:min-h-[560px]"
            style={{ backgroundImage: `url(${img(showAlt ? p.altImage : p.image, 160)})` }}
          >
            <SmartImage
              key={showAlt ? p.altImage : p.image}
              id={showAlt ? p.altImage : p.image}
              alt={p.name}
              w={1200}
              eager
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute bottom-4 start-4 flex gap-2">
              {[p.image, p.altImage].map((id, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setShowAlt(i === 1)}
                  className={`h-14 w-14 overflow-hidden rounded-lg border-2 ${showAlt === (i === 1) ? "border-brand" : "border-white/70"}`}
                  aria-label={`صورة ${i + 1}`}
                >
                  <SmartImage id={id} alt="" w={160} className="h-full w-full" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-mute">
              {p.badge && <span className={`rounded-full px-2.5 py-1 font-display font-bold ${badgeClass(p.badge)}`}>{p.badge}</span>}
              <span dir="ltr" className="font-display tracking-widest">
                {pad(p.edition[0], 3)} / {pad(p.edition[1], 3)}
              </span>
              <span>· {labelOf(p.category)}</span>
              {p.stockStatus && p.stockStatus !== "IN_STOCK" && (
                <span className="rounded-full bg-ink px-2.5 py-1 font-bold text-white">{STOCK_LABELS[p.stockStatus]}</span>
              )}
            </div>
            <h2 dir="auto" className="mt-4 text-right font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">{p.name}</h2>
            <div className="mt-2 text-2xl font-black text-brand">{formatPrice(p.price)}</div>
            <p className="mt-5 leading-relaxed text-mute">{p.description}</p>

            {p.sizes && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between text-sm font-bold">
                  <span>المقاس</span>
                  {needSize && <span className="text-brand">اختار المقاس قبل</span>}
                </div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="المقاس">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={size === s}
                      onClick={() => {
                        setSize(s);
                        setNeedSize(false);
                      }}
                      className={`min-w-12 rounded-full border px-4 py-2 font-display text-sm font-bold transition-colors ${
                        size === s ? "border-brand bg-brand text-white" : needSize ? "border-brand/60" : "border-line-light hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm font-bold">الكمية</span>
              <div className="flex items-center rounded-full border border-line-light">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center" aria-label="نقص">
                  <MinusIcon />
                </button>
                <span className="w-8 text-center font-display font-bold tabular-nums">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center" aria-label="زيد">
                  <PlusIcon />
                </button>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
              <button
                type="button"
                onClick={add}
                disabled={p.stockStatus === "SOLD_OUT"}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-4 font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-mute"
              >
                <BagIcon className="h-5 w-5" />
                {p.stockStatus === "SOLD_OUT" ? "خلصت — اسألنا عالواتساب" : <>أضف للسلة — {formatPrice(p.price * qty)}</>}
              </button>
              <a
                href={wa(productWaText(p, size))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-ink px-6 py-4 font-bold transition-colors hover:bg-ink hover:text-white"
              >
                <WhatsAppIcon className="h-5 w-5" />
                اطلب عالواتساب
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
