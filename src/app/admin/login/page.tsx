"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Não foi possível entrar.");
        setLoading(false);
      }
    } catch {
      setError("Sem conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-4 font-sans text-[#1A1A1A]">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)]">
        <div className="text-center text-xl tracking-tight">
          <span className="font-normal">ESCOLA DE </span>
          <span className="font-bold text-[#CC785C]">I.A</span>
        </div>
        <p className="mt-1 text-center text-sm text-[#86868B]">Painel administrativo</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Usuário</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoFocus
              required
              className="w-full rounded-xl bg-[#F5F5F7] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#CC785C]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl bg-[#F5F5F7] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#CC785C]/30"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1A1A1A] py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
