// ─── TAR7A | طرحه — catalog & brand data ───────────────────────────────────

export const WHATSAPP_NUMBER = "218910073418";
export const PHONE_DISPLAY = "+218-0910073418";
export const PHONE_TEL = "+218910073418";
export const INSTAGRAM_URL = "https://www.instagram.com/tarha77/";
export const FACEBOOK_URL = "https://www.facebook.com/tarha777";
export const SOUNDCLOUD_URL = "https://soundcloud.com/";

/** Accepts an Unsplash photo id (e.g. "1600269452121-4f2416e55c28") or a full / root-relative image URL. */
export const img = (src: string, w = 1200) =>
  /^(https?:)?\/\//.test(src) || src.startsWith("/")
    ? src
    : `https://images.unsplash.com/photo-${src}?auto=format&fit=crop&w=${w}&q=80`;

export const formatPrice = (n: number) => `${n} ل.د`;

export const waLink = (text: string, number: string = WHATSAPP_NUMBER) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

// ─── Categories ────────────────────────────────────────────────────────────

export type CategoryKey =
  | "outfits"
  | "tshirts"
  | "pants"
  | "sneakers"
  | "caps"
  | "watches"
  | "glasses"
  | "art-apparel"
  | "art-shoes"
  | "custom";

export type Category = {
  key: CategoryKey;
  label: string;
  /** Latin labels render in Space Grotesk */
  latin?: boolean;
  image: string;
};

/** The 9 brand categories shown in the kinetic rows. */
export const CATEGORIES: Category[] = [
  { key: "outfits", label: "طرحات", image: "1523398002811-999ca8dec234" },
  { key: "tshirts", label: "تيشرتات", image: "1583743814966-8936f5b7be1a" },
  { key: "pants", label: "سراويل", image: "1495121605193-b116b5b9c5fe" },
  { key: "sneakers", label: "سبيدروات", image: "1460353581641-37baddab0fa2" },
  { key: "caps", label: "طواقي", image: "1521369909029-2afed882baee" },
  { key: "watches", label: "ساعات", image: "1524592094714-0f0654e20314" },
  { key: "glasses", label: "نضارات", image: "1572635196237-14b3f281503f" },
  { key: "art-apparel", label: "TARHA ART HOODIES & SHIRTS", latin: true, image: "1509942774463-acf339cf87d5" },
  { key: "art-shoes", label: "TARHA ART SHOES", latin: true, image: "1595950653106-6c9ebd614d3a" },
];

export const CUSTOM_CATEGORY: Category = {
  key: "custom",
  label: "تصميم حسب الطلب",
  image: "1620799140408-edc6dcb6d633",
};

export const ALL_CATEGORIES: Category[] = [...CATEGORIES, CUSTOM_CATEGORY];

export const categoryLabel = (key: CategoryKey) =>
  ALL_CATEGORIES.find((c) => c.key === key)?.label ?? "";

// ─── Products ──────────────────────────────────────────────────────────────

export type Badge = "New" | "Art Edition" | "Best Seller";
export const BADGES: Badge[] = ["New", "Art Edition", "Best Seller"];

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "SOLD_OUT";
export const STOCK_LABELS: Record<StockStatus, string> = {
  IN_STOCK: "متوفر",
  LOW_STOCK: "قطع قليلة",
  SOLD_OUT: "خلص",
};

export type Product = {
  id: string;
  code: string;
  name: string;
  price: number;
  /** Primary category (shown on the card) */
  category: CategoryKey;
  /** Every category this piece appears under when filtering */
  tags: CategoryKey[];
  badge?: Badge;
  edition: [number, number];
  image: string;
  altImage: string;
  sizes?: string[];
  description: string;
  stockStatus?: StockStatus;
};

export const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
export const SHOE_SIZES = ["39", "40", "41", "42", "43", "44", "45"];

export const PRODUCTS: Product[] = [
  {
    id: "nike-air-force-art",
    code: "TR-001",
    name: "NIKE AIR FORCE ART",
    price: 95,
    category: "art-shoes",
    tags: ["art-shoes", "sneakers"],
    badge: "Art Edition",
    edition: [1, 50],
    image: "1600269452121-4f2416e55c28",
    altImage: "1595950653106-6c9ebd614d3a",
    sizes: SHOE_SIZES,
    description: "إير فورس مرسومة باليد قطعة قطعة. الرسم ثابت ومقاوم للمية — كل زوج نسخة وحدة ما تتكررش.",
  },
  {
    id: "low-sbedri-art",
    code: "TR-002",
    name: "LOW SBEDRI ART",
    price: 95,
    category: "art-shoes",
    tags: ["art-shoes", "sneakers"],
    badge: "New",
    edition: [2, 50],
    image: "1525966222134-fcfa99b8ae77",
    altImage: "1549298916-b41d501d3772",
    sizes: SHOE_SIZES,
    description: "سبيدرو واطي برسمة TARHA ART. اختار الفكرة وحني نرسمولك عليه.",
  },
  {
    id: "high-sbedri-art",
    code: "TR-003",
    name: "HIGH SBEDRI ART",
    price: 95,
    category: "art-shoes",
    tags: ["art-shoes", "sneakers"],
    badge: "Art Edition",
    edition: [3, 50],
    image: "1552346154-21d32810aba3",
    altImage: "1514989940723-e8e51635b782",
    sizes: SHOE_SIZES,
    description: "سبيدرو عالي، رسم يدوي كامل على الجنب والكعب. ستايل شارع من الآخر.",
  },
  {
    id: "anime-hoodies",
    code: "TR-004",
    name: "ANIME HOODIES",
    price: 120,
    category: "art-apparel",
    tags: ["art-apparel"],
    badge: "Best Seller",
    edition: [4, 50],
    image: "1509942774463-acf339cf87d5",
    altImage: "1503342217505-b0a15ec3261c",
    sizes: APPAREL_SIZES,
    description: "هودي برسمة أنمي من اختيارك — رسم يدوي على قماش تقيل ودافي.",
  },
  {
    id: "haisenberg",
    code: "TR-005",
    name: "HAISENBERG",
    price: 120,
    category: "art-apparel",
    tags: ["art-apparel"],
    badge: "Best Seller",
    edition: [5, 50],
    image: "1578768079052-aa76e52ff62e",
    altImage: "1556821840-3a63f95609a7",
    sizes: APPAREL_SIZES,
    description: "Say my name. هودي HAISENBERG مرسوم باليد للي يعرفوا القصة.",
  },
  {
    id: "series-hoodies",
    code: "TR-006",
    name: "SERIES HOODIES",
    price: 120,
    category: "art-apparel",
    tags: ["art-apparel"],
    badge: "New",
    edition: [6, 50],
    image: "1556821840-3a63f95609a7",
    altImage: "1578768079052-aa76e52ff62e",
    sizes: APPAREL_SIZES,
    description: "مسلسلك المفضل على هودي. قولنا شن المسلسل وحني نرسموه.",
  },
  {
    id: "make-your-hoodie",
    code: "TR-007",
    name: "Make your hoodie",
    price: 120,
    category: "custom",
    tags: ["custom", "art-apparel"],
    badge: "Art Edition",
    edition: [7, 50],
    image: "1620799140408-edc6dcb6d633",
    altImage: "1509942774463-acf339cf87d5",
    sizes: APPAREL_SIZES,
    description: "صمم هوديك بنفسك: اختار اللون والمقاس وفكرة الرسم، وحني نرسمه باليد.",
  },
  {
    id: "make-your-shirts",
    code: "TR-008",
    name: "Make your Shirts",
    price: 70,
    category: "custom",
    tags: ["custom", "tshirts", "art-apparel"],
    badge: "New",
    edition: [8, 50],
    image: "1618354691373-d851c5c3a990",
    altImage: "1576566588028-4147f3842f27",
    sizes: APPAREL_SIZES,
    description: "تيشرت حسب الطلب — صورتك، فكرتك، أو رسمة من عندنا.",
  },
  {
    id: "sport-watch",
    code: "TR-009",
    name: "ساعة سبورت",
    price: 85,
    category: "watches",
    tags: ["watches"],
    edition: [9, 50],
    image: "1524592094714-0f0654e20314",
    altImage: "1523275335684-37898b6baf30",
    description: "ساعة سبورت خفيفة تمشي مع أي طرحة — كاجوال ولا ستريت.",
  },
  {
    id: "u-cap",
    code: "TR-010",
    name: "طاقية U",
    price: 25,
    category: "caps",
    tags: ["caps"],
    edition: [10, 50],
    image: "1521369909029-2afed882baee",
    altImage: "1588850561407-ed78c282e89b",
    description: "طاقية U بقماش مغسول، مقاس واحد يتعدل من الخلف.",
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const productsIn = (key: CategoryKey | "all") =>
  key === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.tags.includes(key));

export const pad = (n: number, len = 2) => String(n).padStart(len, "0");

// ─── Hero lookbook ─────────────────────────────────────────────────────────

export const LOOKS = [
  { image: "1600269452121-4f2416e55c28", productId: "nike-air-force-art" },
  { image: "1523398002811-999ca8dec234", productId: "haisenberg" },
  { image: "1509942774463-acf339cf87d5", productId: "anime-hoodies" },
  { image: "1552346154-21d32810aba3", productId: "high-sbedri-art" },
];

// ─── Studio (customizer) ───────────────────────────────────────────────────

export const STUDIO_PIECES = [
  { id: "hoodie", label: "Make your hoodie", price: 120, sizes: APPAREL_SIZES, kind: "hoodie" as const },
  { id: "shirt", label: "Make your Shirts", price: 70, sizes: APPAREL_SIZES, kind: "shirt" as const },
  { id: "shoes", label: "Custom Art Shoes", price: 95, sizes: SHOE_SIZES, kind: "shoes" as const },
];

export const STUDIO_COLORS = [
  { id: "black", label: "أسود", hex: "#0A0B0E" },
  { id: "white", label: "أبيض", hex: "#F4F5F7" },
  { id: "blue", label: "أزرق طرحه", hex: "#0057FF" },
  { id: "grey", label: "رمادي", hex: "#8A8F98" },
  { id: "sand", label: "بيج", hex: "#D8C9B0" },
];

export const STUDIO_IDEAS = [
  { id: "anime", label: "أنمي", en: "ANIME" },
  { id: "series", label: "مسلسلات", en: "SERIES" },
  { id: "graffiti", label: "جرافيتي", en: "GRAFFITI" },
  { id: "own", label: "فكرتك الخاصة", en: "YOUR IDEA" },
];

// ─── Community wall ────────────────────────────────────────────────────────

export const COMMUNITY_SHOTS = [
  "1503342217505-b0a15ec3261c",
  "1595950653106-6c9ebd614d3a",
  "1529139574466-a303027c1d8b",
  "1542291026-7eec264c27ff",
  "1516826957135-700dedea698c",
  "1576566588028-4147f3842f27",
];

export const ABOUT_COPY =
  "بنحكيلك علي تلاته من الناس بعدها نقولك من حني، في نوع من الناس يلبس عشوائي وحتا لما يشري لبس ميعرفش يشري ولا يقعد حاير شن ياخد، وفي نوع يعرف يلبس ويركب لاكن ميعرفش وين يلقا حاجته ومرات ميلقاش اللون او النوع لي يبيه، وفي ناس تعرف تشري وتنسق وتعرف وين تلقا حاجاتها لاكن تفضل تاخد منا. وحني اصلا موجدين لصحابنا التلاته هادو، وحني نفسنا التلاته هادو.. هي باهي هكي.";
