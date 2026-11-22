"use client";

import { useFormStatus } from "react-dom";

export const inputCls =
  "w-full rounded-xl border border-line-light bg-white px-3 py-2.5 text-sm text-ink placeholder:text-mute focus:border-brand focus:outline-none";
export const labelCls = "mb-1.5 block text-xs font-bold text-mute";

/** Submit button that shows a pending state and can ask for confirmation. */
export function SubmitButton({
  children,
  confirm,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  confirm?: string;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-brand text-white hover:bg-brand-hover",
    ghost: "border border-line-light bg-white text-ink hover:border-brand hover:text-brand",
    danger: "border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white",
  }[variant];
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors disabled:opacity-60 ${styles} ${className}`}
    >
      {pending ? "…" : children}
    </button>
  );
}
