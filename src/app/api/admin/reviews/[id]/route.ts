import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getAdminForApi } from "@/lib/auth";
import { isSameOrigin } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { reviewPatchSchema } from "@/lib/review-schema";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = await getAdminForApi();
  if (!admin) return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });

  const { id } = await params;
  const parsed = reviewPatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Проверьте поля" }, { status: 400 });

  const d = parsed.data;
  const data: Prisma.ReviewUpdateInput = {};
  if (d.authorName !== undefined) data.authorName = d.authorName;
  if (d.eventLabel !== undefined) data.eventLabel = d.eventLabel || null;
  if (d.text !== undefined) data.text = d.text;
  if (d.rating !== undefined) data.rating = d.rating;
  if (d.photoUrl !== undefined) data.photoUrl = d.photoUrl || null;
  if (d.status !== undefined) data.status = d.status;
  try {
    const review = await prisma.review.update({ where: { id }, data });
    revalidatePath("/");
    return NextResponse.json({ ok: true, review });
  } catch {
    return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = await getAdminForApi();
  if (!admin) return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
  }
}
