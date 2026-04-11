import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

declare global {
  var _sql: ReturnType<typeof postgres> | undefined;
}

const sql =
  global._sql ??
  postgres(process.env.DB_URL!, {
    ssl: "require",
    max: 10, // max concurrent connections
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global._sql = sql; // reuse di development (hot reload)
}

export default sql;
