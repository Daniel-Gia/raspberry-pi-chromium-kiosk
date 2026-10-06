import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateAdmin } from "@/lib/admin";

export const runtime = "nodejs";

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const username = (credentials?.username ?? "").toString();
                const password = (credentials?.password ?? "").toString();

                if (!username || !password) return null;

                return authenticateAdmin(username, password);
            },
        }),
    ],
});

export { handler as GET, handler as POST };
