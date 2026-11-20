import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureBootstrapAdmin, verifyCredentials } from "@/lib/auth";
import { getClientIp, isSameOrigin, rateLimit } from "@/lib/http";
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/session";

export const dynamic = "force-dynamic";

const schema = z.object({
  login: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Недопустимый источник запроса" }, { status: 403 });

  const ip = getClientIp(req);
  const rl = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: `Слишком много попыток. Повторите через ${Math.ceil(rl.retryAfter / 60)} мин.` }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Введите логин и пароль" }, { status: 400 });

  try {
    await ensureBootstrapAdmin();
    const user = await verifyCredentials(parsed.data.login, parsed.data.password);
    if (!user) return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });

    const token = await createSessionToken({ sub: user.id, login: user.login, role: user.role });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
    return res;
  } catch (e) {
    console.error("[auth/login]", e);
    return NextResponse.json({ error: "Ошибка сервера. Проверьте настройки SESSION_SECRET и базы данных." }, { status: 500 });
  }
}
