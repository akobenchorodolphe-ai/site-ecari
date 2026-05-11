import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSessionSecret } from "@/lib/env";

export const SESSION_COOKIE_NAME = "rectorat_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export type AdminSession = {
  userId: string;
  email: string;
  role: "RECTORAT";
};

function getSecretKey() {
  return new TextEncoder().encode(getSessionSecret());
}

export async function createAdminSessionToken(session: AdminSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function readAdminSessionToken(token: string) {
  const result = await jwtVerify<AdminSession>(token, getSecretKey());
  return result.payload;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await readAdminSessionToken(token);

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    } satisfies AdminSession;
  } catch {
    return null;
  }
}

export async function requireAdminSession(nextPath = "/rectorat/candidats") {
  const session = await getAdminSession();

  if (!session) {
    const target = new URLSearchParams({ next: nextPath });
    redirect(`/rectorat/login?${target.toString()}`);
  }

  return session;
}
