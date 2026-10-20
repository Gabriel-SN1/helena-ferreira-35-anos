import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helena Ferreira • 35 anos",
  description: "Venha celebrar comigo! 07 de novembro, às 12h30, no Espaço Celebrar (Brogodó). Confirme sua presença.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
