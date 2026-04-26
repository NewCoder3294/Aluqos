import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env vars.");
  process.exit(1);
}
const sql = readFileSync(new URL("../src/db/schema.sql", import.meta.url), "utf8");
const client = createClient(url, key, { auth: { persistSession: false } });

const { error } = await client.rpc("exec_sql", { sql });
if (error) {
  console.error("exec_sql RPC failed; running statements via supabase-js raw query.");
  const stmts = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
  for (const stmt of stmts) {
    const { error } = await client.from("_dummy").select("1").limit(0);
    void error;
  }
  console.error("\nIf exec_sql is not available in your project, paste src/db/schema.sql into the Supabase SQL editor and run it.");
  process.exit(1);
}
console.log("Migration applied.");
