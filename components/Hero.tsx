"use client";

import { useEffect, useState } from "react";
import { LOOKS as ALL_LOOKS, formatPrice, img, pad } from "@/lib/data";
import { useShop } from "./ShopProvider";
import { EyeIcon } from "./ui";

export function Hero() {
  const { openQuickView, getProduct } = useShop();
  // Only feature looks whose product is still published
  const LOOKS = ALL_LOOKS.filter((l) => getProduct(l.productId));
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance the lookbook (client-only effect → no hydration impact)
  useEffect(() => {
    if (paused || LOOKS.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % LOOKS.length), 6500);
    return () => clearInterval(t);
  }, [paused, LOOKS.length]);

  const look = LOOKS[active] ?? LOOKS[0];
  const product = look ? getProduct(look.productId) : undefined;
  if (!look || !product) return <HeroFallback />;

  return (
    <section id="hero" className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-chalk">
      {/* Background looks, cross-faded */}
      {LOOKS.map((l, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={l.image}
          src={img(l.image, 2000)}
          alt=""
          aria-hidden
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-[opacity,transform] duration-[1600ms] ease-out-expo ${
            i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink/80 via-transparent to-transparent" />

      {/* Architectural grid lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 mx-auto grid max-w-7xl grid-cols-4 px-4 sm:px-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border-s border-white/[0.07] last:border-e" />
        ))}
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-8 pt-40 sm:px-6 sm:pb-10">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          {/* Headline block */}
          <div className="hero-in lg:col-span-8">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
                <span className="live-dot h-2 w-2 rounded-full bg-brand" />
                دروب جديد متوفر
              </span>
              <span dir="ltr" className="font-display tracking-[0.25em] text-chalk/60">
                DROP 07 — TRIPOLI, LY
              </span>
            </div>
            <h1 className="text-[clamp(2.9rem,8.6vw,8rem)] font-black leading-[0.98] tracking-tight">
              أقوى مكان
              <br />
              تركب فيه <span className="text-brand">طرحتك</span>
            </h1>
            <p className="mt-5 max-w-md text-lg font-semibold text-chalk/75 sm:text-xl">طرحتك تجيك لاعندك</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#drop"
                className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-base font-bold text-white shadow-[0_0_40px_-6px_rgba(59,130,246,0.6)] transition-all hover:bg-brand-hover hover:shadow-[0_0_50px_-4px_rgba(59,130,246,0.85)]"
              >
                ركب طرحتك
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
              <a
                href="#studio"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-base font-bold transition-colors hover:border-brand hover:text-brand"
              >
                صمم قطعتك
              </a>
            </div>
          </div>

          {/* Stat callouts */}
          <div className="grid grid-cols-2 border border-white/10 bg-ink/30 backdrop-blur-md lg:col-span-4">
            <div className="border-e border-white/10 p-5">
              <div dir="ltr" className="text-end font-display text-3xl font-bold text-brand">
                100%
              </div>
              <div className="mt-2 text-sm font-bold">رسم يدوي حسب الطلب</div>
            </div>
            <div className="p-5">
              <div dir="ltr" className="text-end font-display text-3xl font-bold">
                /050
              </div>
              <div className="mt-2 text-sm font-bold">إصدارات محدودة</div>
            </div>
          </div>
        </div>

        {/* Compact "في الصورة" card for small screens */}
        <button
          type="button"
          onClick={() => openQuickView(product)}
          className="mt-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-2.5 text-start backdrop-blur-xl md:hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(product.image, 200)} alt="" className="h-14 w-14 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-chalk/70">
              <span dir="ltr" className="font-display">LOOK {pad(active + 1)}</span> / في الصورة
            </div>
            <div dir="ltr" className="truncate text-end font-display text-sm font-bold">{product.name}</div>
            <div className="text-xs font-bold text-brand">{formatPrice(product.price)}</div>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white">
            <EyeIcon className="h-4 w-4" />
          </span>
        </button>

        {/* Bottom rail: lookbook strip */}
        <div
          className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex items-center gap-3 text-xs font-semibold text-chalk/60">
            <span dir="ltr" className="font-display tracking-[0.2em]">
              LOOKBOOK
            </span>
            <span className="h-px w-8 bg-white/20" />
            <span>شوف الطرحات</span>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {LOOKS.map((l, i) => (
              <button
                key={l.image}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Look ${pad(i + 1)}`}
                aria-pressed={i === active}
                className={`group relative h-16 w-24 shrink-0 overflow-hidden border transition-all duration-500 sm:h-20 sm:w-28 ${
                  i === active ? "border-brand" : "border-white/15 opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(l.image, 300)} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <span
                  dir="ltr"
                  className={`absolute bottom-1 start-1 font-display text-[11px] font-bold ${i === active ? "bg-brand px-1 text-white" : "text-white"}`}
                >
                  {pad(i + 1)}
                </span>
                {i === active && !paused && (
                  <span
                    key={`p-${active}`}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-right bg-brand"
                    style={{ animation: "progress 6.5s linear both" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating "Look 0X / في الصورة" glass card */}
      <button
        type="button"
        onClick={() => openQuickView(product)}
        className="group absolute end-4 top-32 z-10 hidden w-64 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-3 text-start text-chalk shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-brand sm:end-6 md:block lg:top-40 xl:end-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span dir="ltr" className="font-display tracking-[0.15em] text-chalk/70">
            LOOK {pad(active + 1)}
          </span>
          <span className="rounded-full bg-brand px-2 py-0.5 text-white">في الصورة</span>
        </div>
        <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={product.id}
            src={img(product.image, 600)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div dir="ltr" className="text-end font-display text-sm font-bold tracking-tight">
              {product.name}
            </div>
            <div className="text-xs font-bold text-brand">{formatPrice(product.price)}</div>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-chalk text-ink transition-colors group-hover:bg-brand group-hover:text-white">
            <EyeIcon className="h-4 w-4" />
          </span>
        </div>
      </button>

    </section>
  );
}

function HeroFallback() {
  return (
    <section id="hero" className="relative grid min-h-[100svh] place-items-end overflow-hidden bg-ink px-4 pb-16 pt-40 text-chalk sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-[clamp(2.9rem,8.6vw,8rem)] font-black leading-[0.98] tracking-tight">
          أقوى مكان
          <br />
          تركب فيه <span className="text-brand">طرحتك</span>
        </h1>
        <p className="mt-5 text-lg font-semibold text-chalk/75 sm:text-xl">طرحتك تجيك لاعندك</p>
        <a href="#drop" className="mt-8 inline-flex rounded-full bg-brand px-7 py-4 font-bold text-white hover:bg-brand-hover">
          ركب طرحتك ↗
        </a>
      </div>
    </section>
  );
}
