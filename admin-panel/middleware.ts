import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/api/auth") ||
        pathname === "/login" ||
        pathname === "/show-ip" ||
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token) return NextResponse.next();

    if (pathname.startsWith("/api/")) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image).*)"],
};
