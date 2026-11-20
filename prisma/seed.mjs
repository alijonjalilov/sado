// Запускается при каждом старте (npm start). Идемпотентен:
// создаёт основного ведущего и первого администратора, если их ещё нет.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.host.upsert({
    where: { slug: "main" },
    update: {},
    create: { slug: "main", name: "Основной ведущий" },
  });

  const login = process.env.ADMIN_LOGIN?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!login || !password) {
    console.warn("[seed] ADMIN_LOGIN / ADMIN_PASSWORD не заданы — администратор не создан.");
    return;
  }
  if (password.length < 8) {
    console.warn("[seed] ADMIN_PASSWORD короче 8 символов — администратор не создан.");
    return;
  }

  const existing = await prisma.adminUser.findUnique({ where: { login } });
  if (!existing) {
    const host = await prisma.host.findUnique({ where: { slug: "main" } });
    await prisma.adminUser.create({
      data: {
        login,
        passwordHash: await bcrypt.hash(password, 12),
        name: "Администратор",
        role: "OWNER",
        hostId: host?.id ?? null,
      },
    });
    console.log(`[seed] Создан администратор «${login}».`);
  } else if (process.env.ADMIN_RESET_PASSWORD === "true") {
    await prisma.adminUser.update({
      where: { login },
      data: { passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log(`[seed] Пароль администратора «${login}» обновлён.`);
  }
}

main()
  .catch((e) => {
    console.error("[seed] Ошибка:", e);
    // Не блокируем запуск сайта из-за ошибки сидинга
  })
  .finally(() => prisma.$disconnect());
