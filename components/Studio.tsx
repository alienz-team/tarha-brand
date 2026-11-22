"use client";

import { useState } from "react";
import { STUDIO_COLORS, STUDIO_IDEAS, STUDIO_PIECES, formatPrice } from "@/lib/data";
import { saveCustomArtOrder } from "@/app/actions";
import { useShop } from "./ShopProvider";
import { BagIcon, Eyebrow, MinusIcon, PlusIcon, Reveal, WhatsAppIcon } from "./ui";

type Kind = (typeof STUDIO_PIECES)[number]["kind"];

export function Studio() {
  const { addToCart, setCartOpen, wa, acceptOrders } = useShop();
  const [pieceId, setPieceId] = useState(STUDIO_PIECES[0].id);
  const [colorId, setColorId] = useState(STUDIO_COLORS[0].id);
  const [size, setSize] = useState("L");
  const [ideaId, setIdeaId] = useState(STUDIO_IDEAS[0].id);
  const [details, setDetails] = useState("");
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const piece = STUDIO_PIECES.find((p) => p.id === pieceId)!;
  const color = STUDIO_COLORS.find((c) => c.id === colorId)!;
  const idea = STUDIO_IDEAS.find((i) => i.id === ideaId)!;
  const total = piece.price * qty;

  const choosePiece = (id: string) => {
    const next = STUDIO_PIECES.find((p) => p.id === id)!;
    setPieceId(id);
    if (!next.sizes.includes(size)) setSize(next.kind === "shoes" ? "42" : "L");
  };

  const message = [
    "السلام عليكم TAR7A 🎨",
    "نبي نصمم قطعة من TARHA ART Studio:",
    `• القطعة: ${piece.label} (${formatPrice(piece.price)})`,
    `• اللون: ${color.label}`,
    `• المقاس: ${size}`,
    `• فكرة الرسم: ${idea.label}`,
    details.trim() ? `• التفاصيل: ${details.trim()}` : null,
    `• الكمية: ${qty}`,
    `• المجموع: ${formatPrice(total)}`,
    customerName.trim() ? `• الاسم: ${customerName.trim()}` : null,
    phone.trim() ? `• الهاتف: ${phone.trim()}` : null,
    city.trim() ? `• المدينة: ${city.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const addStudioPiece = () => {
    addToCart(
      {
        productId: `studio-${piece.id}`,
        name: piece.label,
        price: piece.price,
        image: piece.kind === "shoes" ? "1595950653106-6c9ebd614d3a" : piece.kind === "shirt" ? "1618354691373-d851c5c3a990" : "1620799140408-edc6dcb6d633",
        size,
        color: color.label,
        note: `${idea.label}${details.trim() ? ` — ${details.trim()}` : ""}`,
      },
      qty,
    );
    setCartOpen(true);
  };

  return (
    <section id="studio" className="scroll-mt-20 bg-ink py-20 text-chalk sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow index="03" dark>
              صمم قطعتك
            </Eyebrow>
            <h2 className="mt-5 text-5xl font-black leading-none sm:text-7xl">
              <span dir="ltr" className="inline-block font-display tracking-tight">
                TARHA ART <span className="text-brand">Studio</span>
              </span>
            </h2>
          </div>
          <p className="max-w-md text-base font-medium text-mute-dark">
            Make Your Hoodie, Shirt &amp; Shoes — اختار القطعة واللون والمقاس وفكرة الرسم، وابعتها عالواتساب. الرسم يدوي <span dir="ltr" className="font-display">100%</span>.
          </p>
        </Reveal>

        <div className="mt-12 grid overflow-hidden rounded-3xl border border-line-dark lg:grid-cols-12">
          {/* Live preview */}
          <div className="relative flex flex-col justify-between gap-8 border-b border-line-dark bg-ink-2 p-6 sm:p-10 lg:col-span-6 lg:border-b-0 lg:border-e">
            <div className="flex items-center justify-between text-xs font-semibold text-mute-dark">
              <span dir="ltr" className="font-display tracking-[0.2em]">LIVE PREVIEW</span>
              <span className="flex items-center gap-2">
                <span className="live-dot h-2 w-2 rounded-full bg-brand" /> معاينة مباشرة
              </span>
            </div>

            <div className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center">
              <div className="absolute inset-6 rounded-full bg-brand/20 blur-3xl" />
              <PieceSvg kind={piece.kind} fill={color.hex} />
              <span
                dir="ltr"
                key={idea.id + piece.kind}
                className={`absolute -rotate-6 rounded-md border-2 border-ink bg-brand px-3 py-1 font-display text-sm font-bold tracking-widest text-white shadow-lg ${
                  piece.kind === "shoes" ? "top-[38%]" : "top-[46%]"
                }`}
                style={{ animation: "fade-up .5s var(--ease-out-expo) both" }}
              >
                {idea.en}
              </span>
            </div>

            <dl className="grid grid-cols-2 border-t border-line-dark text-sm sm:grid-cols-4">
              {[
                ["القطعة", piece.label],
                ["اللون", color.label],
                ["المقاس", size],
                ["الفكرة", idea.label],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-line-dark py-3 pe-3 sm:border-b-0">
                  <dt className="text-xs text-mute-dark">{k}</dt>
                  <dd className="mt-1 truncate font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-8 p-6 sm:p-10 lg:col-span-6">
            <Step n="01" title="القطعة">
              <div className="grid gap-2 sm:grid-cols-3">
                {STUDIO_PIECES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => choosePiece(p.id)}
                    aria-pressed={pieceId === p.id}
                    className={`rounded-2xl border p-4 text-start transition-colors ${
                      pieceId === p.id ? "border-brand bg-brand text-white" : "border-line-dark hover:border-brand"
                    }`}
                  >
                    <div dir="ltr" className="text-end font-display text-sm font-bold">{p.label}</div>
                    <div className={`mt-1 text-sm font-bold ${pieceId === p.id ? "text-white/80" : "text-brand"}`}>{formatPrice(p.price)}</div>
                  </button>
                ))}
              </div>
            </Step>

            <Step n="02" title="اللون">
              <div className="flex flex-wrap gap-3">
                {STUDIO_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorId(c.id)}
                    aria-pressed={colorId === c.id}
                    className={`flex items-center gap-2 rounded-full border py-1.5 pe-4 ps-1.5 text-sm font-bold transition-colors ${
                      colorId === c.id ? "border-brand" : "border-line-dark hover:border-chalk/40"
                    }`}
                  >
                    <span className="h-7 w-7 rounded-full ring-1 ring-white/20" style={{ background: c.hex }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </Step>

            <Step n="03" title={piece.kind === "shoes" ? "مقاس السبيدرو" : "المقاس"}>
              <div className="flex flex-wrap gap-2">
                {piece.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`min-w-12 rounded-full border px-4 py-2 font-display text-sm font-bold transition-colors ${
                      size === s ? "border-brand bg-brand text-white" : "border-line-dark hover:border-brand"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Step>

            <Step n="04" title="فكرة الرسم / التصميم">
              <div className="flex flex-wrap gap-2">
                {STUDIO_IDEAS.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => setIdeaId(i.id)}
                    aria-pressed={ideaId === i.id}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                      ideaId === i.id ? "border-brand bg-brand text-white" : "border-line-dark hover:border-brand"
                    }`}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder={ideaId === "own" ? "وصف فكرتك: الشخصية، الألوان، المكان على القطعة…" : "تفاصيل زيادة (اختياري): اسم الأنمي أو المسلسل، الشخصية…"}
                className="mt-3 w-full resize-none rounded-2xl border border-line-dark bg-ink-2 p-4 text-sm text-chalk placeholder:text-mute-dark focus:border-brand focus:outline-none"
              />
            </Step>

            <Step n="05" title="بياناتك (اختياري)">
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { v: customerName, set: setCustomerName, ph: "الاسم", ac: "name" },
                  { v: phone, set: setPhone, ph: "رقم الهاتف", ac: "tel" },
                  { v: city, set: setCity, ph: "المدينة / المنطقة", ac: "address-level2" },
                ].map((f) => (
                  <input
                    key={f.ph}
                    value={f.v}
                    onChange={(e) => f.set(e.target.value)}
                    placeholder={f.ph}
                    autoComplete={f.ac}
                    maxLength={120}
                    className="rounded-xl border border-line-dark bg-ink-2 px-3 py-2.5 text-sm text-chalk placeholder:text-mute-dark focus:border-brand focus:outline-none"
                  />
                ))}
              </div>
            </Step>

            <div className="mt-auto flex flex-col gap-4 border-t border-line-dark pt-6">
              {!acceptOrders && (
                <p className="rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm font-semibold">
                  الطلبات الجديدة موقفة مؤقتاً — كلمنا عالواتساب ونرتبوا معاك.
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-full border border-line-dark">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center" aria-label="نقص">
                    <MinusIcon />
                  </button>
                  <span className="w-8 text-center font-display font-bold tabular-nums">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center" aria-label="زيد">
                    <PlusIcon />
                  </button>
                </div>
                <div className="text-end">
                  <div className="text-xs text-mute-dark">السعر المباشر</div>
                  <div className="text-3xl font-black text-brand" aria-live="polite">{formatPrice(total)}</div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={wa(message)}
                  onClick={() => {
                    // Record the request in Neon; never blocks the WhatsApp hand-off.
                    void saveCustomArtOrder({
                      pieceId: piece.id,
                      color: color.label,
                      size,
                      idea: idea.label,
                      details,
                      qty,
                      customerName,
                      phone,
                      city,
                      source: "studio",
                    }).catch(() => {});
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-4 font-bold text-white shadow-[0_0_40px_-8px_rgba(59,130,246,0.7)] transition-colors hover:bg-brand-hover"
                >
                  <WhatsAppIcon />
                  ابعت تصميمك عالواتساب
                </a>
                <button
                  type="button"
                  onClick={addStudioPiece}
                  className="flex items-center justify-center gap-2 rounded-full border border-line-dark px-6 py-4 font-bold transition-colors hover:border-chalk"
                >
                  <BagIcon className="h-5 w-5" />
                  أضف للسلة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-3 text-sm font-bold">
        <span dir="ltr" className="font-display text-brand">{n}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function PieceSvg({ kind, fill }: { kind: Kind; fill: string }) {
  const stroke = "#3B82F6";
  const common = "relative w-[78%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)] transition-all duration-500";
  if (kind === "shoes") {
    return (
      <svg viewBox="0 0 240 140" className={common} aria-label="سبيدرو">
        <path d="M14 96 Q12 64 40 60 L96 50 Q126 26 160 52 L214 80 Q232 88 228 104 L14 104 Z" fill={fill} stroke={stroke} strokeWidth="2" style={{ transition: "fill .5s" }} />
        <rect x="10" y="104" width="222" height="16" rx="6" fill="#F4F5F7" stroke={stroke} strokeWidth="2" />
        <path d="M100 54 L118 78 M112 48 L130 72 M124 46 L142 68" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M40 86 Q90 70 150 86" stroke={stroke} strokeWidth="2" fill="none" strokeDasharray="4 5" />
      </svg>
    );
  }
  if (kind === "shirt") {
    return (
      <svg viewBox="0 0 200 210" className={common} aria-label="تيشرت">
        <path d="M70 18 Q100 40 130 18 L190 48 L172 96 L152 86 L152 200 L48 200 L48 86 L28 96 L10 48 Z" fill={fill} stroke={stroke} strokeWidth="2" style={{ transition: "fill .5s" }} />
        <path d="M70 18 Q100 46 130 18" fill="none" stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 220" className={common} aria-label="هودي">
      <path d="M62 34 Q66 4 100 4 Q134 4 138 34 L152 38 L192 80 L176 128 L156 114 L156 212 L44 212 L44 114 L24 128 L8 80 L48 38 Z" fill={fill} stroke={stroke} strokeWidth="2" style={{ transition: "fill .5s" }} />
      <path d="M62 34 Q100 70 138 34" fill="none" stroke={stroke} strokeWidth="2" />
      <path d="M92 52 L90 80 M108 52 L110 80" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M66 160 H134 L126 192 H74 Z" fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}
