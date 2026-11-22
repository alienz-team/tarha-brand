import { ABOUT_COPY } from "@/lib/data";
import { Eyebrow, Reveal } from "./ui";

const FACTS = [
  { k: "طرابلس", v: "ليبيا — من هنا نبدو" },
  { k: "رسم يدوي", v: "كل قطعة تترسم باليد" },
  { k: "توصيل", v: "طرحتك تجيك لاعندك" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-line-light bg-chalk py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow index="05">About</Eyebrow>
          <h2 className="mt-5 whitespace-nowrap text-6xl font-black leading-none sm:text-7xl xl:text-8xl">
            من حني<span className="text-brand">؟</span>
          </h2>
          <div dir="ltr" className="mt-8 text-end font-display text-sm tracking-[0.25em] text-mute lg:text-start">
            TAR7A — EST. TRIPOLI
          </div>
        </Reveal>

        <div className="lg:col-span-8">
          <Reveal delay={120}>
            <blockquote className="relative border-s-2 border-brand ps-6 text-2xl font-bold leading-[1.75] sm:ps-10 sm:text-[2rem]">
              <span aria-hidden className="absolute -top-8 start-4 font-display text-7xl leading-none text-brand/20 sm:start-8">
                “
              </span>
              {ABOUT_COPY}
            </blockquote>
          </Reveal>

          <Reveal delay={220} className="mt-14 grid grid-cols-1 border-y border-line-light sm:grid-cols-3">
            {FACTS.map((f, i) => (
              <div key={f.k} className="border-b border-line-light py-6 last:border-b-0 sm:border-b-0 sm:border-e sm:px-6 sm:first:ps-0 sm:last:border-e-0">
                <div dir="ltr" className="text-end font-display text-xs font-semibold text-brand">
                  0{i + 1}
                </div>
                <div className="mt-2 text-2xl font-black">{f.k}</div>
                <div className="mt-1 text-sm text-mute">{f.v}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
