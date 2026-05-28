import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a equipe da Escola de IA. Sugestões, correções e parcerias.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Contato" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Contato</h1>
      <p className="mt-3 text-[#86868B]">
        Tem uma dúvida, sugestão ou proposta de parceria? Envie uma mensagem ou escreva diretamente
        para{" "}
        <a href="mailto:contato@escoladevideosia.com.br" className="font-medium text-[#CC785C]">
          contato@escoladevideosia.com.br
        </a>
        .
      </p>
      <ContactForm />
    </div>
  );
}
