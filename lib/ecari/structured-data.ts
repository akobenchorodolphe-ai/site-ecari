import {
  absoluteUrl,
  ecariDefaultDescription,
  ecariOrganizationName,
  ecariPublicRoutes,
  ecariShortName,
} from "@/lib/ecari/site";

export function buildEcariStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": `${absoluteUrl("/")}#organization`,
        "@type": "Organization",
        name: ecariOrganizationName,
        alternateName: ecariShortName,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/ecari-logo.png"),
        description: ecariDefaultDescription,
      },
      {
        "@id": `${absoluteUrl("/")}#website`,
        "@type": "WebSite",
        name: ecariShortName,
        url: absoluteUrl("/"),
        description: ecariDefaultDescription,
        publisher: {
          "@id": `${absoluteUrl("/")}#organization`,
        },
        inLanguage: "fr-FR",
      },
      {
        "@id": `${absoluteUrl("/")}#navigation`,
        "@type": "ItemList",
        itemListElement: ecariPublicRoutes.map((route, index) => ({
          "@type": "SiteNavigationElement",
          position: index + 1,
          name: route.title,
          url: absoluteUrl(route.path),
        })),
      },
    ],
  };
}
