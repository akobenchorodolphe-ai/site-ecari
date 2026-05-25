import type { Metadata } from "next";

import { getAppUrl } from "@/lib/env";

const siteName = "ECARI | UCAO";

const defaultDescription =
  "Plateforme ECARI de l'UCAO pour le don, le recensement CERAO, la preinscription etudiante et les partenariats financiers en recherche et innovation.";

const defaultKeywords = [
  "ECARI",
  "UCAO",
  "recherche",
  "innovation",
  "CERAO",
  "preinscription etudiante",
  "partenariat financier",
] as const;

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getAppUrl()),
    title: {
      default: siteName,
      template: "%s | ECARI | UCAO",
    },
    description: defaultDescription,
    applicationName: "ECARI",
    keywords: [...defaultKeywords],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      siteName,
      locale: "fr_FR",
      url: "/",
      title: siteName,
      description: defaultDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: defaultDescription,
    },
  };
}

type PageMetadataOptions = {
  description: string;
  path: string;
  title: string;
};

export function buildPageMetadata(options: PageMetadataOptions): Metadata {
  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical: options.path,
    },
    openGraph: {
      type: "website",
      siteName,
      locale: "fr_FR",
      url: options.path,
      title: `${options.title} | ECARI | UCAO`,
      description: options.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${options.title} | ECARI | UCAO`,
      description: options.description,
    },
  };
}
