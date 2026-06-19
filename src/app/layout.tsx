import type { Metadata } from "next";
import "./globals.css";
import HashRouter from "../components/HashRouter";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  metadataBase: new URL("https://historin.com"),
  title: {
    default: "Historin - Descubra as Histórias de Gramado",
    template: "%s | Historin",
  },
  description:
    "Explore as fascinantes histórias das ruas de Gramado e Canela através de uma experiência interativa e imersiva. Descubra a história de cada rua e conheça as pessoas que a fizeram viver.",
  keywords: [
    "Gramado",
    "Canela",
    "História",
    "Ruas",
    "Turismo",
    "Cultura",
    "Patrimônio",
  ],
  authors: [{ name: "Historin" }],
  creator: "Historin",
  publisher: "Historin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Historin - Descubra as Histórias de Gramado",
    description:
      "Explore as fascinantes histórias das ruas de Gramado e Canela através de uma experiência interativa e imersiva. Descubra a história de cada rua e conheça as pessoas que a fizeram viver.",
    images: [
      {
        url: "/images/meta/criadores.webp",
        width: 1200,
        height: 630,
        alt: "Historin - Histórias de Gramado e Canela",
      },
    ],
    siteName: "Historin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Historin - Descubra as Histórias de Gramado",
    description:
      "Explore as fascinantes histórias das ruas de Gramado e Canela através de uma experiência interativa e imersiva. Descubra a história de cada rua e conheça as pessoas que a fizeram viver.",
    images: [
      {
        url: "/images/meta/criadores.webp",
        alt: "Historin - Histórias de Gramado e Canela",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Historin',
              url: 'https://historin.com',
              logo: 'https://historin.com/images/meta/historin-logo.svg',
              sameAs: [],
            }),
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen bg-[#f4ede0] text-[#6B5B4F]"
      >
        <a href="#main-content" className="skip-to-content">
          Pular para o conteúdo principal
        </a>
        <AuthProvider>
          <ToastProvider>
            <HashRouter />
            <main id="main-content">
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

