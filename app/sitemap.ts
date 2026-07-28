import type { MetadataRoute } from "next";

import { absoluteUrl, ecariPublicRoutes } from "@/lib/ecari/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ecariPublicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
