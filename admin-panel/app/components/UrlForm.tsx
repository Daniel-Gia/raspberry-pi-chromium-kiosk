"use client";

import React, { useEffect, useState } from "react";

const UrlForm = () => {
    const [url, setUrl] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        const getCurrentUrl = async (): Promise<void> => {
            try {
                const response = await fetch("/api/url", { cache: "no-store" });
                const data = await response.json();
                if (!response.ok) {
                    setStatus(data.error ?? "Could not load the kiosk URL.");
                    return;
                }
                setUrl(typeof data.url === "string" ? data.url : "");
            } catch {
                setStatus("Could not load the kiosk URL.");
            }
        };

        getCurrentUrl();
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Updating...");
        try {
            const response = await fetch("/api/url", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ url }),
            });
            if (!response.ok) {
                const data = await response.json();
                setStatus(data.error ?? "Update failed.");
                return;
            }
            setStatus("Updated.");
        } catch {
            setStatus("Request failed.");
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
            <label htmlFor="kiosk-url" className="text-sm font-medium">Kiosk URL</label>
            <input
                id="kiosk-url"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                inputMode="url"
            />
            <button className="cursor-pointer rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white dark:focus-visible:outline-zinc-400" type="submit">
                Save + Open on kiosk
            </button>
            <div className="min-h-5 text-sm text-zinc-600 dark:text-zinc-300" role="status">{status}</div>
        </form>
    );
};

export default UrlForm;
