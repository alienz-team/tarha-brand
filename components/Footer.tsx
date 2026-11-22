"use client";

import { FACEBOOK_URL, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/data";
import { NAV } from "./Header";
import { useShop } from "./ShopProvider";
import { FacebookIcon, InstagramIcon, Logo, WhatsAppIcon } from "./ui";

export function Footer() {
  const { shopCategory, featuredCategories: CATEGORIES, wa: waLink } = useShop();

  return (
    <footer id="contact" className="scroll-mt-20 border-t border-line-dark bg-ink text-chalk">
      {/* CTA band */}
      <div className="mx-auto grid max-w-7xl gap-8 border-x border-line-dark px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-end">
        <h2 className="text-5xl font-black leading-[1.05] sm:text-7xl">
          كلمنا<span className="text-brand">.</span>
          <br />
          <span className="text-chalk/50">طرحتك تجيك لاعندك</span>
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <a
            href={waLink("السلام عليكم TAR7A 👋")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 font-bold text-white transition-colors hover:bg-brand-hover"
          >
            <WhatsAppIcon />
            كلمنا عالواتساب
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            dir="ltr"
            className="inline-flex items-center justify-center rounded-full border border-line-dark px-7 py-4 font-display font-bold transition-colors hover:border-chalk"
          >
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>

      {/* Architectural columns */}
      <div className="border-y border-line-dark">
        <div className="mx-auto grid max-w-7xl grid-cols-2 border-x border-line-dark lg:grid-cols-4">
          <div className="col-span-2 border-b border-line-dark p-6 sm:p-8 lg:col-span-1 lg:border-b-0 lg:border-e">
            <div className="text-xl">
              <Logo />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-mute-dark">
              ستريت وير ورسم يدوي حسب الطلب. أقوى مكان تركب فيه طرحتك.
            </p>
          </div>

          <FooterCol title="الموقع">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} className={`block py-1 hover:text-brand ${l.latin ? "font-display" : ""}`}>
                {l.label}
              </a>
            ))}
          </FooterCol>

          <FooterCol title="الأقسام">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => shopCategory(c.key)}
                className={`block py-1 text-start hover:text-brand ${c.latin ? "font-display text-xs" : ""}`}
              >
                {c.label}
              </button>
            ))}
          </FooterCol>

          <FooterCol title="تواصل" last>
            <p className="py-1">طرابلس، ليبيا</p>
            <a href={`tel:${PHONE_TEL}`} dir="ltr" className="block py-1 text-end font-display hover:text-brand">
              {PHONE_DISPLAY}
            </a>
            <a href={waLink("السلام عليكم TAR7A 👋")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-1 hover:text-brand">
              <WhatsAppIcon className="h-4 w-4" /> واتساب
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-1 hover:text-brand">
              <InstagramIcon className="h-4 w-4" /> <span dir="ltr" className="font-display">@tarha77</span>
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-1 hover:text-brand">
              <FacebookIcon className="h-4 w-4" /> <span dir="ltr" className="font-display">tarha777</span>
            </a>
          </FooterCol>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="mx-auto max-w-7xl overflow-hidden border-x border-line-dark px-4 pt-10 sm:px-6">
        <div dir="ltr" aria-hidden className="select-none whitespace-nowrap text-center font-display text-[22vw] font-bold leading-[0.78] tracking-[-0.06em] lg:text-[17rem]">
          <span className="text-brand">TAR7A</span>
          <span className="text-outline text-chalk/30"> طرحه</span>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 border-x border-line-dark px-4 py-5 text-xs text-mute-dark sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© TAR7A | طرحه — كل الحقوق محفوظة</span>
          <span>توصيل طرابلس وليبيا · رسم وتصميم حسب الطلب</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, last = false }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`p-6 text-sm sm:p-8 ${last ? "col-span-2 border-t border-line-dark lg:col-span-1 lg:border-t-0" : "border-e border-line-dark"}`}>
      <div className="mb-4 text-xs font-bold text-mute-dark">{title}</div>
      <div className="space-y-1 font-semibold">{children}</div>
    </div>
  );
}
