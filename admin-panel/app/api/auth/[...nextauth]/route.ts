import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

type AuthInfo = {
    username: string;
    passwordHash: string;
};

const readAuthEnv = (): AuthInfo | null => {
    const username = process.env.ADMIN_PANEL_USERNAME;
    const passwordHash = process.env.ADMIN_PANEL_PASSWORD_HASH;

    if (typeof username !== "string" || username.trim() === "") return null;
    if (typeof passwordHash !== "string" || passwordHash.trim() === "") return null;

    return {
        username: username.trim(),
        passwordHash: passwordHash.trim(),
    };
};

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

                const auth = readAuthEnv();
                if (!auth) return null;

                if (username !== auth.username) return null;

                const ok = await bcrypt.compare(password, auth.passwordHash);
                if (!ok) return null;

                return { id: auth.username, name: auth.username };
            },
        }),
    ],
});

export { handler as GET, handler as POST };
