import type { MetadataRoute } from "next";

import {
  ecariDefaultDescription,
  ecariOrganizationName,
  ecariShortName,
} from "@/lib/ecari/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${ecariShortName} - ${ecariOrganizationName}`,
    short_name: ecariShortName,
    description: ecariDefaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#efe9df",
    theme_color: "#9b563d",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/ecari-logo.webp",
        sizes: "1280x800",
        type: "image/webp",
      },
    ],
  };
}
