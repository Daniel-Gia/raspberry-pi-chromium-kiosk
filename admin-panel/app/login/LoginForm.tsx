"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSignIn = async () => {
        if (!username.trim() || !password) {
            setStatus("Enter your username and password.");
            return;
        }

        setStatus("Signing in...");
        setIsSubmitting(true);

        try {
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (!res) {
                setStatus("Sign-in failed.");
                return;
            }

            if (res.error) {
                setStatus("Invalid username or password.");
                return;
            }

            setStatus("Signed in. Loading...");
            router.replace("/");
        } catch (error) {
            console.error("Sign-in request failed", error);
            setStatus("Sign-in failed. Check the browser console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <main className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
                <h1 className="mb-6 text-xl font-semibold">Sign in</h1>

                <div className="flex flex-col gap-3">
                    <label htmlFor="username" className="text-sm font-medium">Username</label>
                    <input
                        id="username"
                        name="username"
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                        placeholder="Username"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <input
                        id="password"
                        name="password"
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                        placeholder="Password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="cursor-pointer rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white dark:focus-visible:outline-zinc-400"
                        type="button"
                        onClick={onSignIn}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>

                    <div className="min-h-5 text-sm text-zinc-600 dark:text-zinc-300" aria-live="polite">{status}</div>
                </div>
            </main>
        </div>
    );
}
