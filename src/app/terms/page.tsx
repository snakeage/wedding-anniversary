import Link from "next/link";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Условия сервиса",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Сервис</p>
      <h1 className="font-serif mt-3 text-4xl text-ink">Условия сервиса</h1>
      <p className="mt-3 text-sm text-ink/50">
        <Link className="underline decoration-gold/60 underline-offset-4" href="/">
          На каталог
        </Link>
      </p>

      <div className="mt-10 space-y-8 text-base leading-7 text-ink/75">
        <section>
          <h2 className="font-serif text-2xl text-ink">Что это</h2>
          <p className="mt-3">
            Сервис даёт организатору доступ к веб-странице цифрового приглашения по адресу
            на этом сайте и к форме сбора ответов гостей (RSVP) на выбранном шаблоне.
            Это не отдельный сайт и не передача исходного кода.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Срок</h2>
          <p className="mt-3">
            Страница и сбор ответов доступны до даты мероприятия и ещё 10 календарных дней
            после неё. После этого приглашение может быть снято. Список ответов можно
            выгрузить, пока страница активна.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Когда услуга оказана</h2>
          <p className="mt-3">
            Услуга считается оказанной в момент активации приглашения: страница открывается
            гостям по ссылке. Черновик до активации виден только организатору и не является
            готовым приглашением для гостей.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Контент</h2>
          <p className="mt-3">
            Тексты, имена, фотографии и прочие материалы размещает организатор. Он отвечает
            за то, что имеет право их публиковать и не нарушает закон. Мы не проверяем
            каждое поле до публикации.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Сторонние сервисы</h2>
          <p className="mt-3">
            Мы не отвечаем за сбои интернета, банков, Telegram, хостинга и карт. Если
            страница временно недоступна из‑за таких сбоев, это не отменяет уже оказанную
            услугу.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-ink">Возврат</h2>
          <p className="mt-3">
            После активации приглашения возврат не предусмотрен: цифровая страница уже
            сформирована и открыта. До активации можно отказаться, написав в бот сервиса.
          </p>
        </section>
      </div>
    </main>
  );
}
