"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdFormat = "leaderboard" | "rectangle" | "halfpage" | "auto";

const SIZES: Record<AdFormat, { w: number; h: number }> = {
  leaderboard: { w: 728, h: 90 },
  rectangle: { w: 336, h: 280 },
  halfpage: { w: 300, h: 600 },
  auto: { w: 0, h: 0 },
};

/**
 * Lazy AdSense slot. Only pushes the ad once it scrolls near the viewport.
 * Renders a labeled placeholder when no NEXT_PUBLIC_ADSENSE_ID is configured.
 */
export function AdSense({
  slot,
  format = "auto",
  className,
}: {
  slot: string;
  format?: AdFormat;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const pushed = useRef(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const size = SIZES[format];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible && adsenseId && !pushed.current) {
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* adsbygoogle not ready */
      }
    }
  }, [visible, adsenseId]);

  const boxStyle =
    format === "auto"
      ? { width: "100%", minHeight: 90 }
      : { width: size.w, height: size.h, maxWidth: "100%" };

  return (
    <div
      ref={ref}
      className={`mx-auto my-6 flex items-center justify-center ${className ?? ""}`}
      style={{ maxWidth: format === "auto" ? "100%" : size.w }}
    >
      {adsenseId && visible ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", ...boxStyle }}
          data-ad-client={adsenseId}
          data-ad-slot={slot}
          data-ad-format={format === "auto" ? "auto" : undefined}
          data-full-width-responsive={format === "auto" ? "true" : undefined}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-xl bg-[#FAFAFA] text-[10px] font-medium uppercase tracking-widest text-[#C7C7CC]"
          style={boxStyle}
        >
          AD
        </div>
      )}
    </div>
  );
}
