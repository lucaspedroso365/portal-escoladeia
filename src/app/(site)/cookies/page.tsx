import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Como a Escola de IA utiliza cookies, incluindo cookies de publicidade do AdSense.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Cookies" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Política de Cookies</h1>
      <div className="prose-ia mt-6">
        <p>
          Esta página explica o que são cookies, como e por que os utilizamos no portal Escola de
          IA.
        </p>

        <h2>O que são cookies</h2>
        <p>
          Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um
          site. Eles permitem que o site lembre suas preferências e melhore sua experiência de
          navegação.
        </p>

        <h2>Tipos de cookies que usamos</h2>
        <p>
          <strong>Essenciais:</strong> necessários para o funcionamento básico do site, como lembrar
          seu consentimento de cookies. <strong>Analíticos:</strong> ajudam a entender como os
          visitantes usam o site (por exemplo, via Google Analytics), de forma anônima.{" "}
          <strong>Publicidade:</strong> usados pelo Google AdSense e parceiros para exibir anúncios
          relevantes e medir seu desempenho.
        </p>

        <h2>Cookies de publicidade (AdSense)</h2>
        <p>
          O Google, como fornecedor terceirizado, utiliza cookies para veicular anúncios neste site.
          O uso do cookie de publicidade do Google permite que ele e seus parceiros exibam anúncios
          com base nas suas visitas a este e a outros sites. Você pode desativar a publicidade
          personalizada acessando as{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Configurações de anúncios do Google
          </a>
          .
        </p>

        <h2>Como gerenciar cookies</h2>
        <p>
          Você pode aceitar ou recusar cookies por meio do banner exibido ao acessar o site, e
          também configurar seu navegador para bloquear ou apagar cookies a qualquer momento.
          Observe que desativar certos cookies pode afetar a funcionalidade do site.
        </p>

        <p>
          Para mais informações sobre como tratamos seus dados, consulte nossa{" "}
          <a href="/privacidade">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}
