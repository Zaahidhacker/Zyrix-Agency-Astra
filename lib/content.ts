import { cache } from "react";
import seed from "@/data/content.json";
import { contentSchema, type SiteContent } from "./schema";
import { query } from "./db";
export const getContent = cache(
  async (): Promise<{ data: SiteContent; version: number }> => {
    let rows: Awaited<ReturnType<typeof query>> = [];
    try {
      rows = await query("SELECT payload,version FROM content WHERE id=?", [
        "site",
      ]);
    } catch (error) {
      // The public site remains readable during first deployment. Write routes
      // still require DATABASE_URL, so no enquiries are silently discarded.
      if (
        !(error instanceof Error) ||
        !error.message.includes("Production requires DATABASE_URL")
      )
        throw error;
    }
    if (!rows[0]) return { data: contentSchema.parse(seed), version: 0 };
    return {
      data: contentSchema.parse(JSON.parse(String(rows[0].payload))),
      version: Number(rows[0].version),
    };
  },
);
export async function saveContent(data: SiteContent, version: number) {
  const payload = JSON.stringify(contentSchema.parse(data));
  const now = new Date().toISOString();
  const rows =
    version === 0
      ? await query(
          "INSERT INTO content (id,payload,version,updated_at) VALUES (?,?,1,?) ON CONFLICT (id) DO NOTHING RETURNING version",
          ["site", payload, now],
        )
      : await query(
          "UPDATE content SET payload=?,version=version+1,updated_at=? WHERE id=? AND version=? RETURNING version",
          [payload, now, "site", version],
        );
  if (!rows[0]) throw new Error("CONFLICT");
  return Number(rows[0].version);
}
export function siteUrl() {
  return process.env.SITE_URL || "http://localhost:3000";
}
