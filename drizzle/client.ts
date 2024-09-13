import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "./schema.ts"
import { DB_URL } from "../config/consts.ts"

const client = postgres(DB_URL)

export const db = drizzle(client, { schema })
