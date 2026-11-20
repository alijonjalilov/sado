import { NextResponse } from "next/server";
import { LeadStatus } from "@prisma/client";
import { z } from "zod";
import { getAdminForApi } from "@/lib/auth";
import { isSameOrigin } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.nativeEnum(LeadStatus),
});

export async function PATCH(req: Request, { params }: Ctx) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = await getAdminForApi();
  if (!admin) return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });

  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status: parsed.data.status, statusChangedAt: new Date() },
      select: { id: true, status: true },
    });
    return NextResponse.json({ ok: true, lead });
  } catch {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = await getAdminForApi();
  if (!admin) return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
}
