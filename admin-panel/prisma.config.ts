import { closeSync, mkdirSync, openSync } from "node:fs";
import { dirname, resolve } from "node:path";
import nextEnv from "@next/env";
import { defineConfig } from "prisma/config";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const url = process.env.DATABASE_URL ?? "file:../data/kiosk.db";
if (!url.startsWith("file:") || !url.slice(5)) {
    throw new Error("DATABASE_URL must be a SQLite file: URL.");
}

const databasePath = resolve(url.slice(5));
mkdirSync(dirname(databasePath), { recursive: true });
closeSync(openSync(databasePath, "a"));

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: { path: "prisma/migrations" },
    datasource: { url: `file:${databasePath.replaceAll("\\", "/")}` },
});
