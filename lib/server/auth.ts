import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Minimal single-admin auth for /admin.
 * - Password: ADMIN_PASSWORD (Cloudflare secret)
 * - Session: HMAC-SHA256 signed cookie using ADMIN_SESSION_SECRET (Web Crypto → works on Workers)
 */

export const SESSION_COOKIE = "tar7a_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

const enc = new TextEncoder();

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be set (32+ chars)");
  return secret;
}

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

/** Constant-time string comparison (compares SHA-256 digests so lengths never leak). */
async function safeEqual(a: string, b: string) {
  const [ha, hb] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export async function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export async function createSession() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin.${exp}`;
  const token = `${payload}.${await hmac(payload)}`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  try {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3 || parts[0] !== "admin") return false;
    const exp = Number(parts[1]);
    if (!Number.isFinite(exp) || exp < Date.now() / 1000) return false;
    return safeEqual(parts[2], await hmac(`${parts[0]}.${parts[1]}`));
  } catch {
    return false;
  }
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
