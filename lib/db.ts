import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { DatabaseSync } from "node:sqlite";
import postgres from "postgres";

type Row = Record<string, unknown>;
type Value = string | number | null;
let sqlite: DatabaseSync | undefined;
let pg: ReturnType<typeof postgres> | undefined;
let initialized: Promise<void> | undefined;
async function queryRaw(sql: string, values: Value[] = []): Promise<Row[]> {
  if (process.env.DATABASE_URL) {
    pg ??= postgres(process.env.DATABASE_URL, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: process.env.DATABASE_SSL === "require" ? "require" : undefined,
    });
    let n = 0;
    const text = sql.replace(/\?/g, () => `$${++n}`);
    return [...(await pg.unsafe(text, values))] as Row[];
  }
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_SQLITE !== "true"
  )
    throw new Error(
      "Production requires DATABASE_URL or ALLOW_SQLITE=true with a persistent volume.",
    );
  if (!sqlite) {
    const path = process.env.SQLITE_PATH || ".data/astra.sqlite";
    mkdirSync(dirname(path), { recursive: true });
    const { DatabaseSync } = await import("node:sqlite");
    sqlite = new DatabaseSync(path);
    sqlite.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;");
  }
  const statement = sqlite.prepare(sql);
  if (/^\s*(SELECT|WITH)/i.test(sql) || /RETURNING/i.test(sql))
    return statement.all(...values) as Row[];
  statement.run(...values);
  return [];
}
async function initialize() {
  await queryRaw(
    "CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, payload TEXT NOT NULL, created_at TEXT NOT NULL)",
  );
  await queryRaw(
    "CREATE TABLE IF NOT EXISTS content (id TEXT PRIMARY KEY, payload TEXT NOT NULL, version INTEGER NOT NULL, updated_at TEXT NOT NULL)",
  );
  await queryRaw(
    "CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, request_id TEXT UNIQUE NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL)",
  );
  await queryRaw(
    "CREATE TABLE IF NOT EXISTS limits (id TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires BIGINT NOT NULL)",
  );
  await queryRaw(
    "CREATE TABLE IF NOT EXISTS metrics (id TEXT PRIMARY KEY, name TEXT NOT NULL, value REAL NOT NULL, route TEXT NOT NULL, created_at TEXT NOT NULL)",
  );
}
export async function query(sql: string, values: Value[] = []): Promise<Row[]> {
  if (!initialized)
    initialized = initialize().catch((e) => {
      initialized = undefined;
      throw e;
    });
  await initialized;
  return queryRaw(sql, values);
}
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<boolean> {
  const now = Date.now();
  await query("DELETE FROM limits WHERE expires < ?", [now]);
  const rows = await query(
    "INSERT INTO limits (id,hits,expires) VALUES (?,1,?) ON CONFLICT (id) DO UPDATE SET hits=limits.hits+1 RETURNING hits",
    [key, now + windowMs],
  );
  return Number(rows[0]?.hits) <= max;
}
