import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { updateProduct } from "../../../actions";
import { Flash, PageTitle } from "../../../parts";
import { ProductForm } from "../ProductForm";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const db = getDb();
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <>
      <PageTitle title={`تعديل: ${product.name}`}>
        <Link href="/admin/products" className="text-sm font-bold text-mute hover:text-brand">
          → رجوع للقطع
        </Link>
      </PageTitle>
      <Flash error={error} />
      <ProductForm action={updateProduct} product={product} categories={categories} />
    </>
  );
}
