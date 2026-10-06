import "server-only";

import { db } from "./db";

export const DEFAULT_KIOSK_URL = "http://localhost/show-ip";

export async function getCurrentUrl(): Promise<string> {
    const settings = await db.kioskSettings.findUnique({ where: { id: 1 } });
    return settings?.url ?? DEFAULT_KIOSK_URL;
}

export async function saveUrl(url: string): Promise<void> {
    await db.kioskSettings.upsert({
        where: { id: 1 },
        create: { id: 1, url },
        update: { url },
    });
}
