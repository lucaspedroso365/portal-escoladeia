import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type CardVariant = "default" | "featured" | "flat";

const SHADOWS: Record<CardVariant, string> = {
  default:
    "shadow-[0_2px_6px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)]",
  featured:
    "shadow-[0_12px_40px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)]",
  flat: "shadow-none",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

/** iOS-style surface: rounded, soft shadow, no border. */
export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("bg-white rounded-2xl", SHADOWS[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
