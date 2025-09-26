import process from "node:process";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import "dotenv/config";

/**
 * URL used by libsql client - requires file: prefix for local files
 */
const DB_URL = process.env.DATABASE_URL ?? "file:./database.sqlite";

/** libsql client */
export const client = createClient({ 
  url: DB_URL,
  concurrency: 20,
});

/**
 * Apply recommended PRAGMAs on the connection.
 * - WAL (many readers, single writer) + synchronous=NORMAL (durable enough for web apps)
 * - temp_store=MEMORY so sorts/temp tables use RAM
 * - cache_size: 20000 pages (tune to your RAM)
 * - mmap_size: enable memory mapping (test on your host)
 * - busy_timeout to avoid SQLITE_BUSY in short contention windows
 * - foreign_keys ON (if you use FKs)
 */
export async function applyPragmas() {
  try {
    // execute() runs SQL against the libsql client
    await client.execute("PRAGMA journal_mode = WAL;");
    await client.execute("PRAGMA synchronous = NORMAL;");
    await client.execute("PRAGMA temp_store = MEMORY;");
    await client.execute("PRAGMA cache_size = 20000;");
    await client.execute("PRAGMA mmap_size = 268435456;");
    await client.execute("PRAGMA busy_timeout = 5000;");
    await client.execute("PRAGMA foreign_keys = ON;");
    await client.execute("PRAGMA journal_size_limit = 1048576;");

    // verify / log a few values to make sure they applied:
    const jm = await client.execute("PRAGMA journal_mode;");
    const sync = await client.execute("PRAGMA synchronous;");
    console.log("SQLite pragmas applied:", { journal_mode: jm.rows[0], synchronous: sync.rows[0] });
  } catch (err) {
    console.error("Error applying SQLite pragmas:", err);
    throw err;
  }
}

// Apply pragmas on startup
applyPragmas().catch(console.error);

/** Drizzle DB exported for application use */
export const db = drizzle(client, { schema });

/**
 * Simple single-writer queue to serialize writes and avoid writer contention.
 * Use enqueueWrite(() => { return client.execute('BEGIN; ...; COMMIT;') }) or use drizzle's SQL within the job.
 */
type Job = () => Promise<any>;
const writeQueue: Job[] = [];
let writing = false;

export async function enqueueWrite(job: Job) {
  writeQueue.push(job);
  if (writing) return;
  writing = true;
  while (writeQueue.length) {
    const j = writeQueue.shift()!;
    try {
      await j();
    } catch (err) {
      console.error("Write job failed:", err);
    }
  }
  writing = false;
}

/**
 * WAL checkpoint helper: runs a checkpoint and truncates WAL to reclaim disk space.
 * Call periodically (hourly/during low-traffic windows) or after big bulk imports.
 */
export async function walCheckpointTruncate() {
  try {
    // PRAGMA wal_checkpoint(TRUNCATE) will checkpoint and truncate the WAL file.
    // This is fast and safe to call while DB is live.
    const result = await client.execute("PRAGMA wal_checkpoint(TRUNCATE);");
    console.log("wal_checkpoint(TRUNCATE) result:", result);
  } catch (err) {
    console.error("WAL checkpoint failed", err);
  }
}

/** optional: start periodic checkpointing (uncomment to enable) */
// setInterval(walCheckpointTruncate, 1000 * 60 * 60); // every hour

/** convenience maintenance helpers */
export async function analyze() {
  await client.execute("ANALYZE;");
}

export async function vacuumInto(path: string) {
  await client.execute(`VACUUM INTO '${path}';`);
}

/** Example: how to use the writer queue
enqueueWrite(async () => {
  // wrap a batch in a single transaction for big speed up
  await client.execute("BEGIN;");
  for (const row of rows) {
    await client.execute("INSERT INTO posts(author_id, title, body) VALUES (?, ?, ?)", [row.author_id, row.title, row.body]);
  }
  await client.execute("COMMIT;");
});
*/