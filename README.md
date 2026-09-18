# Цифровые приглашения

Одностраничные приглашения на Next.js и TypeScript: каталог скинов, WebGL-фон, галерея, карта и RSVP. Деплой — Vercel.

Как пользоваться на живом сайте (организатор и админ) — [`docs/how-to.md`](docs/how-to.md). Ниже — запуск кода.

## Локально

Нужен **Node 22** (см. `.nvmrc`). На 20.15 npm будет ругаться на `engines`.

```bash
cd wedding-anniversary
nvm use   # если установлен nvm
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) — каталог скинов (sales URL). Демо: Quiet luxury (день рождения) [http://localhost:3000/sofia](http://localhost:3000/sofia), Paper envelope (свадьба) [http://localhost:3000/ivan-maria](http://localhost:3000/ivan-maria), Dark editorial (гала) [http://localhost:3000/kira](http://localhost:3000/kira), Garden daylight (церемония) [http://localhost:3000/olga-nikita](http://localhost:3000/olga-nikita).

## Что править

Все тексты демо — в [`src/events/`](src/events/). Свои события организатор создаёт в `/cabinet` (Neon). Гостевая ссылка — `/{slug}`.

Фото для демо — в `public/gallery/`. Организатор в кабинете загружает JPEG/PNG/WebP (Vercel Blob), не путь из репозитория.

`BLOB_READ_WRITE_TOKEN` — в `.env.local` и в Vercel (Production и Preview). Без токена событие без фото создать можно; с файлом форма покажет ошибку загрузки.

## RSVP

Ответы гостей хранятся в **Neon Postgres** (база в том же проекте Vercel, не отдельный сервер). Письмо через Resend — по желанию, не источник правды.

1. В [Vercel](https://vercel.com) у проекта `wedding-anniversary`: Storage → Create Database → **Neon Postgres**, или из репо:

   ```bash
   npx vercel integration add neon --name wedding-rsvp --scope snake-age
   ```

   При первом подключении Vercel попросит принять условия Neon в браузере, затем команду нужно повторить.
2. Подтяните переменные локально: `npx vercel env pull .env.local --scope snake-age`.
3. Создайте таблицу: `npm run db:migrate`.
4. Задайте `RSVP_ADMIN_SECRET` (случайная строка) в `.env.local` и в Vercel env (Production + Preview).
5. Кабинет: `/login` — кнопка «Открыть бота» (сообщение в чате) и Login Widget. Запасной пароль — `RSVP_ADMIN_SECRET` (видит все RSVP). Создайте бота в [@BotFather](https://t.me/BotFather), задайте `TELEGRAM_BOT_TOKEN`, `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` и `TELEGRAM_WEBHOOK_SECRET` (случайная строка: буквы, цифры, `_` `-`). После деплоя: `npm run telegram:webhook` — webhook (включая кнопки подтверждения чека), команда `/start`, тексты «О боте». Аватар и Domain для виджета — в BotFather, см. [`docs/how-to.md`](docs/how-to.md). После `npm run db:migrate` появятся таблицы `organizers` и `events`.

Resend по-прежнему опционален:

```
RESEND_API_KEY=re_...
RSVP_TO_EMAIL=you@example.com
RESEND_FROM_EMAIL=Invitation <onboarding@resend.dev>
NEXT_PUBLIC_SITE_URL=https://wedding-anniversary-seven-tau.vercel.app
DATABASE_URL=postgres://...
RSVP_ADMIN_SECRET=long-random-string
TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
TELEGRAM_WEBHOOK_SECRET=
CRON_SECRET=
```

Без `DATABASE_URL` форма покажет ошибку, а не ложный успех.

## Деплой

```bash
npx vercel
```

Или подключите репозиторий на [vercel.com](https://vercel.com/new): framework Next.js, root directory `wedding-anniversary`, если репозиторий — родительская папка `Invitation_web`.

После деплоя обновите `NEXT_PUBLIC_SITE_URL` на прод-домен — от него зависит превью ссылки в мессенджерах. Визиты гостей: в проекте Vercel откройте **Analytics** (на проде; в `next dev` счётчик молчит). Задайте `CRON_SECRET` (случайная строка) в Production и Preview: раз в сутки бот напоминает про заброшенный черновик и снимает его только после предупреждения.
