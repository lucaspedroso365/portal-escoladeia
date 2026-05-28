import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade da Escola de IA, em conformidade com a LGPD.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Privacidade" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Política de Privacidade</h1>
      <div className="prose-ia mt-6">
        <p>
          A Escola de IA respeita a sua privacidade e está comprometida com a proteção dos seus
          dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº
          13.709/2018).
        </p>

        <h2>1. Dados que coletamos</h2>
        <p>
          Coletamos apenas os dados estritamente necessários: o endereço de e-mail, quando você se
          inscreve voluntariamente em nossa newsletter, e dados de navegação anônimos (como páginas
          visitadas e tipo de dispositivo) por meio de cookies e ferramentas de análise.
        </p>

        <h2>2. Como usamos seus dados</h2>
        <p>
          Utilizamos seu e-mail exclusivamente para enviar novidades e conteúdos sobre inteligência
          artificial. Os dados de navegação são usados para entender como melhorar o site e medir a
          audiência. Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins de
          marketing.
        </p>

        <h2>3. Cookies e publicidade</h2>
        <p>
          Utilizamos cookies próprios e de terceiros. Exibimos anúncios por meio do Google AdSense,
          que pode usar cookies para personalizar a publicidade com base em suas visitas a este e a
          outros sites. Você pode desativar a publicidade personalizada nas{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            configurações de anúncios do Google
          </a>
          . Saiba mais em nossa <a href="/cookies">Política de Cookies</a>.
        </p>

        <h2>4. Seus direitos</h2>
        <p>
          De acordo com a LGPD, você tem o direito de acessar, corrigir, excluir e solicitar a
          portabilidade dos seus dados, além de revogar o consentimento a qualquer momento. Para
          exercer esses direitos, entre em contato pelo e-mail{" "}
          <a href="mailto:contato@escoladevideosia.com.br">contato@escoladevideosia.com.br</a>.
        </p>

        <h2>5. Segurança</h2>
        <p>
          Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
          autorizado, perda ou alteração indevida.
        </p>

        <h2>6. Alterações</h2>
        <p>
          Esta política pode ser atualizada periodicamente. Recomendamos que você a revise com
          frequência. A data da última atualização será sempre indicada nesta página.
        </p>
      </div>
    </div>
  );
}
