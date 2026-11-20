# VEDUSHIY — платформа для заказа ведущего мероприятий

Премиальный сайт ведущего с интерактивным конструктором заявки, базой данных PostgreSQL и закрытой админ-панелью.

**Стек:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · React Hook Form · Zod · Prisma · PostgreSQL · Lucide Icons

---

## Структура проекта

```
vedushiy/
├── prisma/
│   ├── schema.prisma                 # модели: Host, Lead, LeadComment, AdminUser, Review
│   ├── migrations/…_init/            # SQL-миграция
│   └── seed.mjs                      # создаёт ведущего и первого администратора
├── public/
│   ├── media/                        # фото: hero, about, events/, portfolio/, videos/
│   └── og.jpg                        # картинка для соцсетей
├── src/
│   ├── app/
│   │   ├── page.tsx                  # главная
│   │   ├── booking/                  # конструктор заявки (/booking?type=wedding)
│   │   ├── events/[slug]/            # страницы мероприятий («Подробнее»)
│   │   ├── admin/login/              # вход
│   │   ├── admin/(panel)/            # дашборд, заявки, карточка заявки, отзывы
│   │   ├── api/leads                 # приём заявок
│   │   ├── api/reviews               # отзывы с сайта (на модерацию)
│   │   ├── api/auth/{login,logout}
│   │   ├── api/admin/…               # статусы, комментарии, удаление, отзывы
│   │   ├── api/health                # проверка для Railway
│   │   ├── sitemap.ts, robots.ts     # SEO
│   ├── components/{site,booking,admin,ui}
│   ├── content/
│   │   ├── site.ts                   # ← ТЕКСТЫ, КОНТАКТЫ, ФОТО, ВИДЕО
│   │   └── events.ts                 # ← описания категорий мероприятий
│   ├── lib/questionnaire/
│   │   ├── config.ts                 # ← ВСЕ ВОПРОСЫ АНКЕТЫ
│   │   ├── logic.ts                  # условная логика + валидация (клиент и сервер)
│   │   └── summary.ts                # читаемый снимок ответов
│   ├── lib/{auth,session,prisma,http,telegram,leads,utils}.ts
│   └── middleware.ts                 # защита /admin
├── Dockerfile, railway.json
└── .env.example
```

---

## Запуск локально

Нужны **Node.js 20.9+** и **PostgreSQL**.

```bash
cd vedushiy
npm install
cp .env.example .env          # заполните переменные (см. ниже)
npx prisma migrate deploy     # создать таблицы
npm run db:seed               # создать администратора
npm run dev                   # http://localhost:3000
```

PostgreSQL проще всего поднять в Docker:

```bash
docker run --name vedushiy-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=vedushiy -p 5432:5432 -d postgres:16
```

Админ-панель: http://localhost:3000/admin, логин и пароль берутся из `ADMIN_LOGIN` / `ADMIN_PASSWORD`.

Проверка production-сборки:

```bash
npm run build && npm start
```

---

## Переменные окружения

| Переменная | Обязательна | Описание |
|---|---|---|
| `DATABASE_URL` | да | Строка подключения PostgreSQL |
| `SESSION_SECRET` | да | Случайная строка ≥ 32 символов для подписи сессий |
| `ADMIN_LOGIN` | да | Логин первого администратора |
| `ADMIN_PASSWORD` | да | Пароль (≥ 8 символов). Хранится в БД только в виде bcrypt-хеша |
| `ADMIN_RESET_PASSWORD` | нет | `true` на один деплой, чтобы сменить пароль на `ADMIN_PASSWORD` |
| `NEXT_PUBLIC_SITE_URL` | рекомендуется | Публичный адрес (`https://vedushiy.tj`) для SEO и ссылок |
| `APP_TIMEZONE` | нет | По умолчанию `Asia/Dushanbe` |
| `TELEGRAM_BOT_TOKEN` | нет | Токен бота для уведомлений о заявках |
| `TELEGRAM_CHAT_ID` | нет | Куда присылать уведомления |

Сгенерировать `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

---

## Публикация на Railway.app

1. Загрузите папку проекта в репозиторий GitHub:
   ```bash
   git init && git add . && git commit -m "VEDUSHIY"
   git branch -M main
   git remote add origin https://github.com/<ваш-аккаунт>/vedushiy.git
   git push -u origin main
   ```
2. На [railway.app](https://railway.app) нажмите **New Project → Deploy from GitHub repo** и выберите `vedushiy`.
3. В том же проекте нажмите **+ Create → Database → PostgreSQL**.
4. Откройте сервис сайта → **Variables** и добавьте:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (Railway подставит ссылку на базу)
   - `SESSION_SECRET`, `ADMIN_LOGIN`, `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL` (добавьте после шага 5, когда появится домен)
   - при желании `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`
5. **Settings → Networking → Generate Domain**, либо подключите свой домен через **Custom Domain**.
6. Railway соберёт проект по `Dockerfile` (это указано в `railway.json`). При каждом запуске выполняется:
   `prisma migrate deploy` → `seed` → `next start`.
   Готовность проверяется по `/api/health`.
7. Откройте `https://<домен>/admin` и войдите.

> После изменения `NEXT_PUBLIC_SITE_URL` сделайте **Redeploy**: переменные `NEXT_PUBLIC_*` подставляются во время сборки.

---

## Как редактировать контент

- **Тексты, контакты, имя, соцсети** — `src/content/site.ts`. Все места для замены помечены `ЗАМЕНИТЕ`.
- **Фото** — положите свои файлы в `public/media/…` с теми же именами или поменяйте пути в `site.ts`. Next.js сам оптимизирует их (AVIF/WebP, ресайз).
- **Видео на главном экране** — `public/media/hero.mp4` (до 10 МБ, H.264, без звука), затем `hero.video: "/media/hero.mp4"`.
- **Видеогалерея** — в `site.portfolio.videos` укажите `youtubeId` (часть ссылки после `v=`) или путь к mp4 в `src`.
- **Отзывы** — в админке: раздел «Отзывы». Отзывы с сайта приходят на модерацию.

## Как добавить или изменить вопросы анкеты

Все вопросы описаны в `src/lib/questionnaire/config.ts`. Пример: новый вопрос для свадьбы, который виден только при выборе формата «Ведущий и ведущая»:

```ts
{
  id: "dressCode",
  type: "choice",            // choice | multichoice | text | textarea | number | date | time | tel | checkbox
  label: "Нужен ли общий дресс-код у пары ведущих?",
  options: [{ value: "yes", label: "Да" }, { value: "no", label: "Нет" }],
  showIf: { field: "hostFormat", in: ["duo"] },
}
```

Интерфейс, серверная проверка, админка и Telegram-уведомления подхватят вопрос автоматически. Старые заявки сохраняют читаемый снимок ответов (`Lead.summary`), поэтому правки анкеты их не ломают.

---

## Что реализовано

- ✅ Главная: hero с параллаксом и поддержкой видео, «Обо мне», мероприятия, портфолио с полноэкранным просмотрщиком (свайпы, клавиатура), видеогалерея, преимущества, отзывы, контакты, плавающая кнопка связи, липкая кнопка заявки на мобильных
- ✅ Страницы 7 категорий мероприятий с кнопкой «Обсудить», которая открывает анкету с уже выбранным типом
- ✅ Конструктор заявки: 7 веток вопросов, условные поля, прогресс-бар, переход к любому пройденному шагу, «Назад/Продолжить», анимации, черновик в браузере (14 дней), проверка ответов перед отправкой, запрет прошедших дат
- ✅ Сервер: повторная валидация по той же конфигурации, отбрасывание скрытых полей, honeypot от ботов, лимит запросов, проверка Origin
- ✅ PostgreSQL + Prisma, миграция, сидинг
- ✅ Админ-панель: вход (bcrypt, JWT в httpOnly-cookie, ограничение попыток), дашборд, заявки с фильтрами (статус, тип, даты, поиск, сортировка, пагинация), карточка заявки со всеми ответами, смена статуса, внутренние комментарии, удаление, модерация отзывов
- ✅ Уведомления о новых заявках в Telegram (включаются переменными окружения)
- ✅ SEO: метаданные, Open Graph, sitemap.xml, robots.txt, JSON-LD
- ✅ Dockerfile + railway.json + healthcheck

## Что требует вашей настройки

- ⚠️ Реальные фото, видео, имя, биография и цифры опыта в `src/content/site.ts`. Сейчас там фирменные плейсхолдеры.
- ⚠️ Реальные контакты (телефон, WhatsApp, Telegram, Instagram).
- ⚠️ Переменные окружения и база данных на Railway.
- ⚠️ Свой домен (по желанию).

## Заложено на будущее

Модель `Host` и поле `hostId` у заявок, отзывов и администраторов позволят добавить каталог ведущих, выбор и сравнение ведущих, личные кабинеты (`AdminUser.role = HOST`). Статус `CONFIRMED` + `eventDate` — основа для календаря занятых дат. Тексты анкеты и сайта собраны в `content/` и `questionnaire/config.ts`, поэтому многоязычность добавляется переводом этих файлов.
