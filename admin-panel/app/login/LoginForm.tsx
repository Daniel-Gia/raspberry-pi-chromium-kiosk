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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
            <main className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-black">
                <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">Sign in</h1>

                <div className="flex flex-col gap-3">
                    <label htmlFor="username" className="text-sm font-medium text-black dark:text-zinc-50">Username</label>
                    <input
                        id="username"
                        name="username"
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500"
                        placeholder="Username"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label htmlFor="password" className="text-sm font-medium text-black dark:text-zinc-50">Password</label>
                    <input
                        id="password"
                        name="password"
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500"
                        placeholder="Password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="cursor-pointer rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        onClick={onSignIn}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>

                    <div className="min-h-5 text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">{status}</div>
                </div>
            </main>
        </div>
    );
}
