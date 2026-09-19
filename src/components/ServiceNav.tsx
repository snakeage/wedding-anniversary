"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const linkClass =
  "text-[10px] tracking-[0.28em] text-ink/45 uppercase transition-colors hover:text-burgundy/75";

const currentClass =
  "text-[10px] tracking-[0.28em] text-burgundy uppercase";

function NavItem({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: string;
}) {
  if (current) {
    return (
      <span className={currentClass} aria-current="page">
        {children}
      </span>
    );
  }
  return (
    <Link className={linkClass} href={href}>
      {children}
    </Link>
  );
}

export function ServiceNav({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const onCatalog = pathname === "/";
  const onCabinet = pathname.startsWith("/cabinet");
  const onLogin = pathname === "/login";

  return (
    <header className="mb-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-gold/20 pb-6">
      <Link
        href="/"
        className="font-serif text-xl tracking-wide text-ink transition-colors hover:text-burgundy/80"
      >
        Приглашения
      </Link>
      <nav className="flex flex-wrap gap-x-7 gap-y-2">
        <NavItem href="/" current={onCatalog}>
          Каталог
        </NavItem>
        {loggedIn ? (
          <NavItem href="/cabinet" current={onCabinet}>
            Кабинет
          </NavItem>
        ) : (
          <NavItem href="/login" current={onLogin}>
            Вход
          </NavItem>
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
