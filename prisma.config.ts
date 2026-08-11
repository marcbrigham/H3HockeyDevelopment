import "dotenv/config";
import { defineConfig } from "prisma/config";

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  throw new Error("DATABASE_URL must be set to a PostgreSQL connection string");
}

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: DB_URL },
});
