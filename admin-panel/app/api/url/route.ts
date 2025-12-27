import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getToken } from "next-auth/jwt";

export const runtime = "nodejs"; //just to be safe

const DEFAULT_URL_FILE_PATH = process.env.DEFAULT_URL_FILE ?? path.join(process.cwd(), "..", "settings", "default_url.txt");

const CHROME_REMOTE_BASE_URL = process.env.CHROME_REMOTE_URL ?? "http://127.0.0.1:9222";

const readCurrentUrl = async (): Promise<string> => {
    try {
        const firstLine = (await readFile(DEFAULT_URL_FILE_PATH, "utf8")).split(/\r?\n/)[0];
        return (firstLine ?? "").trim();
    } catch {
        return "";
    }
};


// Gets the current URL
export const GET = async (req: NextRequest) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json<{ error: string }>({ error: "Unauthorized" }, { status: 401 });
    }
    const url = await readCurrentUrl();
    return NextResponse.json<{ url: string }>({ url }, { status: 200 });
};

const normalizeHttpUrl = (input: string): string => {
    const trimmed = input.trim();
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Only http(s) URLs are allowed.");
    }
    return parsed.toString();
};

const saveUrlToFile = async (url: string): Promise<void> => {
    await writeFile(DEFAULT_URL_FILE_PATH, `${url}\n`, "utf8");
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
        await saveUrlToFile(normalizedUrl);
        await openUrlInChromium(normalizedUrl);
    } catch (err) {
        return NextResponse.json<{ error: string }>({ error: (err as Error).message }, { status: 500 });
    }
    return new Response(null, { status: 200 });
};
