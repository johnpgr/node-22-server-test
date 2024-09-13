import type { Config } from "drizzle-kit"
import { DB_URL } from "./config/consts.ts"

export default {
    schema: "./drizzle/schema.ts",
    out: "./drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: { url: DB_URL },
    verbose: true,
    strict: true,
} satisfies Config
