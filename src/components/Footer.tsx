import { content } from "@/content";

export function Footer() {
  return (
    <footer className="relative px-6 pb-16 pt-4 text-center">
      <p className="font-serif text-2xl text-ink/70">
        {content.couple.one} & {content.couple.two}
      </p>
      <p className="mt-3 text-[10px] tracking-[0.28em] text-ink/40 uppercase">
        С любовью · ждём вас
      </p>
    </footer>
  );
}
