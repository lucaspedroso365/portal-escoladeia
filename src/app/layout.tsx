import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { siteUrl } from "@/lib/url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — Tudo sobre inteligência artificial`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "inteligência artificial",
    "ferramentas de IA",
    "ChatGPT",
    "Claude",
    "Gemini",
    "Midjourney",
    "notícias de IA",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    title: `${SITE.name} — Tudo sobre inteligência artificial`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="pt-BR">
      <body className="bg-white font-sans text-[#1A1A1A]">
        {children}

        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}

        {adsenseId ? (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          />
        ) : null}
      </body>
    </html>
  );
}
