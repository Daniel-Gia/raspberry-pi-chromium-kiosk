"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreateLoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (password !== confirmPassword) {
            setStatus("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        setStatus("Creating account...");
        
        try {
            const response = await fetch("/api/create-login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password, confirmPassword }),
            });
            const data = await response.json();
            if (!response.ok) {
                setStatus(data.error ?? "Account creation failed.");
                return;
            }
            router.replace("/login");
            router.refresh();
        } catch {
            setStatus("Request failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputClass = "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder:text-zinc-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-zinc-400 dark:focus:ring-zinc-400";

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <main className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
                <h1 className="mb-2 text-xl font-semibold">Create admin login</h1>
                <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-300">Set up the account you will use to manage this kiosk.</p>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <label htmlFor="username" className="text-sm font-medium">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        autoComplete="username"
                        required
                        maxLength={100}
                        className={inputClass}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />

                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        aria-describedby="password-help"
                        className={inputClass}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <p id="password-help" className="text-sm text-zinc-600 dark:text-zinc-300">
                        Use at least 8 characters (up to 72 UTF-8 bytes).
                    </p>

                    <label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirm password
                    </label>
                    <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        className={inputClass}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white dark:focus-visible:outline-zinc-400"
                    >
                        {isSubmitting ? "Creating account..." : "Create login"}
                    </button>
                    
                    <div className="min-h-5 text-sm text-zinc-600 dark:text-zinc-300" role="status">
                        {status}
                    </div>
                </form>
            </main>
        </div>
    );
}
