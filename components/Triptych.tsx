"use client";

import { useState } from "react";
import { SOUNDCLOUD_URL, type CategoryKey } from "@/lib/data";
import { useShop } from "./ShopProvider";
import { Eyebrow, PauseIcon, PlayIcon, Reveal, SmartImage } from "./ui";

const PANELS: { n: string; en: string; ar: string; image: string; filter: CategoryKey }[] = [
  { n: "01", en: "HOODIES & SHIRTS", ar: "هوديات وتيشرتات مرسومة باليد", image: "1578768079052-aa76e52ff62e", filter: "art-apparel" },
  { n: "02", en: "ART SHOES", ar: "سبيدروات وإير فورس بالرسم", image: "1595950653106-6c9ebd614d3a", filter: "art-shoes" },
  { n: "03", en: "ON REQUEST", ar: "فكرتك على قطعتك — حسب الطلب", image: "1576566588028-4147f3842f27", filter: "custom" },
];

const TRACKS = [
  { title: "Street Sessions Vol.1", by: "TAR7A RADIO", time: "3:42" },
  { title: "Tripoli Nights", by: "TAR7A RADIO", time: "4:05" },
  { title: "Paint & Drip", by: "TAR7A RADIO", time: "2:58" },
];

// Deterministic bar heights/delays → identical on server and client
const BARS = Array.from({ length: 40 }, (_, i) => ({
  h: 30 + ((i * 37) % 70),
  d: ((i * 53) % 100) / 100,
}));

export function Triptych() {
  const { shopCategory } = useShop();
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);

  return (
    <section id="art" className="scroll-mt-20 bg-chalk py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow index="04">Spotlight</Eyebrow>
            <h2 dir="ltr" className="mt-5 text-end font-display text-6xl font-bold leading-[0.9] tracking-[-0.04em] sm:text-[8.5rem] lg:text-start">
              TARHA <span className="text-brand">ART</span>
            </h2>
          </div>
          <p className="max-w-sm text-base font-medium text-mute">
            كل قطعة تترسم باليد في طرابلس. ما فيش طباعة، ما فيش نسخ — قطعتك تبقى ليك بروحك.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px border border-line-light bg-line-light md:grid-cols-3">
          {PANELS.map((p, i) => (
            <Reveal key={p.n} delay={i * 120} className="bg-chalk">
              <button type="button" onClick={() => shopCategory(p.filter)} className="group block w-full text-start">
                <div className={`relative overflow-hidden ${i === 1 ? "aspect-[3/4] md:aspect-[3/4.6]" : "aspect-[3/4]"}`}>
                  <SmartImage id={p.image} alt={p.ar} w={900} className="absolute inset-0 h-full w-full grayscale-[35%] transition-all duration-[1200ms] ease-out-expo group-hover:scale-105 group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span dir="ltr" className="absolute start-4 top-4 font-display text-sm font-bold text-white">({p.n})</span>
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-brand p-4 text-white transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                    <span className="text-sm font-bold">تسوق القسم ↖</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <div dir="ltr" className="text-end font-display text-xl font-bold tracking-tight">{p.en}</div>
                    <div className="mt-1 text-sm text-mute">{p.ar}</div>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* SoundCloud vibe strip */}
        <Reveal className="mt-6">
          <div className="relative overflow-hidden rounded-3xl border border-line-dark bg-ink text-chalk">
            <div className="absolute -start-20 -top-20 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
              <div className="flex items-center gap-5 lg:col-span-4">
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  aria-label={playing ? "وقف" : "شغل"}
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand text-white shadow-[0_0_40px_-6px_rgba(59,130,246,0.8)] transition-transform hover:scale-105"
                >
                  {playing ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-mute-dark">
                    <span dir="ltr" className="font-display tracking-[0.2em]">SOUNDCLOUD</span>
                    <span>· فايب الشارع</span>
                  </div>
                  <div dir="ltr" className="mt-1 truncate text-end font-display text-xl font-bold">{TRACKS[track].title}</div>
                  <div dir="ltr" className="text-end font-display text-sm text-brand">{TRACKS[track].by}</div>
                </div>
              </div>

              <div className={`flex h-20 items-end gap-[3px] lg:col-span-5 ${playing ? "" : "eq-paused"}`} aria-hidden>
                {BARS.map((b, i) => (
                  <span
                    key={i}
                    className={`eq-bar flex-1 rounded-full ${i % 5 === 0 ? "bg-glow" : "bg-brand"}`}
                    style={{ height: `${b.h}%`, animationDelay: `-${b.d}s`, opacity: playing ? 1 : 0.45 }}
                  />
                ))}
              </div>

              <div className="lg:col-span-3">
                <ol className="space-y-1">
                  {TRACKS.map((t, i) => (
                    <li key={t.title}>
                      <button
                        type="button"
                        onClick={() => {
                          setTrack(i);
                          setPlaying(true);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/5 ${
                          track === i ? "text-brand" : "text-chalk/70"
                        }`}
                      >
                        <span dir="ltr" className="font-display">{t.time}</span>
                        <span dir="ltr" className="font-display font-semibold">{t.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <a
                  href={SOUNDCLOUD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-3 text-sm font-bold text-chalk hover:text-brand"
                >
                  اسمع عالساوند كلاود ↖
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
