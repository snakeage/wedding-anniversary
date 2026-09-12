"use client";

import "./envelope-3d.css";

type EnvelopeArtProps = {
  initials: string;
  opening?: boolean;
};

export function EnvelopeArt({ opening = false }: EnvelopeArtProps) {
  return (
    <div className={`envelope-photo${opening ? " is-opening" : ""}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="envelope-frame envelope-frame-closed"
        src="/envelope/closed.png?v=4"
        alt=""
        width={1186}
        height={919}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="envelope-frame envelope-frame-opening"
        src="/envelope/opening.png?v=4"
        alt=""
        width={1186}
        height={919}
        draggable={false}
      />
    </div>
  );
}
