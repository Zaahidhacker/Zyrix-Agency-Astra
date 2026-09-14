import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { query } from "@/lib/db";
import { authenticated, sameOrigin, apiError } from "@/lib/security";
export async function POST(request: Request) {
  if (!sameOrigin(request) || !(await authenticated()))
    return Response.json({ error: "Not authorized." }, { status: 403 });
  try {
    const max = 4 * 1024 * 1024 + 16384;
    if (Number(request.headers.get("content-length") || 0) > max)
      return Response.json(
        { error: "Choose an image smaller than 4 MB." },
        { status: 413 },
      );
    const reader = request.body?.getReader();
    if (!reader)
      return Response.json({ error: "No image received." }, { status: 400 });
    let size = 0;
    const chunks: Uint8Array[] = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) {
        await reader.cancel();
        return Response.json(
          { error: "Choose an image smaller than 4 MB." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const parsed = new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type") || "" },
      body: Buffer.concat(chunks),
    });
    const form = await parsed.formData();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 4 * 1024 * 1024
    )
      return Response.json(
        { error: "Use a JPEG, PNG or WebP image under 4 MB." },
        { status: 400 },
      );
    const output = await sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 24000000,
    })
      .rotate()
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84 })
      .toBuffer();
    const id = randomUUID();
    await query("INSERT INTO media (id,payload,created_at) VALUES (?,?,?)", [
      id,
      output.toString("base64"),
      new Date().toISOString(),
    ]);
    return Response.json({ url: `/media/${id}` }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
