import Image from "next/image";
import { colorFromString, cn } from "@/lib/utils";

/**
 * Tool avatar: renders the real logo if present, otherwise a colored square
 * with the tool's initial (deterministic color per name).
 */
export function ToolLogo({
  name,
  logoUrl,
  size = 40,
  className,
}: {
  name: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-2xl object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl font-semibold text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        background: colorFromString(name),
        fontSize: Math.round(size * 0.42),
      }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
