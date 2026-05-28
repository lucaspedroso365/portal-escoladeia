"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "cookie-consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  function decide(value: "accepted" | "configured") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="sticky bottom-0 z-50 w-full bg-[#1A1A1A] text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/80">
          Usamos cookies para melhorar sua experiência e exibir anúncios relevantes.
          Saiba mais na{" "}
          <Link href="/cookies" className="font-medium text-[#CC785C] underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/cookies"
            onClick={() => decide("configured")}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Configurar
          </Link>
          <button
            onClick={() => decide("accepted")}
            className="rounded-xl bg-[#CC785C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b86848]"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
