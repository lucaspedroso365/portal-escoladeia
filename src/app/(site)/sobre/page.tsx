import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Sobre a Escola de IA",
  description:
    "Conheça a Escola de IA: nossa missão, valores e a equipe editorial dedicada a explicar inteligência artificial em português.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Sobre" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Sobre a Escola de IA</h1>
      <div className="prose-ia mt-6">
        <p>
          A <strong>Escola de IA</strong> nasceu com um objetivo claro: tornar a inteligência
          artificial acessível para todos que falam português. Em um cenário onde novas
          ferramentas, modelos e conceitos surgem a cada semana, acreditamos que informação clara,
          confiável e bem organizada é o que separa quem apenas ouve falar de IA de quem realmente
          a utiliza no dia a dia.
        </p>

        <h2>Nossa missão</h2>
        <p>
          Nossa missão é descomplicar a inteligência artificial. Reunimos em um só lugar tudo o que
          você precisa para entender, comparar e escolher as melhores ferramentas de IA: guias
          práticos, notícias atualizadas diariamente, comparativos imparciais, rankings, tutoriais
          passo a passo e um glossário completo. Tudo escrito em português do Brasil, com linguagem
          direta e exemplos do mundo real.
        </p>

        <h2>O que fazemos</h2>
        <p>
          Cobrimos todo o ecossistema de IA generativa — de assistentes de texto como ChatGPT,
          Claude e Gemini, a geradores de imagem como Midjourney e DALL-E, passando por ferramentas
          de vídeo, áudio, código e APIs para desenvolvedores. Para cada ferramenta, trazemos uma
          análise detalhada do que ela faz, como usá-la, quanto custa e quais são seus pontos fortes
          e fracos. Nossos comparativos ajudam você a decidir entre alternativas, enquanto nossos
          tutoriais ensinam, na prática, como extrair o máximo de cada solução.
        </p>

        <h2>Nossos valores</h2>
        <p>
          <strong>Imparcialidade:</strong> não vendemos ferramentas, ajudamos você a escolher a
          certa. Quando usamos links de afiliados, isso nunca influencia nossas avaliações.{" "}
          <strong>Clareza:</strong> evitamos jargão desnecessário e explicamos cada conceito de
          forma simples. <strong>Atualização constante:</strong> a IA muda rápido, e nosso conteúdo
          acompanha esse ritmo. <strong>Confiabilidade:</strong> verificamos informações e citamos
          fontes sempre que possível.
        </p>

        <h2>Equipe editorial</h2>
        <p>
          A Redação Escola de IA é formada por profissionais apaixonados por tecnologia, que
          combinam experiência prática com ferramentas de inteligência artificial e cuidado
          editorial. Cada conteúdo passa por revisão antes de ser publicado, garantindo precisão e
          qualidade. Acreditamos que a melhor forma de aprender sobre IA é vendo-a aplicada a
          problemas reais — e é exatamente isso que buscamos mostrar em cada artigo.
        </p>

        <h2>Fale conosco</h2>
        <p>
          Tem uma sugestão, correção ou parceria em mente? Adoraríamos ouvir você. Visite nossa{" "}
          <a href="/contato">página de contato</a> e envie sua mensagem. Estamos sempre buscando
          melhorar e crescer junto com nossa comunidade de leitores.
        </p>
      </div>
    </div>
  );
}
