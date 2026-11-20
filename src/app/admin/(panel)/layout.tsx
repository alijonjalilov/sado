import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/ui/Logo";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Админ-панель", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  const [newCount, pendingReviews] = await Promise.all([
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.review.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="min-h-dvh bg-ink lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-30 border-b border-milk/10 bg-ink-800/95 backdrop-blur lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-6 lg:py-8">
          <Logo href="/admin" />
          <p className="hidden text-xs text-milk/40 lg:mt-3 lg:block">Вы вошли как {admin.name ?? admin.login}</p>
        </div>
        <div className="px-3 pb-3 lg:px-4">
          <AdminNav newCount={newCount} pendingReviews={pendingReviews} />
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 md:px-10 md:py-12">{children}</main>
    </div>
  );
}
