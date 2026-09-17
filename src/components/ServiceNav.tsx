import Link from "next/link";

const linkClass =
  "text-[10px] tracking-[0.28em] text-ink/45 uppercase transition-colors hover:text-burgundy/75";

export function ServiceNav({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="mb-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-gold/20 pb-6">
      <Link
        href="/"
        className="font-serif text-xl tracking-wide text-ink transition-colors hover:text-burgundy/80"
      >
        Приглашения
      </Link>
      <nav className="flex flex-wrap gap-x-7 gap-y-2">
        <Link className={linkClass} href="/">
          Каталог
        </Link>
        {loggedIn ? (
          <Link className={linkClass} href="/cabinet">
            Кабинет
          </Link>
        ) : (
          <Link className={linkClass} href="/login">
            Вход
          </Link>
        )}
      </nav>
    </header>
  );
}

export function ServiceFooter() {
  return (
    <footer className="mt-24 border-t border-gold/25 pt-8 text-center">
      <Link className={linkClass} href="/terms">
        Условия сервиса
      </Link>
    </footer>
  );
}
