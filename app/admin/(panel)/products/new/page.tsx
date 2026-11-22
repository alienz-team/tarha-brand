import Link from "next/link";
import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { createProduct } from "../../../actions";
import { Flash, PageTitle } from "../../../parts";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;
  const categories = await getDb().category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageTitle title="قطعة جديدة">
        <Link href="/admin/products" className="text-sm font-bold text-mute hover:text-brand">
          → رجوع للقطع
        </Link>
      </PageTitle>
      <Flash error={error} />
      <ProductForm action={createProduct} categories={categories} />
    </>
  );
}
