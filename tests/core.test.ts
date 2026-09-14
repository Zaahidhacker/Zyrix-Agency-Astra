import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes, scryptSync, randomUUID } from "node:crypto";
import { contentSchema, enquirySchema } from "../lib/schema";
import seed from "../data/content.json";
import { query, rateLimit } from "../lib/db";
import { getContent, saveContent } from "../lib/content";
import {
  issueSession,
  verifySession,
  verifyPassword,
  sameOrigin,
  readJson,
} from "../lib/security";
import { POST } from "../app/api/enquiries/route";
process.env.SQLITE_PATH = join(
  mkdtempSync(join(tmpdir(), "astra-test-")),
  "test.sqlite",
);
process.env.SESSION_SECRET = randomBytes(48).toString("hex");
process.env.SITE_URL = "http://localhost:3000";
const salt = randomBytes(24).toString("hex");
const password = "isolated-test-password-123";
process.env.ADMIN_PASSWORD_HASH = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const payload = () => ({
  name: "Test Visitor",
  email: "visitor@example.com",
  service: "Website design & development",
  budget: "Let’s discuss",
  timeline: "1-3 months",
  message: "We need a new website for our independent bookshop.",
  consent: true,
  company: "",
  requestId: randomUUID(),
});
function request(data: unknown, origin = "http://localhost:3000") {
  return new Request("http://localhost:3000/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(data),
  });
}

test("seed content is valid and concept projects make no fabricated results claims", () => {
  const result = contentSchema.parse(seed);
  assert.equal(result.projects.length, 3);
  assert.ok(result.projects.every((p) => p.concept));
  assert.deepEqual(result.testimonials, []);
});
test("enquiry validation rejects bad email, missing consent and underspecified brief", () => {
  assert.ok(enquirySchema.safeParse(payload()).success);
  for (const patch of [
    { email: "bad" },
    { consent: false },
    { message: "hello" },
  ])
    assert.equal(
      enquirySchema.safeParse({ ...payload(), ...patch }).success,
      false,
    );
});
test("CMS rejects duplicate routes and unsafe media URLs", () => {
  assert.equal(
    contentSchema.safeParse({
      ...seed,
      projects: [seed.projects[0], seed.projects[0]],
    }).success,
    false,
  );
  assert.equal(
    contentSchema.safeParse({
      ...seed,
      projects: [{ ...seed.projects[0], image: "javascript:alert(1)" }],
    }).success,
    false,
  );
});
test("admin credentials and signed sessions reject tampering", () => {
  assert.equal(verifyPassword(password), true);
  assert.equal(verifyPassword("incorrect"), false);
  const token = issueSession();
  assert.equal(verifySession(token), true);
  assert.equal(verifySession(token + "tamper"), false);
  assert.equal(verifySession("bad.payload"), false);
});
test("origin checking rejects cross-site requests and missing Origin", () => {
  assert.equal(sameOrigin(request({})), true);
  assert.equal(sameOrigin(request({}, "https://attacker.invalid")), false);
  assert.equal(sameOrigin(new Request("http://localhost:3000")), false);
});
test("bounded JSON reader rejects oversized and malformed payloads", async () => {
  await assert.rejects(
    () => readJson(request({ text: "a".repeat(300) }), 100),
    /TOO_LARGE/,
  );
  await assert.rejects(
    () =>
      readJson(
        new Request("http://localhost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{",
        }),
      ),
    /INVALID_JSON/,
  );
});
test("persistent rate limiter enforces a shared atomic limit", async () => {
  const results = await Promise.all(
    Array.from({ length: 5 }, () => rateLimit("test-burst", 3, 60000)),
  );
  assert.equal(results.filter(Boolean).length, 3);
});
test("accepted enquiry persists once, retries are idempotent, honeypot does not persist", async () => {
  const data = payload();
  const first = await POST(request(data));
  assert.equal(first.status, 201);
  assert.equal((await first.json()).ok, true);
  const second = await POST(request(data));
  assert.equal(second.status, 200);
  const rows = await query(
    "SELECT id,payload FROM enquiries WHERE request_id=?",
    [data.requestId],
  );
  assert.equal(rows.length, 1);
  assert.equal(JSON.parse(String(rows[0].payload)).email, data.email);
  const spam = payload();
  const honeypot = await POST(request({ ...spam, company: "bot" }));
  assert.equal(honeypot.status, 200);
  assert.equal(
    (
      await query("SELECT id FROM enquiries WHERE request_id=?", [
        spam.requestId,
      ])
    ).length,
    0,
  );
});
test("enquiry endpoint rejects untrusted origins and invalid fields without accepting a lead", async () => {
  assert.equal(
    (await POST(request(payload(), "https://attacker.invalid"))).status,
    403,
  );
  const r = await POST(request({ ...payload(), email: "broken" }));
  assert.equal(r.status, 400);
  assert.ok((await r.json()).fields.email);
});
test("CMS optimistic versioning prevents overwriting concurrent edits", async () => {
  const current = await getContent();
  assert.equal(current.version, 0);
  const next = contentSchema.parse(seed);
  next.seo.title = "Zyrix | Test title";
  assert.equal(await saveContent(next, 0), 1);
  await assert.rejects(() => saveContent(next, 0), /CONFLICT/);
  assert.equal(await saveContent(next, 1), 2);
  await assert.rejects(() => saveContent(next, 1), /CONFLICT/);
  assert.equal((await getContent()).data.seo.title, next.seo.title);
});

test("client request IDs validate without relying on secure-context randomUUID", async () => {
  const { createRequestId } = await import("../lib/request-id");
  const first = createRequestId();
  const second = createRequestId();
  assert.notEqual(first, second);
  assert.equal(
    enquirySchema.safeParse({ ...payload(), requestId: first }).success,
    true,
  );
});
