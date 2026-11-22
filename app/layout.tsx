import type { Metadata, Viewport } from "next";
import { Cairo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TAR7A | طرحه — أقوى مكان تركب فيه طرحتك",
  description:
    "TAR7A | طرحه — ستريت وير ورسم يدوي حسب الطلب من طرابلس. TARHA ART هوديات، تيشرتات وسبيدروات مرسومة باليد. طرحتك تجيك لاعندك.",
  openGraph: {
    title: "TAR7A | طرحه",
    description: "أقوى مكان تركب فيه طرحتك — طرحتك تجيك لاعندك",
    locale: "ar_LY",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0B0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${grotesk.variable}`}>
      <body className="bg-chalk font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
