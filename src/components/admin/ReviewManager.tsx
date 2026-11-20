"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "PENDING" | "PUBLISHED" | "HIDDEN";
export type AdminReview = {
  id: string;
  authorName: string;
  eventLabel: string | null;
  text: string;
  rating: number;
  photoUrl: string | null;
  status: Status;
  createdAt: string;
};

const STATUS_LABEL: Record<Status, { label: string; tone: string }> = {
  PENDING: { label: "На модерации", tone: "bg-gold-pale text-gold ring-gold/30" },
  PUBLISHED: { label: "Опубликован", tone: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  HIDDEN: { label: "Скрыт", tone: "bg-milk/5 text-milk/60 ring-milk/15" },
};

async function api(url: string, method: string, body?: unknown) {
  const res = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Ошибка запроса");
}

export function ReviewManager({ reviews }: { reviews: AdminReview[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminReview | "new" | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function run(id: string, fn: () => Promise<void>) {
    setBusy(id);
    setError("");
    try {
      await fn();
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => setEditing("new")} className="btn-gold py-3 text-sm">
        <Plus className="h-4 w-4" /> Добавить отзыв
      </button>
      {error && <p className="text-sm text-rose-600">{error}</p>}

      {editing && <ReviewForm key={editing === "new" ? "new" : editing.id} review={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); router.refresh(); }} />}

      <div className="grid gap-4 lg:grid-cols-2">
        {reviews.map((r) => (
          <article key={r.id} className={cn("rounded-2xl border bg-white shadow-card p-5", r.status === "PENDING" ? "border-gold/30" : "border-milk/10")}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold text-2xl">{r.authorName}</p>
                <p className="text-sm text-milk/45">
                  {r.eventLabel ?? "Без указания мероприятия"} · {r.createdAt}
                </p>
              </div>
              <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", STATUS_LABEL[r.status].tone)}>{STATUS_LABEL[r.status].label}</span>
            </div>
            <div className="mt-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className={cn("h-4 w-4", k < r.rating ? "fill-gold text-gold" : "text-milk/20")} />
              ))}
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-milk/80">{r.text}</p>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-milk/5 pt-4">
              {r.status !== "PUBLISHED" ? (
                <button type="button" disabled={busy === r.id} onClick={() => run(r.id, () => api(`/api/admin/reviews/${r.id}`, "PATCH", { status: "PUBLISHED" }))} className="btn-gold px-4 py-2 text-xs">
                  <Eye className="h-3.5 w-3.5" /> Опубликовать
                </button>
              ) : (
                <button type="button" disabled={busy === r.id} onClick={() => run(r.id, () => api(`/api/admin/reviews/${r.id}`, "PATCH", { status: "HIDDEN" }))} className="btn-outline px-4 py-2 text-xs">
                  <EyeOff className="h-3.5 w-3.5" /> Скрыть
                </button>
              )}
              <button type="button" onClick={() => setEditing(r)} className="btn-outline px-4 py-2 text-xs">
                <Pencil className="h-3.5 w-3.5" /> Изменить
              </button>
              <button
                type="button"
                disabled={busy === r.id}
                onClick={() => {
                  if (window.confirm(`Удалить отзыв «${r.authorName}»?`)) void run(r.id, () => api(`/api/admin/reviews/${r.id}`, "DELETE"));
                }}
                className="btn-outline ml-auto border-rose-300 px-4 py-2 text-xs text-rose-600 hover:border-rose-400"
              >
                {busy === r.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Удалить
              </button>
            </div>
          </article>
        ))}
      </div>
      {!reviews.length && <p className="rounded-2xl border border-dashed border-milk/10 px-5 py-16 text-center text-milk/40">Отзывов пока нет.</p>}
    </div>
  );
}

function ReviewForm({ review, onClose, onSaved }: { review: AdminReview | null; onClose: () => void; onSaved: () => void }) {
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      authorName: String(fd.get("authorName") ?? ""),
      eventLabel: String(fd.get("eventLabel") ?? ""),
      text: String(fd.get("text") ?? ""),
      photoUrl: String(fd.get("photoUrl") ?? ""),
      status: String(fd.get("status") ?? "PUBLISHED"),
      rating,
    };
    setLoading(true);
    setError("");
    try {
      await api(review ? `/api/admin/reviews/${review.id}` : "/api/admin/reviews", review ? "PATCH" : "POST", body);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="relative space-y-4 rounded-2xl border border-gold/30 bg-ink-800 p-6">
      <button type="button" onClick={onClose} className="absolute right-4 top-4 text-milk/40 hover:text-milk" aria-label="Закрыть">
        <X className="h-5 w-5" />
      </button>
      <p className="font-extrabold text-2xl">{review ? "Редактировать отзыв" : "Новый отзыв"}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="authorName" required defaultValue={review?.authorName} placeholder="Имя автора" className="input py-3 text-sm" />
        <input name="eventLabel" defaultValue={review?.eventLabel ?? ""} placeholder="Мероприятие (например: свадьба, 2026)" className="input py-3 text-sm" />
      </div>
      <textarea name="text" required rows={4} defaultValue={review?.text} placeholder="Текст отзыва" className="input resize-y text-sm" />
      <input name="photoUrl" defaultValue={review?.photoUrl ?? ""} placeholder="Ссылка на фото автора (https://…, необязательно)" className="input py-3 text-sm" />
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex gap-1" aria-label="Оценка">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} из 5`}>
              <Star className={cn("h-6 w-6", n <= rating ? "fill-gold text-gold" : "text-milk/25")} />
            </button>
          ))}
        </div>
        <select name="status" defaultValue={review?.status ?? "PUBLISHED"} className="input w-auto py-2.5 text-sm">
          <option value="PUBLISHED">Опубликован</option>
          <option value="PENDING">На модерации</option>
          <option value="HIDDEN">Скрыт</option>
        </select>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-gold py-3 text-sm">
        {loading && <LoaderCircle className="h-4 w-4 animate-spin" />} Сохранить
      </button>
    </form>
  );
}
