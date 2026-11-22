"use client";

import { useEffect, useState } from "react";
import { pad } from "@/lib/data";
import { useShop } from "./ShopProvider";
import { BagIcon, CloseIcon, Logo, MenuIcon, SearchIcon } from "./ui";

export const NAV = [
  { href: "#categories", label: "ركب طرحتك" },
  { href: "#drop", label: "خت فت" },
  { href: "#art", label: "TARHA ART", latin: true },
  { href: "#studio", label: "صمم قطعتك" },
  { href: "#about", label: "من حني؟" },
  { href: "#contact", label: "كلمنا" },
];

export function Header() {
  const { count, setCartOpen, setSearchOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 z-40 px-3 transition-[top] duration-500 ease-out-expo sm:px-6 ${
        scrolled ? "top-3" : "top-12"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border px-4 py-2.5 backdrop-blur-xl transition-colors duration-500 sm:px-6 ${
          scrolled
            ? "border-line-light bg-chalk/85 text-ink shadow-[0_10px_40px_-20px_rgba(10,11,14,0.35)]"
            : "border-white/10 bg-ink/40 text-chalk"
        }`}
      >
        <a href="#hero" className="text-base sm:text-lg" aria-label="TAR7A | طرحه — الرئيسية">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors hover:bg-brand hover:text-white ${
                l.latin ? "font-display tracking-wide" : ""
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-brand hover:text-white"
            aria-label="بحث"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="group flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-3.5 text-sm font-bold text-white sm:gap-2 sm:px-4 transition-colors hover:bg-brand-hover"
            aria-label={`السلة، ${count} قطع`}
          >
            <BagIcon className="h-4 w-4" />
            <span>السلة</span>
            <span dir="ltr" className="font-display tabular-nums">
              / {pad(count)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-brand hover:text-white lg:hidden"
            aria-label="القائمة"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-line-dark bg-ink text-chalk transition-all duration-500 ease-out-expo lg:hidden ${
          menuOpen ? "max-h-[480px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-3" aria-label="قائمة الجوال">
          {NAV.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b border-line-dark px-3 py-4 text-xl font-bold last:border-0 hover:text-brand"
            >
              <span className={l.latin ? "font-display" : ""}>{l.label}</span>
              <span dir="ltr" className="font-display text-xs text-mute-dark">
                {pad(i + 1)}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
