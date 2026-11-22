"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { waLink, type Category, type CategoryKey, type Product } from "@/lib/data";

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  note?: string;
  qty: number;
};

type NewItem = Omit<CartItem, "key" | "qty">;

export type CatalogProps = {
  products: Product[];
  categories: Category[];
  featured: CategoryKey[];
  whatsappNumber: string;
  acceptOrders: boolean;
};

type ShopState = {
  hasLogo: boolean;
  products: Product[];
  /** All categories (incl. custom), sorted */
  categories: Category[];
  /** Categories shown in the kinetic rows / footer */
  featuredCategories: Category[];
  labelOf: (key: CategoryKey) => string;
  productsIn: (key: CategoryKey | "all") => Product[];
  getProduct: (id: string) => Product | undefined;
  /** WhatsApp deep link to the store number from settings */
  wa: (text: string) => string;
  acceptOrders: boolean;
  cart: CartItem[];
  count: number;
  subtotal: number;
  addToCart: (item: NewItem, qty?: number) => void;
  updateQty: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  quickView: Product | null;
  openQuickView: (p: Product) => void;
  closeQuickView: () => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  filter: CategoryKey | "all";
  setFilter: (f: CategoryKey | "all") => void;
  /** Sets the filter and scrolls to the drop grid */
  shopCategory: (f: CategoryKey | "all") => void;
  toast: string | null;
};

const ShopContext = createContext<ShopState | null>(null);
const STORAGE_KEY = "tar7a-bag-v1";

const itemKey = (i: NewItem) =>
  [i.productId, i.size ?? "", i.color ?? "", i.note ?? ""].join("|");

export function ShopProvider({
  hasLogo,
  catalog,
  children,
}: {
  hasLogo: boolean;
  catalog: CatalogProps;
  children: React.ReactNode;
}) {
  const { products, categories, featured, whatsappNumber, acceptOrders } = catalog;
  const catalogApi = useMemo(() => {
    const byKey = new Map(categories.map((c) => [c.key, c]));
    return {
      products,
      categories,
      featuredCategories: featured.map((k) => byKey.get(k)).filter((c): c is Category => !!c),
      labelOf: (key: CategoryKey) => byKey.get(key)?.label ?? "",
      productsIn: (key: CategoryKey | "all") => (key === "all" ? products : products.filter((p) => p.tags.includes(key))),
      getProduct: (id: string) => products.find((p) => p.id === id),
      wa: (text: string) => waLink(text, whatsappNumber),
      acceptOrders,
    };
  }, [products, categories, featured, whatsappNumber, acceptOrders]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted bag after mount (keeps server & first client render identical → no hydration mismatch)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setCart(parsed as CartItem[]);
      }
    } catch {
      /* storage unavailable */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart, hydrated]);

  // Lock page scroll while any overlay is open
  const overlayOpen = cartOpen || !!quickView || searchOpen;
  useEffect(() => {
    document.documentElement.style.overflow = overlayOpen ? "hidden" : "";
  }, [overlayOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setCartOpen(false);
      setQuickView(null);
      setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const addToCart = useCallback(
    (item: NewItem, qty = 1) => {
      const key = itemKey(item);
      setCart((prev) => {
        const existing = prev.find((c) => c.key === key);
        if (existing) return prev.map((c) => (c.key === key ? { ...c, qty: c.qty + qty } : c));
        return [...prev, { ...item, key, qty }];
      });
      flash(`انضافت للسلة — ${item.name}`);
    },
    [flash],
  );

  const updateQty = useCallback((key: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => (c.key === key ? { ...c, qty: Math.max(1, c.qty + delta) } : c)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setCart((prev) => prev.filter((c) => c.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const shopCategory = useCallback((f: CategoryKey | "all") => {
    setFilter(f);
    document.getElementById("drop")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const value = useMemo<ShopState>(
    () => ({
      hasLogo,
      ...catalogApi,
      cart,
      count: cart.reduce((n, c) => n + c.qty, 0),
      subtotal: cart.reduce((n, c) => n + c.qty * c.price, 0),
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      cartOpen,
      setCartOpen,
      quickView,
      openQuickView: (p) => setQuickView(p),
      closeQuickView: () => setQuickView(null),
      searchOpen,
      setSearchOpen,
      filter,
      setFilter,
      shopCategory,
      toast,
    }),
    [hasLogo, catalogApi, cart, addToCart, updateQty, removeItem, clearCart, cartOpen, quickView, searchOpen, filter, shopCategory, toast],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 transition-all duration-500 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-full border border-line-dark bg-ink px-5 py-3 text-sm text-chalk shadow-2xl shadow-brand/20">
          <span className="live-dot h-2 w-2 rounded-full bg-brand" />
          {toast}
        </div>
      </div>
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
