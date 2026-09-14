import type { Metadata } from "next";
import { authenticated } from "@/lib/security";
import { getContent } from "@/lib/content";
import { query } from "@/lib/db";
import { AdminLogin, AdminPanel } from "@/components/admin/AdminPanel";
import type { Enquiry } from "@/lib/schema";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Studio workspace",
  robots: { index: false, follow: false },
};
function retentionCutoff() {
  return new Date(Date.now() - 30 * 86400000).toISOString();
}
export default async function Admin() {
  if (!(await authenticated())) return <AdminLogin />;
  const [{ data, version }, rows, metrics] = await Promise.all([
    getContent(),
    query(
      "SELECT id,payload,status,created_at FROM enquiries ORDER BY created_at DESC LIMIT 200",
    ),
    query(
      "SELECT name,COUNT(*) AS count,AVG(value) AS average FROM metrics WHERE created_at >= ? GROUP BY name",
      [retentionCutoff()],
    ),
  ]);
  const enquiries = rows.map((r) => ({
    ...JSON.parse(String(r.payload)),
    id: r.id,
    status: r.status,
    createdAt: r.created_at,
  })) as Enquiry[];
  return (
    <AdminPanel
      initial={data}
      initialVersion={version}
      initialEnquiries={enquiries}
      metrics={metrics.map((r) => ({
        name: String(r.name),
        count: Number(r.count),
        average: Number(r.average),
      }))}
    />
  );
}
