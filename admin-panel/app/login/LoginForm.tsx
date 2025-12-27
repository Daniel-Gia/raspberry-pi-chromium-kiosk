"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string>("");

    const safeCallbackUrl = callbackUrl.startsWith("/") ? callbackUrl : "/";

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("Signing in...");

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
            callbackUrl: safeCallbackUrl,
        });

        if (!res) {
            setStatus("Sign-in failed.");
            return;
        }

        if (res.error) {
            setStatus("Invalid username or password.");
            return;
        }

        window.location.assign(safeCallbackUrl);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
            <main className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-black">
                <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">Sign in</h1>

                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-black dark:text-zinc-50">Username</label>
                    <input
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500"
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label className="text-sm font-medium text-black dark:text-zinc-50">Password</label>
                    <input
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500"
                        placeholder="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800" type="submit">
                        Sign in
                    </button>

                    <div className="min-h-5 text-sm text-zinc-600 dark:text-zinc-400">{status}</div>
                </form>
            </main>
        </div>
    );
}
