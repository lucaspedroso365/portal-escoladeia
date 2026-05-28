import Image from "next/image";

/**
 * Fills its (relative, fixed-height) parent. Falls back to a branded gradient
 * when there's no image. Place inside a `relative` container with a height.
 */
export function CoverImage({
  src,
  alt,
  label,
  sizes = "(max-width: 768px) 100vw, 600px",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFF4EE] via-[#F5F5F7] to-[#FFE8DC]">
      <span className="px-3 text-center text-sm font-semibold text-[#CC785C]/70">
        {label ?? "Escola de IA"}
      </span>
    </div>
  );
}
