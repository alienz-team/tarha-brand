"use client";

import { useEffect, useRef, useState } from "react";
import { img } from "@/lib/data";
import { useShop } from "./ShopProvider";

// ─── Icons ────────────────────────────────────────────────────────────────

type IconProps = { className?: string };
const base = "h-5 w-5 shrink-0";

export const ArrowUpLeft = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
    <path d="M17 17 7 7M7 16V7h9" strokeLinecap="square" />
  </svg>
);
export const ArrowLeft = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
    <path d="M19 12H5m6-6-6 6 6 6" strokeLinecap="square" />
  </svg>
);
export const SearchIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" strokeLinecap="square" />
  </svg>
);
export const CloseIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="square" />
  </svg>
);
export const BagIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const EyeIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);
export const MenuIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
    <path d="M4 8h16M4 16h16" strokeLinecap="square" />
  </svg>
);
export const PlusIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
    <path d="M12 5v14M5 12h14" strokeLinecap="square" />
  </svg>
);
export const MinusIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
    <path d="M5 12h14" strokeLinecap="square" />
  </svg>
);
export const WhatsAppIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.9 9.9 0 0 0 12.04 2Zm5.8 14.03c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.66.5.24.58.82 2.01.9 2.15.07.15.12.32.02.51-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.3-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.29.14.46.12.63-.07.17-.2.73-.85.92-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 2 .95.29.14.48.22.55.34.08.12.08.69-.16 1.36Z" />
  </svg>
);
export const InstagramIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const FacebookIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.86.25-1.45 1.48-1.45h1.57V4.47A21 21 0 0 0 14.27 4.3c-2.27 0-3.82 1.38-3.82 3.93v2.27H7.9v3h2.55V21h3.05Z" />
  </svg>
);
export const PlayIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);
export const PauseIcon = ({ className = base }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
  </svg>
);

// ─── Logo ─────────────────────────────────────────────────────────────────

export function Logo({ className = "" }: { className?: string }) {
  const { hasLogo } = useShop();
  if (hasLogo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/logo.png" alt="TAR7A | طرحه" className={`h-9 w-auto ${className}`} />;
  }
  return (
    <span dir="ltr" className={`inline-flex items-center gap-2 leading-none ${className}`} aria-label="TAR7A | طرحه">
      <span className="font-display text-[1.35em] font-bold tracking-[-0.04em] text-brand">TAR7A</span>
      <span className="h-[1.1em] w-[2px] bg-current opacity-80" />
      <span className="font-sans text-[1.2em] font-black">طرحه</span>
    </span>
  );
}

// ─── Image with graceful branded fallback ─────────────────────────────────

export function SmartImage({
  id,
  alt,
  w = 1200,
  className = "",
  eager = false,
}: {
  id: string;
  alt: string;
  w?: number;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // Catch errors that fired before hydration attached onError
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#0057ff_0%,#0a0b0e_65%)] ${className}`}
      >
        <span className="font-display text-2xl font-bold tracking-tight text-chalk/80">TAR7A</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={img(id, w)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

// ─── Scroll reveal ────────────────────────────────────────────────────────

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

// ─── Section eyebrow ──────────────────────────────────────────────────────

export function Eyebrow({ index, children, dark = false }: { index: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-xs font-semibold ${dark ? "text-mute-dark" : "text-mute"}`}>
      <span dir="ltr" className="font-display tracking-[0.2em] text-brand">
        ({index})
      </span>
      <span className={`h-px w-10 ${dark ? "bg-line-dark" : "bg-line-light"}`} />
      <span>{children}</span>
    </div>
  );
}
