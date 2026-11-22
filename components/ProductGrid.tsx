"use client";

import { STOCK_LABELS, formatPrice, pad, type Product } from "@/lib/data";
import { useShop } from "./ShopProvider";
import { BagIcon, Eyebrow, EyeIcon, Reveal, SmartImage, WhatsAppIcon } from "./ui";

export function badgeClass(b: Product["badge"]) {
  if (b === "Art Edition") return "bg-brand text-white";
  if (b === "Best Seller") return "bg-ink text-white ring-1 ring-brand";
  return "bg-white text-brand ring-1 ring-brand";
}

export const productWaText = (p: Product, size?: string) =>
  `السلام عليكم TAR7A 👋\nنبي نطلب:\n• ${p.name} (${p.code})${size ? `\n• المقاس: ${size}` : ""}\n• السعر: ${formatPrice(p.price)}\n\nمن الموقع — خت فت`;

export function ProductGrid() {
  const { filter, setFilter, categories, productsIn, labelOf } = useShop();
  const items = productsIn(filter);

  const chips: { key: typeof filter; label: string; latin?: boolean }[] = [
    { key: "all", label: "الكل" },
    ...categories.map((c) => ({ key: c.key, label: c.label, latin: c.latin })),
  ];

  return (
    <section id="drop" className="scroll-mt-20 border-t border-line-light bg-chalk py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow index="02">Drop Release</Eyebrow>
            <h2 className="mt-5 text-6xl font-black leading-none tracking-tight sm:text-8xl">
              خــت فــت
            </h2>
          </div>
          <div dir="ltr" className="flex items-end gap-8 font-display text-end">
            <div>
              <div className="text-xs tracking-[0.2em] text-mute">PIECES</div>
              <div className="text-4xl font-bold">{pad(items.length)}</div>
            </div>
            <div>
              <div className="text-xs tracking-[0.2em] text-mute">EDITION</div>
              <div className="text-4xl font-bold text-brand">/050</div>
            </div>
          </div>
        </Reveal>

        {/* Filter chips */}
        <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {chips.map((c) => {
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilter(c.key)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  active ? "border-brand bg-brand text-white" : "border-line-light bg-white hover:border-brand hover:text-brand"
                } ${c.latin ? "font-display text-xs tracking-wide" : ""}`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Grid with 1px architectural gutters */}
        {items.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-px border border-line-light bg-line-light lg:grid-cols-3">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState label={filter === "all" ? "الدروب" : labelOf(filter)} />
        )}
      </div>
    </section>
  );
}

function ProductCard({ product: p, index }: { product: Product; index: number }) {
  const { openQuickView, addToCart, labelOf, wa } = useShop();
  const soldOut = p.stockStatus === "SOLD_OUT";

  const onAdd = () => {
    if (soldOut) return;
    // Sized pieces need a size → open quick view; one-size pieces go straight in.
    if (p.sizes?.length) openQuickView(p);
    else addToCart({ productId: p.id, name: p.name, price: p.price, image: p.image });
  };

  return (
    <Reveal as="article" delay={(index % 3) * 90} className="group relative flex flex-col bg-chalk">
      <div className="relative aspect-[4/5] overflow-hidden bg-chalk-2">
        <SmartImage
          id={p.image}
          alt={p.name}
          w={900}
          className="absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
        />
        <SmartImage
          id={p.altImage}
          alt=""
          w={900}
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />

        {/* Edition tag */}
        <span dir="ltr" className="absolute left-3 top-3 bg-ink/85 px-2 py-1 font-display text-[11px] font-bold tracking-widest text-chalk backdrop-blur">
          {pad(p.edition[0], 3)} / {pad(p.edition[1], 3)}
        </span>
        {p.badge && (
          <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 font-display text-[11px] font-bold ${badgeClass(p.badge)}`}>
            {p.badge}
          </span>
        )}

        {p.stockStatus && p.stockStatus !== "IN_STOCK" && (
          <span
            className={`absolute bottom-16 right-3 rounded-full px-2.5 py-1 text-[11px] font-bold sm:bottom-3 ${
              soldOut ? "bg-ink text-white" : "bg-white text-brand ring-1 ring-brand"
            }`}
          >
            {STOCK_LABELS[p.stockStatus]}
          </span>
        )}

        {/* Quick view */}
        <button
          type="button"
          onClick={() => openQuickView(p)}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-chalk/95 py-2.5 text-sm font-bold text-ink backdrop-blur transition-all duration-500 ease-out-expo hover:bg-brand hover:text-white sm:translate-y-[150%] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:translate-y-0 sm:focus-visible:opacity-100"
        >
          <EyeIcon className="h-4 w-4" />
          استعراض سريع
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-mute">
              <span dir="ltr" className="font-display">{p.code}</span> · {labelOf(p.category)}
            </div>
            <h3 dir="auto" className="mt-1 text-right font-display text-sm font-bold uppercase leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-lg">{p.name}</h3>
          </div>
          <div className="shrink-0 text-sm font-black text-brand sm:text-lg">{formatPrice(p.price)}</div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            type="button"
            onClick={onAdd}
            disabled={soldOut}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:bg-mute sm:text-sm"
          >
            <BagIcon className="h-4 w-4" />
            {soldOut ? "خلصت" : "أضف للسلة"}
          </button>
          <a
            href={wa(productWaText(p))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`اطلب ${p.name} عالواتساب`}
            title="اطلب عالواتساب"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-light text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

function EmptyState({ label }: { label: string }) {
  const { wa } = useShop();
  return (
    <div className="mt-8 grid place-items-center border border-dashed border-line-light bg-white px-6 py-20 text-center">
      <div dir="ltr" className="font-display text-sm tracking-[0.3em] text-brand">COMING SOON</div>
      <h3 className="mt-4 text-3xl font-black sm:text-4xl">{label} — الدروب الجاي قريب</h3>
      <p className="mt-3 max-w-md text-mute">
        القسم هذا يتجهز توا. تبي حاجة معينة؟ ابعتلنا عالواتساب ونلقوهالك.
      </p>
      <a
        href={wa(`السلام عليكم TAR7A 👋\nنبي نسأل على قسم: ${label}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-hover"
      >
        <WhatsAppIcon className="h-5 w-5" />
        اسألنا عالواتساب
      </a>
    </div>
  );
}
