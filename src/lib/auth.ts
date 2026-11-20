import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export type AdminIdentity = { id: string; login: string; name: string | null; role: string };

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

async function loadAdmin(id: string): Promise<AdminIdentity | null> {
  return prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, login: true, name: true, role: true },
  });
}

/** Для серверных страниц админки: редирект на вход, если нет сессии. */
export async function requireAdminPage(): Promise<AdminIdentity> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const admin = await loadAdmin(session.sub);
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Для API: вернёт null, если пользователь не авторизован. */
export async function getAdminForApi(): Promise<AdminIdentity | null> {
  const session = await getSession();
  if (!session) return null;
  return loadAdmin(session.sub);
}

/**
 * Если в базе ещё нет ни одного администратора, а в окружении заданы
 * ADMIN_LOGIN / ADMIN_PASSWORD — создаём его (запасной вариант к prisma/seed.mjs).
 */
export async function ensureBootstrapAdmin(): Promise<void> {
  const login = process.env.ADMIN_LOGIN?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!login || !password || password.length < 8) return;
  const count = await prisma.adminUser.count();
  if (count > 0) return;
  await prisma.adminUser.create({
    data: { login, passwordHash: await bcrypt.hash(password, 12), name: "Администратор", role: "OWNER" },
  });
}

// Хеш-заглушка для выравнивания времени ответа, когда пользователя не существует
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO7Yd8m0G2Q9V2r1Kx3Q8d2X5Xl1oQmGa";

export async function verifyCredentials(login: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { login } });
  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH).catch(() => false);
    return null;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return user;
}
