import UrlForm from "./components/UrlForm";

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-2 md:px-6 font-sans">
            <main className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-6">
                <h1 className="mb-1 text-xl font-semibold text-black">Kiosk Admin</h1>
                <UrlForm />
            </main>
        </div>
    );
}
