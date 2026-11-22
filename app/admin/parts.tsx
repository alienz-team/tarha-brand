export function Flash({ error, ok }: { error?: string; ok?: string }) {
  if (error) return <p className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>;
  if (ok) return <p className="mb-6 rounded-2xl bg-brand/10 p-4 text-sm font-semibold text-brand">{ok}</p>;
  return null;
}

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
      {children}
    </div>
  );
}
