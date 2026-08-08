import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "ghostOnDark";

const variants: Record<Variant, string> = {
  primary:
    "bg-olive text-foam hover:bg-olive-hover shadow-[var(--shadow-soft)]",
  secondary:
    "bg-foam text-ink border border-line hover:bg-sand-deep",
  ghost: "bg-transparent text-ink hover:bg-olive-soft/60",
  // For dark photography / ink gradients — do not override with text-ink.
  ghostOnDark:
    "bg-transparent text-foam border border-foam/40 hover:bg-foam/10",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`tap-target inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 text-[0.95rem] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
