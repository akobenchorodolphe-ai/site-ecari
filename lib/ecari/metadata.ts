import type { Metadata } from "next";

import {
  absoluteUrl,
  ecariDefaultDescription,
  ecariKeywords,
  ecariOrganizationName,
  ecariShortName,
  ecariSiteName,
  getSiteUrl,
} from "@/lib/ecari/site";

const ogImage = {
  alt: "Logo ECARI - Espace Conseil d'Appui a la Recherche et a l'Innovation",
  height: 800,
  url: "/ecari-logo.png",
  width: 1280,
};

export function buildRootMetadata(): Metadata {
  const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${ecariShortName} - ${ecariOrganizationName}`,
      template: "%s | ECARI | UCAO",
    },
    description: ecariDefaultDescription,
    applicationName: ecariShortName,
    authors: [{ name: ecariOrganizationName, url: absoluteUrl("/") }],
    category: "education",
    creator: ecariOrganizationName,
    keywords: [...ecariKeywords],
    publisher: ecariOrganizationName,
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { sizes: "1280x800", type: "image/webp", url: "/ecari-logo.webp" },
      ],
      apple: [{ url: "/ecari-logo.png" }],
    },
    openGraph: {
      type: "website",
      siteName: ecariSiteName,
      locale: "fr_FR",
      url: "/",
      title: `${ecariShortName} - ${ecariOrganizationName}`,
      description: ecariDefaultDescription,
      images: [ogImage],
    },
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
      index: true,
    },
    twitter: {
      card: "summary_large_image",
      title: `${ecariShortName} - ${ecariOrganizationName}`,
      description: ecariDefaultDescription,
      images: [ogImage.url],
    },
    ...(googleSiteVerification
      ? {
          verification: {
            google: googleSiteVerification,
          },
        }
      : {}),
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
      siteName: ecariSiteName,
      locale: "fr_FR",
      url: options.path,
      title: `${options.title} | ECARI | UCAO`,
      description: options.description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${options.title} | ECARI | UCAO`,
      description: options.description,
      images: [ogImage.url],
    },
  };
}
