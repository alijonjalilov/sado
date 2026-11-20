"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { LeadStatus } from "@prisma/client";
import { Check, LoaderCircle, Trash2 } from "lucide-react";
import { STATUS_META, STATUS_ORDER } from "@/lib/leads";
import { cn } from "@/lib/utils";

async function api(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Ошибка запроса");
  return data;
}

export function StatusControl({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function change(s: LeadStatus) {
    if (s === current) return;
    const prev = current;
    setCurrent(s);
    setError("");
    try {
      await api(`/api/admin/leads/${leadId}`, "PATCH", { status: s });
      startTransition(() => router.refresh());
    } catch (e) {
      setCurrent(prev);
      setError((e as Error).message);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => change(s)}
            disabled={pending}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm transition",
              current === s ? cn("ring-1 ring-inset", STATUS_META[s].tone, "border-transparent font-semibold") : "border-milk/10 text-milk/60 hover:border-milk/30 hover:text-milk",
            )}
          >
            {current === s && <Check className="h-3.5 w-3.5" />}
            {STATUS_META[s].label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}

export function DeleteLeadButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function remove() {
    setLoading(true);
    try {
      await api(`/api/admin/leads/${leadId}`, "DELETE");
      router.push("/admin/leads");
      router.refresh();
    } catch {
      setLoading(false);
      setConfirm(false);
    }
  }

  if (!confirm)
    return (
      <button type="button" onClick={() => setConfirm(true)} className="btn-outline w-full border-rose-300 py-3 text-sm text-rose-600 hover:border-rose-400 hover:text-rose-700">
        <Trash2 className="h-4 w-4" /> Удалить заявку
      </button>
    );

  return (
    <div className="rounded-xl border border-rose-300 bg-rose-50 p-4">
      <p className="text-sm text-rose-800">Удалить заявку безвозвратно вместе с комментариями?</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={remove} disabled={loading} className="btn flex-1 bg-rose-500 py-2.5 text-sm text-white hover:bg-rose-400">
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Да, удалить"}
        </button>
        <button type="button" onClick={() => setConfirm(false)} className="btn-outline flex-1 py-2.5 text-sm">
          Отмена
        </button>
      </div>
    </div>
  );
}

export type CommentView = { id: string; text: string; createdAt: string; author: string | null };

export function Comments({ leadId, comments }: { leadId: string; comments: CommentView[] }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api(`/api/admin/leads/${leadId}/comments`, "POST", { text });
      setText("");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      await api(`/api/admin/leads/${leadId}/comments?commentId=${encodeURIComponent(id)}`, "DELETE");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <form onSubmit={add} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={3000}
          placeholder="Внутренний комментарий — клиент его не видит"
          className="input resize-y text-sm"
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button type="submit" disabled={loading || !text.trim()} className="btn-gold py-2.5 text-sm">
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />} Добавить комментарий
        </button>
      </form>
      <ul className="mt-6 space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="group rounded-xl border border-milk/10 bg-ink/40 p-4">
            <p className="whitespace-pre-line text-sm text-milk/85">{c.text}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-milk/35">
              <span>
                {c.author ?? "Администратор"} · {c.createdAt}
              </span>
              <button type="button" onClick={() => remove(c.id)} className="opacity-60 transition hover:text-rose-600 group-hover:opacity-100" aria-label="Удалить комментарий">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
        {!comments.length && <li className="text-sm text-milk/35">Комментариев пока нет.</li>}
      </ul>
    </div>
  );
}
