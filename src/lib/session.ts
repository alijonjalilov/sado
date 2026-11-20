// Edge-совместимая работа с сессией (используется и в middleware, и на сервере).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "vd_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 дней

export type SessionPayload = { sub: string; login: string; role: string };

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET не задан или короче 32 символов");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ login: payload.login, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getKey());
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string") return null;
    return {
      sub: payload.sub,
      login: typeof payload.login === "string" ? payload.login : "",
      role: typeof payload.role === "string" ? payload.role : "",
    };
  } catch {
    return null;
  }
}
