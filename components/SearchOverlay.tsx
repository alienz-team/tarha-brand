"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/data";
import { useShop } from "./ShopProvider";
import { CloseIcon, SearchIcon, SmartImage } from "./ui";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, openQuickView, products: PRODUCTS, labelOf: categoryLabel } = useShop();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
    setQ("");
  }, [searchOpen]);

  const term = q.trim().toLowerCase();
  const results = term
    ? PRODUCTS.filter((p) =>
        [p.name, p.code, categoryLabel(p.category), ...p.tags.map(categoryLabel)].some((s) => s.toLowerCase().includes(term)),
      )
    : PRODUCTS.slice(0, 4);

  return (
    <div className={`fixed inset-0 z-[65] ${searchOpen ? "" : "pointer-events-none"}`} aria-hidden={!searchOpen}>
      <div
        className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${searchOpen ? "opacity-100" : "opacity-0"}`}
        onClick={() => setSearchOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="بحث"
        className={`relative mx-auto mt-4 w-[calc(100%-1.5rem)] max-w-3xl overflow-hidden rounded-3xl bg-chalk shadow-2xl transition-all duration-500 ease-out-expo ${
          searchOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-line-light px-5">
          <SearchIcon className="h-5 w-5 text-brand" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="دور على قطعة… هودي، سبيدرو، NIKE"
            className="h-16 flex-1 bg-transparent text-lg font-semibold placeholder:text-mute focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand hover:text-white"
            aria-label="سكر البحث"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="max-h-[60svh] overflow-y-auto p-3">
          <div className="px-2 pb-2 pt-1 text-xs font-bold text-mute">{term ? `النتائج (${results.length})` : "الأكثر طلب"}</div>
          {results.length === 0 ? (
            <p className="px-2 py-10 text-center text-mute">ما لقيناش حاجة. جرب كلمة ثانية.</p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      openQuickView(p);
                    }}
                    className="flex w-full items-center gap-4 rounded-2xl p-2 text-start transition-colors hover:bg-white"
                  >
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-chalk-2">
                      <SmartImage id={p.image} alt="" w={160} className="absolute inset-0 h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div dir="auto" className="truncate text-right font-display font-bold uppercase">{p.name}</div>
                      <div className="text-xs text-mute">{categoryLabel(p.category)}</div>
                    </div>
                    <div className="font-black text-brand">{formatPrice(p.price)}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
