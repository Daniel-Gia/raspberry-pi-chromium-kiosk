import LoginForm from "./LoginForm";

export default function LoginPage({ searchParams }: { searchParams?: { from?: string | string[] } }) {
    const from = searchParams?.from;
    const callbackUrl = Array.isArray(from) ? from[0] : from;

    return <LoginForm callbackUrl={callbackUrl ?? "/"} />;
}
