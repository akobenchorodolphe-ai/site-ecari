import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ECARI | UCAO",
    template: "%s | ECARI | UCAO",
  },
  description:
    "Site vitrine ECARI de l'UCAO, relie a son premier module prioritaire de gestion du vivier des docteurs CERAO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
