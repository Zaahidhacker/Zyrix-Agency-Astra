import { cookies } from "next/headers";
import {
  sameOrigin,
  readJson,
  apiError,
  clientKey,
  verifyPassword,
  issueSession,
  SESSION_COOKIE,
} from "@/lib/security";
import { rateLimit } from "@/lib/db";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { status: 403 });
  try {
    if (!process.env.ADMIN_PASSWORD_HASH || !process.env.SESSION_SECRET)
      return Response.json(
        { error: "Admin access is not configured. See the deployment guide." },
        { status: 503 },
      );
    if (!(await rateLimit("login:" + clientKey(request), 5, 15 * 60 * 1000)))
      return Response.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    const data = await readJson(request, 2048);
    if (
      typeof data.password !== "string" ||
      data.password.length > 256 ||
      !verifyPassword(data.password)
    )
      return Response.json({ error: "Incorrect password." }, { status: 401 });
    (await cookies()).set(SESSION_COOKIE, issueSession(), {
      httpOnly: true,
      secure: process.env.SITE_URL?.startsWith("https://") || false,
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60,
    });
    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { status: 403 });
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
