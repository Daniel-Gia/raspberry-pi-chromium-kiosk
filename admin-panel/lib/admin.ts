import "server-only";

import bcrypt from "bcryptjs";
import { db } from "./db";

export async function hasAdmin(): Promise<boolean> {
    return (await db.admin.count()) > 0;
}

export async function authenticateAdmin(username: string, password: string) {
    const admin = await db.admin.findUnique({ where: { id: 1 } });
    if (!admin || username.trim() !== admin.username) return null;
    if (!(await bcrypt.compare(password, admin.passwordHash))) return null;
    return { id: String(admin.id), name: admin.username };
}
