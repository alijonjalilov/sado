import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Вход в админ-панель", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-5">
      <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px]" />
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="card-glass mt-10 p-8 md:p-10">
          <h1 className="text-4xl">Админ-панель</h1>
          <p className="mt-2 text-sm text-milk/50">Войдите, чтобы управлять заявками и отзывами.</p>
          <LoginForm next={safeNext} />
        </div>
      </div>
    </main>
  );
}
