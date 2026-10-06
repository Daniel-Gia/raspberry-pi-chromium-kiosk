import UrlForm from "./components/UrlForm";
import { redirect } from "next/navigation";
import { hasAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function Home() {
    if (!(await hasAdmin())) redirect("/create-login");
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-2 md:px-6 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <main className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
                <h1 className="mb-1 text-xl font-semibold">Kiosk Admin</h1>
                <UrlForm />
            </main>
        </div>
    );
}
