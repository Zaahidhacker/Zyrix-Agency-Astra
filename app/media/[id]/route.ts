import { query } from "@/lib/db";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response(null, { status: 404 });
  const rows = await query("SELECT payload FROM media WHERE id=?", [id]);
  if (!rows[0]) return new Response(null, { status: 404 });
  return new Response(
    new Uint8Array(Buffer.from(String(rows[0].payload), "base64")),
    {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public,max-age=31536000,immutable",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
