# Приглашение на годовщину

Одностраничный сайт на Next.js и TypeScript: WebGL-фон, галерея, карта и RSVP. Деплой — Vercel.

## Локально

Нужен **Node 22** (см. `.nvmrc`). На 20.15 npm будет ругаться на `engines`.

```bash
cd wedding-anniversary
nvm use   # если установлен nvm
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) — откроется демо `/anna-dmitry`. Второе событие на том же деплое: [http://localhost:3000/ivan-maria](http://localhost:3000/ivan-maria).

## Что править

Все тексты, дата, адрес и подписи к фото — в файлах [`src/events/`](src/events/). Гостевая ссылка — `/{slug}` (`anna-dmitry`, `ivan-maria`). Скин выбирается полем `templateId`.

Фотографии кладите в `public/gallery/` и обновите пути в `gallery` у события. Лучше JPEG или WebP около 200–400 KB.

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
5. Список ответов: `/rsvp-list?secret=ВАШ_СЕКРЕТ&slug=anna-dmitry` — не публикуйте ссылку гостям.

Resend по-прежнему опционален:

```
RESEND_API_KEY=re_...
RSVP_TO_EMAIL=you@example.com
RESEND_FROM_EMAIL=Invitation <onboarding@resend.dev>
NEXT_PUBLIC_SITE_URL=https://wedding-anniversary-seven-tau.vercel.app
DATABASE_URL=postgres://...
RSVP_ADMIN_SECRET=long-random-string
```

Без `DATABASE_URL` форма покажет ошибку, а не ложный успех.

## Деплой

```bash
npx vercel
```

Или подключите репозиторий на [vercel.com](https://vercel.com/new): framework Next.js, root directory `wedding-anniversary`, если репозиторий — родительская папка `Invitation_web`.

После деплоя обновите `NEXT_PUBLIC_SITE_URL` на прод-домен — от него зависит превью ссылки в мессенджерах.
