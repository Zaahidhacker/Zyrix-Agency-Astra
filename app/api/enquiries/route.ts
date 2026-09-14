import { randomUUID } from "node:crypto";
import { enquirySchema } from "@/lib/schema";
import { query, rateLimit } from "@/lib/db";
import {
  sameOrigin,
  clientKey,
  readJson,
  apiError,
  authenticated,
} from "@/lib/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json(
      { error: "Please submit from this website." },
      { status: 403 },
    );
  try {
    if (!(await rateLimit("enquiry:" + clientKey(request), 8, 60 * 60 * 1000)))
      return Response.json(
        { error: "Too many attempts. Please try again in an hour." },
        { status: 429 },
      );
    const result = enquirySchema.safeParse(await readJson(request));
    if (!result.success)
      return Response.json(
        {
          error: "Please check the highlighted fields.",
          fields: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    if (result.data.company)
      return Response.json({ ok: true, reference: "received" });
    const {
      company: _company,
      consent: _consent,
      requestId,
      ...payload
    } = result.data;
    void _company;
    void _consent;
    const id = randomUUID();
    const rows = await query(
      "INSERT INTO enquiries (id,request_id,payload,status,created_at) VALUES (?,?,?,'new',?) ON CONFLICT (request_id) DO NOTHING RETURNING id",
      [id, requestId, JSON.stringify(payload), new Date().toISOString()],
    );
    // Idempotent retries do not expose the original enquiry payload.
    return Response.json(
      {
        ok: true,
        reference: rows[0] ? id.slice(0, 8).toUpperCase() : "ALREADY-RECEIVED",
      },
      { status: rows[0] ? 201 : 200 },
    );
  } catch (error) {
    return apiError(error);
  }
}
export async function GET() {
  if (!(await authenticated()))
    return Response.json({ error: "Sign in required." }, { status: 401 });
  try {
    const rows = await query(
      "SELECT id,payload,status,created_at FROM enquiries ORDER BY created_at DESC LIMIT 200",
    );
    return Response.json(
      {
        enquiries: rows.map((r) => ({
          ...JSON.parse(String(r.payload)),
          id: r.id,
          status: r.status,
          createdAt: r.created_at,
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
export async function PATCH(request: Request) {
  if (!sameOrigin(request) || !(await authenticated()))
    return Response.json({ error: "Not authorized." }, { status: 403 });
  try {
    const data = await readJson(request);
    if (
      typeof data.id !== "string" ||
      !["new", "contacted", "archived"].includes(data.status)
    )
      return Response.json({ error: "Invalid status." }, { status: 400 });
    const rows = await query(
      "UPDATE enquiries SET status=? WHERE id=? RETURNING id",
      [data.status, data.id],
    );
    return Response.json({ ok: !!rows[0] }, { status: rows[0] ? 200 : 404 });
  } catch (error) {
    return apiError(error);
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request) || !(await authenticated()))
    return Response.json({ error: "Not authorized." }, { status: 403 });
  try {
    const data = await readJson(request, 2048);
    if (typeof data.id !== "string")
      return Response.json({ error: "Invalid enquiry." }, { status: 400 });
    const rows = await query("DELETE FROM enquiries WHERE id=? RETURNING id", [
      data.id,
    ]);
    return Response.json({ ok: !!rows[0] }, { status: rows[0] ? 200 : 404 });
  } catch (error) {
    return apiError(error);
  }
}
