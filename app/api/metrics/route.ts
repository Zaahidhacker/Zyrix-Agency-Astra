import { randomUUID } from "node:crypto";
import { query, rateLimit } from "@/lib/db";
import { sameOrigin, clientKey, readJson, apiError } from "@/lib/security";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    if (!(await rateLimit("metrics:" + clientKey(request), 60, 60000)))
      return new Response(null, { status: 429 });
    const data = await readJson(request, 2048);
    if (
      !["LCP", "CLS", "INP"].includes(data.name) ||
      typeof data.value !== "number" ||
      !Number.isFinite(data.value) ||
      data.value < 0 ||
      !["/", "/work/forma-audio", "/work/monument", "/work/relay"].includes(
        data.route,
      )
    )
      return new Response(null, { status: 400 });
    await query("DELETE FROM metrics WHERE created_at < ?", [
      new Date(Date.now() - 30 * 86400000).toISOString(),
    ]);
    await query(
      "INSERT INTO metrics (id,name,value,route,created_at) VALUES (?,?,?,?,?)",
      [
        randomUUID(),
        data.name,
        data.value,
        data.route,
        new Date().toISOString(),
      ],
    );
    return new Response(null, { status: 204 });
  } catch (error) {
    return apiError(error);
  }
}
