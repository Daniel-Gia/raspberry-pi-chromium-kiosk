import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCurrentUrl, saveUrl } from "@/lib/settings";

export const runtime = "nodejs"; //just to be safe

const CHROME_REMOTE_BASE_URL = process.env.CHROME_REMOTE_URL ?? "http://127.0.0.1:9222";

// Gets the current URL
export const GET = async (req: NextRequest) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json<{ error: string }>({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const url = await getCurrentUrl();
        return NextResponse.json<{ url: string }>({ url }, { status: 200 });
    } catch (error) {
        console.error("Failed to read kiosk URL", error);
        return NextResponse.json({ error: "Could not load the kiosk URL." }, { status: 500 });
    }
};

const normalizeHttpUrl = (input: string): string => {
    const trimmed = input.trim();
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Only http(s) URLs are allowed.");
    }
    return parsed.toString();
};

const openUrlInChromium = async (url: string): Promise<void> => {
    const endpoint = `${CHROME_REMOTE_BASE_URL}/json/new?${encodeURIComponent(url)}`;
    const response = await fetch(endpoint, { method: "PUT" });
    if (!response.ok) {
        throw new Error(`DevTools returned HTTP ${response.status}.`);
    }
};

// Sets a new URL
export const POST = async (req: NextRequest) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json<{ error: string }>({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.url !== "string") {
        return NextResponse.json<{ error: string }>({ error: "Invalid request body." }, { status: 400 });
    }

    let normalizedUrl: string;
    try {
        normalizedUrl = normalizeHttpUrl(body.url);
    } catch (err) {
        return NextResponse.json<{ error: string }>({ error: (err as Error).message }, { status: 400 });
    }

    try {
        await saveUrl(normalizedUrl);
    } catch (err) {
        console.error("Failed to save kiosk URL", err);
        return NextResponse.json({ error: "Could not save the kiosk URL." }, { status: 500 });
    }

    try {
        await openUrlInChromium(normalizedUrl);
    } catch (err) {
        console.error("Failed to navigate Chromium", err);
        return NextResponse.json({ error: "URL saved, but Chromium could not open it." }, { status: 502 });
    }

    return new Response(null, { status: 200 });
};
