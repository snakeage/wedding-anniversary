export function DraftPreviewChrome() {
  return (
    <>
      <div className="draft-banner" role="status">
        Черновик · Предпросмотр (не опубликовано, сбор ответов гостей отключен)
      </div>
      <div className="draft-watermark" aria-hidden>
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index}>Черновик</span>
        ))}
      </div>
    </>
  );
}
