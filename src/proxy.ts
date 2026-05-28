import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const token = req.cookies.get("admin_session")?.value;
    if (!token || !(await verifySession(token))) {
      const url = new URL("/admin/login", req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
