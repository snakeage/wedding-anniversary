import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TelegramLogin } from "@/components/TelegramLogin";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { isRsvpAdminSecret, RSVP_ADMIN_COOKIE } from "@/lib/rsvp-admin";

type PageProps = {
  searchParams: Promise<{ error?: string; slug?: string }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Вход организатора",
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  if (await getCurrentOrganizer()) {
    redirect("/cabinet");
  }
  if (isRsvpAdminSecret(cookieStore.get(RSVP_ADMIN_COOKIE)?.value)) {
    redirect("/rsvp-list");
  }

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim() ?? "";
  const telegramError = params.error === "telegram";
  const passwordError = params.error === "1";

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Организатор</p>
      <h1 className="font-serif mt-3 text-4xl text-ink">Вход</h1>
      <p className="mt-3 text-ink/65">Войдите через Telegram — без SMS и без пароля в ссылке.</p>

      {telegramError ? (
        <p className="panel mt-6 px-5 py-4 text-sm text-burgundy">
          Не удалось войти через Telegram. Попробуйте ещё раз.
        </p>
      ) : null}

      {botUsername ? (
        <>
          <a
            className="btn-gold mt-8 w-full"
            href={`https://t.me/${botUsername}?start=cabinet`}
            target="_blank"
            rel="noreferrer"
          >
            Открыть бота
          </a>
          <p className="mt-3 text-sm text-ink/50">
            В Telegram придёт кнопка «Открыть кабинет». Login Widget ниже — запасной путь, если он у вас открывается.
          </p>
          <div className="panel mt-8 px-6 py-8">
            <TelegramLogin botUsername={botUsername} />
          </div>
        </>
      ) : (
        <p className="panel mt-8 px-6 py-8 text-sm text-ink/65">
          Telegram-вход ещё не настроен. Нужны TELEGRAM_BOT_TOKEN и имя бота в env.
        </p>
      )}

      <details className="mt-8">
        <summary className="cursor-pointer text-sm text-ink/50">Запасной вход по паролю</summary>
        {passwordError ? (
          <p className="panel mt-4 px-5 py-4 text-sm text-burgundy">Неверный пароль. Попробуйте ещё раз.</p>
        ) : null}
        <form action="/api/rsvp-auth" method="post" className="panel mt-4 space-y-6 px-6 py-8">
          <label className="block text-left">
            <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Пароль</span>
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              className="field mt-2"
            />
          </label>
          <button type="submit" className="btn-gold w-full">
            Войти как администратор
          </button>
        </form>
      </details>
    </main>
  );
}
