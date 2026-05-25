import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ECARI | UCAO",
    template: "%s | ECARI | UCAO",
  },
  description:
    "Plateforme ECARI de l'UCAO avec page d'accueil orientee vers le don, le recensement CERAO, la preinscription etudiante et les partenariats financiers.",
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
