import { ShopProvider } from "@/components/ShopProvider";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryRows } from "@/components/CategoryRows";
import { ProductGrid } from "@/components/ProductGrid";
import { Studio } from "@/components/Studio";
import { Triptych } from "@/components/Triptych";
import { About } from "@/components/About";
import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";
import { QuickView } from "@/components/QuickView";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { getStorefront } from "@/lib/server/catalog";

// Catalog is read from Neon on every request, so admin edits show up immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { products, categories, featured, settings } = await getStorefront();

  return (
    <ShopProvider
      hasLogo={process.env.NEXT_PUBLIC_HAS_LOGO === "1"}
      catalog={{
        products,
        categories,
        featured,
        whatsappNumber: settings.whatsappNumber,
        acceptOrders: settings.acceptOrders,
      }}
    >
      <AnnouncementBar items={settings.announcement} />
      <Header />
      <main>
        <Hero />
        <CategoryRows />
        <ProductGrid />
        <Studio />
        <Triptych />
        <About />
        <Community />
      </main>
      <Footer />
      <QuickView />
      <CartDrawer />
      <SearchOverlay />
    </ShopProvider>
  );
}
