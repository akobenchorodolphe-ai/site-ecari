import type { Metadata } from "next";

import { buildEcariStructuredData } from "@/lib/ecari/structured-data";
import { buildRootMetadata } from "@/lib/ecari/metadata";

import "./globals.css";

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = JSON.stringify(buildEcariStructuredData()).replace(
    /</g,
    "\\u003c",
  );

  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <script
          dangerouslySetInnerHTML={{ __html: structuredData }}
          type="application/ld+json"
        />
        {children}
      </body>
    </html>
  );
}
