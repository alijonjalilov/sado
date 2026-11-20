import "server-only";

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Защита от CSRF для изменяющих запросов: Origin должен совпадать с хостом. */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // не-браузерные клиенты / старые браузеры; cookie SameSite=Lax страхует
  try {
    const originHost = new URL(origin).host;
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return !!host && originHost === host;
  } catch {
    return false;
  }
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Простой лимитер в памяти процесса (достаточно для одного инстанса на Railway). */
export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return { ok: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > limit) return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  return { ok: true, retryAfter: 0 };
}
