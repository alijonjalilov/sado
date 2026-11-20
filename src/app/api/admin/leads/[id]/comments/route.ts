import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminForApi } from "@/lib/auth";
import { isSameOrigin } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({ text: z.string().trim().min(1, "Комментарий пуст").max(3000) });

export async function POST(req: Request, { params }: Ctx) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = await getAdminForApi();
  if (!admin) return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });

  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ошибка" }, { status: 400 });

  const exists = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });

  const comment = await prisma.leadComment.create({
    data: { leadId: id, text: parsed.data.text, authorId: admin.id },
    select: { id: true, text: true, createdAt: true },
  });
  return NextResponse.json({ ok: true, comment }, { status: 201 });
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = await getAdminForApi();
  if (!admin) return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });

  const { id } = await params;
  const commentId = new URL(req.url).searchParams.get("commentId");
  if (!commentId) return NextResponse.json({ error: "commentId обязателен" }, { status: 400 });
  const res = await prisma.leadComment.deleteMany({ where: { id: commentId, leadId: id } });
  if (!res.count) return NextResponse.json({ error: "Комментарий не найден" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
