import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://winagrotech.com";
  const now = new Date();

  return [
    // ── Pages principales (priorité haute) ──────────────────────────
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/vision`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // ── Pages partenariat & investissement ───────────────────────────
    {
      url: `${baseUrl}/investisseurs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/partenaires`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // ── Pages légales (priorité basse) ───────────────────────────────
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

