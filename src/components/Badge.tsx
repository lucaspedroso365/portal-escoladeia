import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "muted" | "primary" | "solid" | "green" | "red";

const STYLES: Record<BadgeVariant, string> = {
  default: "bg-[#F5F5F7] text-[#1A1A1A]",
  muted: "bg-[#F5F5F7] text-[#86868B]",
  primary: "bg-[#CC785C]/10 text-[#CC785C]",
  solid: "bg-[#CC785C] text-white",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
