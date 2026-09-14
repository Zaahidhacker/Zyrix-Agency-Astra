import {
  createHmac,
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
export const SESSION_COOKIE = "astra_admin";
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32)
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  return value;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.SITE_URL
    ? new URL(process.env.SITE_URL).origin
    : new URL(request.url).origin;
  return origin === expected;
}
export function clientKey(request: Request) {
  // Only trust a forwarding header if the deployment proxy is explicitly configured to overwrite it.
  const header = process.env.TRUSTED_IP_HEADER;
  const ip = header
    ? request.headers.get(header)?.split(",")[0]?.trim() || "unknown"
    : "shared";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}
export function verifyPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  const [salt, expected] = hash.split(":");
  if (!salt || !expected || !/^[a-f0-9]{128}$/.test(expected)) return false;
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
export function issueSession() {
  const body = Buffer.from(
    JSON.stringify({
      expires: Date.now() + 8 * 60 * 60 * 1000,
      nonce: randomBytes(16).toString("hex"),
    }),
  ).toString("base64url");
  return `${body}.${createHmac("sha256", secret()).update(body).digest("base64url")}`;
}
export function verifySession(token: string) {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return false;
    const actual = createHmac("sha256", secret()).update(body).digest();
    const given = Buffer.from(sig, "base64url");
    if (actual.length !== given.length || !timingSafeEqual(actual, given))
      return false;
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    return (
      typeof data.expires === "number" &&
      data.expires > Date.now() &&
      data.expires <= Date.now() + 8 * 60 * 60 * 1000
    );
  } catch {
    return false;
  }
}
export async function authenticated() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value || "");
}
export async function readJson(request: Request, maxBytes = 32768) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new Error("CONTENT_TYPE");
  if (Number(request.headers.get("content-length") || 0) > maxBytes)
    throw new Error("TOO_LARGE");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("INVALID_JSON");
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error("TOO_LARGE");
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    throw new Error("INVALID_JSON");
  }
}
export function apiError(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "TOO_LARGE")
    return Response.json(
      { error: "This request is too large." },
      { status: 413 },
    );
  if (code === "CONTENT_TYPE" || code === "INVALID_JSON")
    return Response.json(
      { error: "Please send a valid JSON request." },
      { status: 400 },
    );
  console.error(
    "[astra] Request failed:",
    code.replace(/postgres(?:ql)?:\/\/\S+/g, "[redacted]"),
  );
  return Response.json(
    { error: "We couldn’t complete that request. Please try again shortly." },
    { status: 503 },
  );
}
