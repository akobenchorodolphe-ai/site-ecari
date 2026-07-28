import type { MetadataRoute } from "next";

import { absoluteUrl, getSiteUrl } from "@/lib/ecari/site";

export default function robots(): MetadataRoute.Robots {
  return {
    host: getSiteUrl(),
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/rectorat/",
        "/storage/",
        "/cerao/inscription/success",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
