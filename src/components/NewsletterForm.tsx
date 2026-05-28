"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const schema = z.object({ email: z.string().email("E-mail inválido") });

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const dark = variant === "dark";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "E-mail inválido");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("Inscrição confirmada! Obrigado.");
        setEmail("");
      } else if (res.status === 409) {
        setStatus("success");
        setMessage("Você já está inscrito. 🙌");
      } else {
        setStatus("error");
        setMessage("Algo deu errado. Tente novamente.");
      }
    } catch {
      setStatus("error");
      setMessage("Sem conexão. Tente novamente.");
    }
  }

  if (status === "success") {
    return (
      <p className={cn("text-sm", dark ? "text-white/80" : "text-[#1A1A1A]", className)}>
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor e-mail"
          className={cn(
            "min-w-0 flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition",
            dark
              ? "bg-white/10 text-white placeholder:text-white/50 focus:bg-white/15"
              : "bg-[#F5F5F7] text-[#1A1A1A] placeholder:text-[#86868B] focus:ring-2 focus:ring-[#CC785C]/30"
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-xl bg-[#CC785C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b86848] disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Inscrever"}
        </button>
      </div>
      {status === "error" && (
        <p className={cn("text-xs", dark ? "text-red-300" : "text-red-600")}>{message}</p>
      )}
    </form>
  );
}
