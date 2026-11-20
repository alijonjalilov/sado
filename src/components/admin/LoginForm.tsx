"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";

export function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: fd.get("login"), password: fd.get("password") }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Ошибка входа");
      // Полная навигация, чтобы middleware увидел новую cookie
      window.location.assign(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="login" className="label">
          Логин
        </label>
        <input id="login" name="login" required autoComplete="username" className="input" autoFocus />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Пароль
        </label>
        <div className="relative">
          <input id="password" name="password" type={show ? "text" : "password"} required autoComplete="current-password" className="input pr-12" />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-milk/40 hover:text-milk" aria-label={show ? "Скрыть пароль" : "Показать пароль"}>
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-gold w-full py-4">
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Войти
      </button>
    </form>
  );
}
