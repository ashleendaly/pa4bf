import { type Config } from "drizzle-kit";

import { env } from "~/env.js";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  out: "./migrations",
  verbose: true,
  strict: true,
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["pa4bf_*"],
} satisfies Config;
