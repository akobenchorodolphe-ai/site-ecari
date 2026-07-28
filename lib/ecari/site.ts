import { getAppUrl } from "@/lib/env";

export const ecariSiteName = "ECARI | UCAO";
export const ecariOrganizationName =
  "Espace Conseil d'Appui a la Recherche et a l'Innovation";
export const ecariShortName = "ECARI";

export const ecariDefaultDescription =
  "Site officiel ECARI, Espace Conseil d'Appui a la Recherche et a l'Innovation, pour soutenir la recherche, l'innovation, le recensement CERAO, les preinscriptions et les partenariats UCAO.";

export const ecariKeywords = [
  "ECARI",
  "Espace Conseil d'Appui a la Recherche et a l'Innovation",
  "UCAO",
  "CERAO",
  "recherche universitaire",
  "innovation universitaire",
  "recensement chercheur CERAO",
  "preinscription etudiant UCAO",
  "partenaire financier recherche innovation",
] as const;

export const ecariPublicRoutes = [
  {
    path: "/",
    title: "Accueil",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/a-propos",
    title: "A propos",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/contact",
    title: "Contact",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/faire-un-don",
    title: "Faire un don",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/partenaire-financier",
    title: "Partenaire financier",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/preinscription-etudiant",
    title: "Preinscription etudiant",
    changeFrequency: "monthly",
    priority: 0.65,
  },
  {
    path: "/rectorat-ucao",
    title: "Rectorat UCAO",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/oeuvres-pere-spirituel",
    title: "Oeuvres du pere spirituel",
    changeFrequency: "monthly",
    priority: 0.6,
  },
] as const;

export function getSiteUrl() {
  return getAppUrl().replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath === "/" ? "" : normalizedPath}`;
}
