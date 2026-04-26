import "dotenv/config";
import { seedDemoEmployee } from "../src/db/seed.ts";
const e = await seedDemoEmployee();
console.log("Seeded employee:", e.id, e.name);
