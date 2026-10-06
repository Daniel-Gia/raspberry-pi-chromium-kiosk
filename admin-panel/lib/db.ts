import "server-only";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalDb = globalThis as unknown as { db?: PrismaClient };

export const db = globalDb.db ?? new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:../data/kiosk.db" }),
});

if (process.env.NODE_ENV !== "production") globalDb.db = db;
