"use client";

import { useState } from "react";
import { IconSparkles, IconLoader2 } from "@tabler/icons-react";
import type { ContentType } from "@/types";

export function AIGenerator({
  contentType,
  onGenerate,
}: {
  contentType: ContentType;
  onGenerate: (data: Record<string, unknown>) => void;
}) {
  const [instruction, setInstruction] = useState("");
  const [useGrounding, setUseGrounding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!instruction.trim()) {
      setError("Descreva o que deseja gerar.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, instruction, useGrounding }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Falha ao gerar conteúdo.");
        return;
      }
      const data = await res.json();
      onGenerate(data as Record<string, unknown>);
    } catch {
      setError("Erro de conexão ao gerar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#FFF4EE] to-[#FFE8DC] p-5 shadow-[0_2px_6px_rgba(0,0,0,0.06)] ring-[0.5px] ring-[#CC785C]/15">
      <div className="flex items-center gap-2">
        <IconSparkles size={20} className="text-[#CC785C]" />
        <h3 className="font-semibold">Gerar com IA</h3>
        <span className="ml-auto rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-[#CC785C]">
          Gemini 2.5 Flash
        </span>
      </div>

      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        rows={4}
        placeholder="Instrução: descreva o conteúdo que deseja gerar (tema, ferramenta, ângulo...)."
        className="mt-3 w-full rounded-xl bg-white/80 p-3 text-sm outline-none placeholder:text-[#86868B] focus:bg-white"
      />

      <label className="mt-3 flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={useGrounding}
          onChange={(e) => setUseGrounding(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded accent-[#CC785C]"
        />
        <span className="text-sm">
          Buscar no Google (grounding)
          <span className="block text-xs text-[#86868B]">
            +R$ 0,18 por busca · dados em tempo real
          </span>
        </span>
      </label>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#CC785C] py-3 text-sm font-semibold text-white transition hover:bg-[#b86848] disabled:opacity-60"
      >
        {loading ? (
          <>
            <IconLoader2 size={18} className="animate-spin" /> Gerando...
          </>
        ) : (
          <>
            <IconSparkles size={18} /> Gerar conteúdo com IA
          </>
        )}
      </button>
      <p className="mt-2 text-center text-xs text-[#86868B]">Custo estimado: ~R$ 0,05</p>
    </div>
  );
}
