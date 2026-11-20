"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Inbox, LayoutDashboard, LogOut, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Заявки", icon: Inbox },
  { href: "/admin/reviews", label: "Отзывы", icon: MessageSquareQuote },
];

export function AdminNav({ newCount, pendingReviews }: { newCount: number; pendingReviews: number }) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    window.location.assign("/admin/login");
  }

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-1.5" aria-label="Админ-меню">
      {ITEMS.map((it) => {
        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        const badge = it.href === "/admin/leads" ? newCount : it.href === "/admin/reviews" ? pendingReviews : 0;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
              active ? "bg-gold/10 text-gold" : "text-milk/60 hover:bg-milk/5 hover:text-milk",
            )}
          >
            <it.icon className="h-4 w-4" />
            {it.label}
            {badge > 0 && <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-white">{badge}</span>}
          </Link>
        );
      })}
      <div className="hidden lg:my-4 lg:block lg:h-px lg:bg-milk/10" />
      <Link href="/" target="_blank" className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm text-milk/50 transition hover:text-milk">
        <ExternalLink className="h-4 w-4" /> Открыть сайт
      </Link>
      <button type="button" onClick={logout} className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-milk/50 transition hover:text-rose-600">
        <LogOut className="h-4 w-4" /> Выйти
      </button>
    </nav>
  );
}
