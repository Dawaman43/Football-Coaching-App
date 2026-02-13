import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "../config/env";

function normalizeConnectionString(raw: string) {
  try {
    const url = new URL(raw);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("ssl");
    url.searchParams.delete("sslrootcert");
    return url.toString();
  } catch {
    return raw;
  }
}

const connectionString = env.databaseSsl ? normalizeConnectionString(env.databaseUrl) : env.databaseUrl;

export const pool = new Pool({ connectionString, ssl: env.databaseSsl });

export const db = drizzle(pool);
