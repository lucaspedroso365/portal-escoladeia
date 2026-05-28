"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IconUpload, IconSparkles, IconLoader2, IconTrash } from "@tabler/icons-react";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState<"upload" | "generate" | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    setLoading("upload");
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok && d.url) onChange(d.url);
      else setError(d.error ?? "Falha no upload.");
    } catch {
      setError("Erro ao enviar imagem.");
    } finally {
      setLoading(null);
    }
  }

  async function generate() {
    if (!prompt.trim()) {
      setError("Descreva a imagem.");
      return;
    }
    setLoading("generate");
    setError("");
    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const d = await res.json();
      if (res.ok && d.url) onChange(d.url);
      else setError(d.error ?? "Falha ao gerar imagem.");
    } catch {
      setError("Erro ao gerar imagem.");
    } finally {
      setLoading(null);
    }
  }

  if (value) {
    return (
      <div>
        <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-[#F5F5F7]">
          <Image src={value} alt="Pré-visualização" fill className="object-cover" sizes="600px" />
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#F5F5F7] px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <IconTrash size={16} /> Remover
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Upload */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) uploadFile(f);
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition ${
            dragOver ? "border-[#CC785C] bg-[#FFF4EE]" : "border-black/10 bg-[#FAFAFA]"
          }`}
        >
          {loading === "upload" ? (
            <IconLoader2 className="animate-spin text-[#CC785C]" />
          ) : (
            <IconUpload className="text-[#86868B]" />
          )}
          <p className="text-sm text-[#86868B]">Arraste uma imagem ou</p>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-lg bg-[#1A1A1A] px-3 py-1.5 text-xs font-semibold text-white"
          >
            Selecionar arquivo
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f);
            }}
          />
        </div>

        {/* Generate */}
        <div className="flex flex-col gap-2 rounded-2xl bg-gradient-to-br from-[#FFF4EE] to-[#FFE8DC] p-4 ring-[0.5px] ring-[#CC785C]/15">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <IconSparkles size={16} className="text-[#CC785C]" /> Gerar com Imagen 4
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Descreva a imagem a ser gerada..."
            className="w-full rounded-xl bg-white/80 p-2.5 text-sm outline-none focus:bg-white"
          />
          <button
            type="button"
            onClick={generate}
            disabled={loading === "generate"}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#CC785C] py-2 text-sm font-semibold text-white hover:bg-[#b86848] disabled:opacity-60"
          >
            {loading === "generate" ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : (
              <IconSparkles size={16} />
            )}
            Gerar imagem
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
