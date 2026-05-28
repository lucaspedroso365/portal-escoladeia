"use client";

import { useState, type FormEvent } from "react";

const CONTACT_EMAIL = "contato@escoladevideosia.com.br";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Contato de ${name || "visitante"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  const inputClass =
    "w-full rounded-xl bg-[#F5F5F7] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#CC785C]/30";

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Mensagem</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-[#CC785C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b86848]"
      >
        Enviar mensagem
      </button>
    </form>
  );
}
