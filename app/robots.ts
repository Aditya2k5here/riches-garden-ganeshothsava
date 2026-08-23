import type { MetadataRoute } from "next";

import { siteUrl } from "@/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The children's running order carries minors' names. It stays out of
      // search results; the committee shares the link directly instead.
      disallow: ["/programme/children"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
