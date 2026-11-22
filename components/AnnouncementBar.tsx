export function AnnouncementBar({ items }: { items: string[] }) {
  const ITEMS = items.length ? items : ["طرحتك تجيك لاعندك"];
  // Content repeated so the -50% loop is seamless; track forced LTR so the motion is predictable in RTL.
  const group = Array.from({ length: 4 }, () => ITEMS).flat();
  return (
    <div className="relative z-50 h-9 overflow-hidden border-b border-line-dark bg-ink text-[13px] font-semibold text-chalk">
      <div dir="ltr" className="marquee-track flex h-full w-max animate-marquee items-center">
        {[0, 1].map((dup) => (
          <div key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center">
            {group.map((t, i) => (
              <span key={i} dir="rtl" className="flex items-center gap-6 px-6 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rotate-45 bg-brand" />
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
