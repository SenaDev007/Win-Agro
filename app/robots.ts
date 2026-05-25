import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/mentions-legales", "/confidentialite"],
      disallow: ["/admin", "/api"],
    },
    sitemap: "https://winagrotech.com/sitemap.xml",
  };
}
