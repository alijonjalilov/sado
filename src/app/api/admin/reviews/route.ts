import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminForApi } from "@/lib/auth";
import { isSameOrigin } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/review-schema";

export const dynamic = "force-dynamic";

/** Админ добавляет отзыв вручную (например, перенесённый из Instagram). */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = await getAdminForApi();
  if (!admin) return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });

  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Проверьте поля" }, { status: 400 });

  const host = await prisma.host.findUnique({ where: { slug: "main" }, select: { id: true } });
  const review = await prisma.review.create({
    data: {
      authorName: parsed.data.authorName,
      eventLabel: parsed.data.eventLabel || null,
      text: parsed.data.text,
      rating: parsed.data.rating,
      photoUrl: parsed.data.photoUrl || null,
      status: parsed.data.status ?? "PUBLISHED",
      hostId: host?.id ?? null,
    },
  });
  revalidatePath("/");
  return NextResponse.json({ ok: true, review }, { status: 201 });
}
