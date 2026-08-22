# Приглашение на годовщину

Одностраничный сайт на Next.js и TypeScript: WebGL-фон, галерея, карта и RSVP. Деплой — Vercel.

## Локально

```bash
cd wedding-anniversary
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Что править

Все тексты, дата, адрес и подписи к фото — в [`src/content.ts`](src/content.ts).

Фотографии кладите в `public/gallery/` и обновите пути в `content.gallery`. Лучше JPEG или WebP около 200–400 KB.

## RSVP на почту

1. Заведите ключ на [Resend](https://resend.com).
2. Скопируйте `.env.example` в `.env.local` и заполните:

```
RESEND_API_KEY=re_...
RSVP_TO_EMAIL=you@example.com
RESEND_FROM_EMAIL=Invitation <onboarding@resend.dev>
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

Пока ключей нет, форма всё равно отвечает «успех», а данные пишутся в лог сервера.

На Vercel те же переменные: Project → Settings → Environment Variables.

## Деплой

```bash
npx vercel
```

Или подключите репозиторий на [vercel.com](https://vercel.com/new): framework Next.js, root directory `wedding-anniversary`, если репозиторий — родительская папка `Invitation_web`.

После деплоя обновите `NEXT_PUBLIC_SITE_URL` на прод-домен — от него зависит превью ссылки в мессенджерах.
