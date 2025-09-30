import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Питомник МЯТА - Многолетние цветы и травы",
  description: "Качественные многолетние цветы и травы от питомника МЯТА в Ростовской области. Медоносные, вечнозеленые, ароматные растения для вашего сада.",
  keywords: "питомник, многолетние цветы, травы, растения, сад, Ростовская область, медоносные, вечнозеленые",
  authors: [{ name: "Питомник МЯТА" }],
  openGraph: {
    title: "Питомник МЯТА - Многолетние цветы и травы",
    description: "Качественные многолетние цветы и травы от питомника МЯТА в Ростовской области.",
    url: "https://pitomnik-myta.vercel.app",
    siteName: "Питомник МЯТА",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 600,
        alt: "Питомник МЯТА",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Питомник МЯТА - Многолетние цветы и травы",
    description: "Качественные многолетние цветы и травы от питомника МЯТА в Ростовской области.",
    images: ["/assets/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}