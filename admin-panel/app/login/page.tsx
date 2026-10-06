import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";
import { hasAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
    if (!(await hasAdmin())) redirect("/create-login");
    return <LoginForm />;
}
