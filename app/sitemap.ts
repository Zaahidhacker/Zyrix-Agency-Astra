import type { MetadataRoute } from "next";
import { getContent, siteUrl } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getContent();
  return [
    { url: siteUrl(), changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl()}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ...data.projects
      .filter((p) => p.published)
      .map((p) => ({
        url: `${siteUrl()}/work/${p.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
