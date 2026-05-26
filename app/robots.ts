import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Autoriser tous les robots sur toutes les pages publiques
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/admin/"],
      },
    ],
    sitemap: "https://winagrotech.com/sitemap.xml",
  };
}
