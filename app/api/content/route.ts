import { contentSchema } from "@/lib/schema";
import { getContent, saveContent } from "@/lib/content";
import { authenticated, sameOrigin, readJson, apiError } from "@/lib/security";
export async function GET() {
  if (!(await authenticated()))
    return Response.json({ error: "Sign in required." }, { status: 401 });
  return Response.json(await getContent(), {
    headers: { "Cache-Control": "no-store" },
  });
}
export async function PUT(request: Request) {
  if (!sameOrigin(request) || !(await authenticated()))
    return Response.json({ error: "Not authorized." }, { status: 403 });
  try {
    const body = await readJson(request, 500000);
    const result = contentSchema.safeParse(body.data);
    if (!result.success || !Number.isInteger(body.version) || body.version < 0)
      return Response.json(
        {
          error: result.success
            ? "Invalid version."
            : result.error.issues
                .map((i) => `${i.path.join(".")}: ${i.message}`)
                .join("\n"),
        },
        { status: 400 },
      );
    return Response.json({
      ok: true,
      version: await saveContent(result.data, body.version),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CONFLICT")
      return Response.json(
        {
          error:
            "Someone updated the content. Reload before saving to avoid overwriting their work.",
        },
        { status: 409 },
      );
    return apiError(error);
  }
}
