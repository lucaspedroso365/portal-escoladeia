"use client";

import { useEffect, useState } from "react";
import {
  IconBrandYoutube,
  IconMovie,
  IconSparkles,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react";

type Course = {
  id: string;
  title: string;
  tagline: string;
  blurb: string;
  Icon: typeof IconMovie;
};

const COURSES: Course[] = [
  {
    id: "canal-dark",
    title: "Canal Dark",
    tagline: "Crie um canal faceless no YouTube com IA — roteiro, voz e edição, sem aparecer.",
    blurb:
      "Um passo a passo completo pra montar um canal dark do zero: nicho, roteiro com IA, narração, edição e publicação. Sem mostrar o rosto, sem experiência prévia.",
    Icon: IconBrandYoutube,
  },
  {
    id: "edicao-claude",
    title: "Edição de Vídeo com Claude",
    tagline: "Edite vídeos usando IA de ponta a ponta — do roteiro ao corte final.",
    blurb:
      "Aprenda a usar a IA no fluxo de edição inteiro: gerar roteiro, cortar, legendar, criar thumbnails e acelerar a produção dos seus vídeos com Claude e outras ferramentas.",
    Icon: IconMovie,
  },
];

export function CoursesHighlight() {
  const [open, setOpen] = useState<Course | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section className="py-12">
      <div className="mb-9 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#CC785C]">
          Nossos cursos
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-[#1A1A1A] sm:text-4xl">
          Aprenda a criar com IA
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[#6B6B63]">
          Cursos práticos, do zero ao resultado — feitos pra você aplicar hoje.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {COURSES.map((c) => (
          <button
            key={c.id}
            onClick={() => setOpen(c)}
            className="group relative flex flex-col items-start overflow-hidden rounded-3xl border border-[#E7E4DB] bg-white p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-[#CC785C]/40 hover:shadow-[0_18px_50px_-12px_rgba(204,120,92,0.28)]"
          >
            <span
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#CC785C]/[0.07] blur-2xl transition-opacity duration-300 group-hover:bg-[#CC785C]/[0.12]"
              aria-hidden
            />
            <div className="flex w-full items-start justify-between">
              <div className="animate-float flex h-14 w-14 items-center justify-center rounded-2xl bg-[#CC785C]/[0.12] text-[#CC785C]">
                <c.Icon size={30} stroke={1.6} />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#CC785C]/[0.12] px-3 py-1 text-xs font-semibold text-[#CC785C]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CC785C] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#CC785C]" />
                </span>
                Em breve
              </span>
            </div>

            <h3 className="mt-5 font-serif text-2xl font-medium text-[#1A1A1A]">{c.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B63]">{c.tagline}</p>

            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#CC785C]">
              Saiba mais
              <IconArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="animate-fadein absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            className="animate-popin relative w-full max-w-md rounded-3xl border border-[#E7E4DB] bg-[#F7F5EF] p-8 text-center shadow-2xl"
          >
            <button
              onClick={() => setOpen(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#86868B] transition hover:bg-black/5 hover:text-[#1A1A1A]"
            >
              <IconX size={18} />
            </button>

            <div className="animate-float mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CC785C]/[0.12] text-[#CC785C]">
              <open.Icon size={34} stroke={1.6} />
            </div>

            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#CC785C]/[0.12] px-3 py-1 text-xs font-semibold text-[#CC785C]">
              <IconSparkles size={13} /> Em breve
            </span>

            <h3 className="mt-4 font-serif text-2xl font-medium text-[#1A1A1A]">{open.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6B6B63]">{open.blurb}</p>
            <p className="mt-4 text-sm text-[#86868B]">
              Estamos preparando esse curso com cuidado. Em breve ele estará disponível aqui. 🚀
            </p>

            <button
              onClick={() => setOpen(null)}
              className="mt-6 w-full rounded-full bg-[#CC785C] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
