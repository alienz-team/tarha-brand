"use client";

import { img, pad } from "@/lib/data";
import { useShop } from "./ShopProvider";
import { Eyebrow, Reveal } from "./ui";

export function CategoryRows() {
  const { shopCategory, filter, featuredCategories: CATEGORIES, productsIn } = useShop();

  return (
    <section id="categories" className="relative scroll-mt-24 bg-chalk">
      {/* Kinetic black band */}
      <div className="overflow-hidden border-y border-line-dark bg-ink py-5 text-chalk">
        <div dir="ltr" className="marquee-track flex w-max animate-marquee items-center" style={{ animationDuration: "55s" }}>
          {[0, 1].map((dup) => (
            <div key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center">
              {CATEGORIES.map((c) => (
                <span key={c.key} className="flex items-center gap-8 px-8 whitespace-nowrap">
                  <span dir="rtl" className={`text-4xl font-black sm:text-6xl ${c.latin ? "font-display tracking-tight" : ""}`}>
                    {c.label}
                  </span>
                  <span className="text-2xl text-brand sm:text-4xl">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
        <Reveal className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow index="01">الأقسام</Eyebrow>
            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
              ركب طرحتك
              <span className="text-brand">.</span>
            </h2>
          </div>
          <p className="max-w-sm text-base font-medium text-mute">
            اختار القسم والقطع تتفلتر تحت مباشرة. من السبيدرو للطاقية — كل حاجة تلقاها في مكان واحد.
          </p>
        </Reveal>

        <ul className="border-t border-line-light">
          {CATEGORIES.map((c, i) => {
            const count = productsIn(c.key).length;
            const active = filter === c.key;
            return (
              <li key={c.key} className="border-b border-line-light">
                <button
                  type="button"
                  onClick={() => shopCategory(c.key)}
                  aria-pressed={active}
                  className="group relative block w-full overflow-hidden text-start"
                >
                  {/* Resting row */}
                  <div className="relative z-0 flex items-center gap-4 px-1 py-5 transition-opacity duration-300 group-hover:opacity-0 sm:gap-8 sm:py-7">
                    <span dir="ltr" className={`w-10 font-display text-sm font-semibold ${active ? "text-brand" : "text-mute"}`}>
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`flex-1 text-3xl font-black leading-none sm:text-5xl ${c.latin ? "font-display tracking-tight" : ""} ${
                        active ? "text-brand" : ""
                      }`}
                    >
                      {c.label}
                    </span>
                    <span className="hidden text-sm font-semibold text-mute sm:inline">
                      {count > 0 ? (
                        <>
                          <span dir="ltr" className="font-display">{pad(count)}</span> قطع
                        </>
                      ) : (
                        "قريب"
                      )}
                    </span>
                    <span className={`grid h-10 w-10 place-items-center rounded-full border ${active ? "border-brand bg-brand text-white" : "border-line-light"}`}>
                      ↖
                    </span>
                  </div>

                  {/* Hover takeover: blue kinetic marquee */}
                  <div
                    aria-hidden
                    className="absolute inset-0 z-10 flex translate-y-full items-center overflow-hidden bg-brand text-white transition-transform duration-500 ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0"
                  >
                    <div dir="ltr" className="flex w-max animate-marquee-fast items-center">
                      {Array.from({ length: 8 }).map((_, k) => (
                        <span key={k} className="flex items-center gap-6 px-6 whitespace-nowrap">
                          <span dir="rtl" className={`text-3xl font-black sm:text-5xl ${c.latin ? "font-display tracking-tight" : ""}`}>
                            {c.label}
                          </span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img(c.image, 240)}
                            alt=""
                            loading="lazy"
                            className="h-10 w-16 rounded-full object-cover sm:h-14 sm:w-24"
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
