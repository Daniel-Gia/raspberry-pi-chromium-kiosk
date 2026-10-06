import { redirect } from "next/navigation";
import { hasAdmin } from "@/lib/admin";
import CreateLoginForm from "./CreateLoginForm";

export const dynamic = "force-dynamic";

export default async function CreateLoginPage() {
    if (await hasAdmin()) redirect("/login");
    return <CreateLoginForm />;
}
