import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { findAdminByEmail } from "@/lib/auth/repository";
import { createAdminSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

function safeNextPath(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/rectorat/candidats";
  }

  return raw;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = typeof formData.get("email") === "string" ? String(formData.get("email")) : "";
  const password =
    typeof formData.get("password") === "string" ? String(formData.get("password")) : "";
  const nextPath = safeNextPath(formData.get("next"));

  const redirectUrl = new URL(nextPath, request.url);
  const loginUrl = new URL("/rectorat/login", request.url);
  loginUrl.searchParams.set("next", nextPath);

  if (!email || !password) {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl, 303);
  }

  const admin = await findAdminByEmail(email);

  if (!admin) {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl, 303);
  }

  const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!isValidPassword) {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl, 303);
  }

  const token = await createAdminSessionToken({
    userId: admin.id.toString(),
    email: admin.email,
    role: "RECTORAT",
  });

  const response = NextResponse.redirect(redirectUrl, 303);
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
