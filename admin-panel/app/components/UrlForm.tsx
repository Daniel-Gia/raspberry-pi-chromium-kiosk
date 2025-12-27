"use client";

import React, { useEffect, useState } from "react";

const UrlForm = () => {
    const [url, setUrl] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        const getCurrentUrl = async (): Promise<void> => {
            const response = await fetch("/api/url", { cache: "no-store" });
            const data = await response.json();
            setUrl(typeof data.url === "string" ? data.url : "");
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
            <label className="text-sm font-medium">Kiosk URL</label>
            <input
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                inputMode="url"
            />
            <button className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800" type="submit">
                Save + Open on kiosk
            </button>
            <div className="min-h-5 text-sm text-zinc-600">{status}</div>
        </form>
    );
};

export default UrlForm;
