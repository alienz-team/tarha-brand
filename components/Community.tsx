import { COMMUNITY_SHOTS, FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/data";
import { Eyebrow, FacebookIcon, InstagramIcon, Reveal, SmartImage } from "./ui";

export function Community() {
  return (
    <section id="community" className="bg-ink py-20 text-chalk sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow index="06" dark>
              Community Wall
            </Eyebrow>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="mt-5 block text-end font-display text-6xl font-bold tracking-[-0.04em] transition-colors hover:text-brand sm:text-8xl lg:text-start"
            >
              @tarha77
            </a>
            <p className="mt-4 max-w-md text-mute-dark">طرحاتكم وطرحاتنا. صوّر طرحتك وتاقنا — ممكن تطلع هني.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-hover"
            >
              <InstagramIcon />
              تابعنا على إنستغرام
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-dark px-6 py-3 font-bold transition-colors hover:border-chalk"
            >
              <FacebookIcon />
              فيسبوك
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-px border border-line-dark bg-line-dark md:grid-cols-3 lg:grid-cols-6">
          {COMMUNITY_SHOTS.map((id, i) => (
            <Reveal key={id} delay={i * 70} className="bg-ink">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`منشور ${i + 1} على إنستغرام @tarha77`}
                className="group relative block aspect-square overflow-hidden"
              >
                <SmartImage id={id} alt="" w={600} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 grid place-items-center bg-brand/0 transition-colors duration-500 group-hover:bg-brand/75">
                  <InstagramIcon className="h-8 w-8 scale-75 text-white opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
