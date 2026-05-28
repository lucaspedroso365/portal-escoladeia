import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do portal Escola de IA.",
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Termos" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Termos de Uso</h1>
      <div className="prose-ia mt-6">
        <p>
          Ao acessar e utilizar o portal Escola de IA, você concorda com os termos descritos abaixo.
          Caso não concorde, recomendamos que não utilize o site.
        </p>

        <h2>1. Uso do conteúdo</h2>
        <p>
          Todo o conteúdo publicado tem caráter informativo e educacional. Embora nos esforcemos
          para manter as informações precisas e atualizadas, o cenário da inteligência artificial
          muda rapidamente, e não garantimos que todo o conteúdo esteja sempre completamente
          atualizado. As decisões tomadas com base em nosso conteúdo são de responsabilidade do
          usuário.
        </p>

        <h2>2. Propriedade intelectual</h2>
        <p>
          Os textos, marcas e layout do site são protegidos por direitos autorais. A reprodução
          total ou parcial é permitida desde que citada a fonte e incluído um link para a página
          original.
        </p>

        <h2>3. Links e ferramentas de terceiros</h2>
        <p>
          O site contém links para ferramentas e sites de terceiros, incluindo links de afiliados.
          Não nos responsabilizamos pelo conteúdo, políticas ou práticas desses serviços externos.
        </p>

        <h2>4. Publicidade</h2>
        <p>
          Exibimos anúncios para manter o site gratuito. A presença de um anúncio não constitui
          endosso do produto ou serviço anunciado.
        </p>

        <h2>5. Limitação de responsabilidade</h2>
        <p>
          A Escola de IA não se responsabiliza por eventuais prejuízos decorrentes do uso das
          informações aqui publicadas. O uso de qualquer ferramenta mencionada deve seguir os termos
          do respectivo fornecedor.
        </p>

        <h2>6. Alterações nos termos</h2>
        <p>
          Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entram
          em vigor a partir da sua publicação nesta página.
        </p>
      </div>
    </div>
  );
}
