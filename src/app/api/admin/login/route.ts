import { NextResponse } from "next/server";
import {
  signSession,
  verifyCredentials,
  COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function POST(req: Request) {
  let body: { user?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const user = String(body.user ?? "");
  const password = String(body.password ?? "");

  if (!verifyCredentials(user, password)) {
    return NextResponse.json({ error: "Usuário ou senha incorretos" }, { status: 401 });
  }

  const token = await signSession({
    u: user,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
