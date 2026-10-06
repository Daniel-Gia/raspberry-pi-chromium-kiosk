import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { hasAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        if (await hasAdmin()) {
            return NextResponse.json({ error: "An admin account already exists." }, { status: 409 });
        }

        const body = await req.json().catch(() => null);
        if (!body || typeof body.username !== "string" || typeof body.password !== "string" || typeof body.confirmPassword !== "string") {
            return NextResponse.json({ error: "Enter a username, password, and password confirmation" }, { status: 400 });
        }

        const username = body.username.trim();
        if (!username || username.length > 100) {
            return NextResponse.json({ error: "Username must contain 1 to 100 characters" }, { status: 400 });
        }

        if (body.password.length < 8) {
            return NextResponse.json({ error: "Password must contain at least 8 characters" }, { status: 400 });
        }

        if (body.password !== body.confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(body.password, 12);

        await db.admin.create({
            data: {
                id: 1,
                username,
                passwordHash,
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Failed to create admin account", error);
        return NextResponse.json({ error: "Could not create the admin account." }, { status: 500 });
    }
}
