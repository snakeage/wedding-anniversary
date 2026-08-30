type EnvelopeArtProps = {
  initials: string;
};

export function EnvelopeArt({ initials }: EnvelopeArtProps) {
  return (
    <svg
      className="envelope-art"
      viewBox="0 0 400 300"
      aria-hidden
      focusable="false"
    >
      <defs>
        <clipPath id="env-body">
          <path d="M40 80 C40 64 56 54 76 54 L324 54 C344 54 360 64 360 80 L360 236 C360 252 344 262 324 262 L76 262 C56 262 40 252 40 236 Z" />
        </clipPath>
        <linearGradient id="paper-front" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#fbf6eb" />
          <stop offset="35%" stopColor="#f0e2c8" />
          <stop offset="100%" stopColor="#d9c39a" />
        </linearGradient>
        <linearGradient id="paper-flap" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="48%" stopColor="#eddcc0" />
          <stop offset="100%" stopColor="#d7c09a" />
        </linearGradient>
        <linearGradient id="paper-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbb892" />
          <stop offset="100%" stopColor="#b39a72" />
        </linearGradient>
        <radialGradient id="wax-fill" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#d46a58" />
          <stop offset="28%" stopColor="#a8382c" />
          <stop offset="62%" stopColor="#7a1f1c" />
          <stop offset="100%" stopColor="#3f0e0c" />
        </radialGradient>
        <radialGradient id="wax-sheen" cx="30%" cy="22%" r="55%">
          <stop offset="0%" stopColor="#fff3e4" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#ffd0c0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#7a1f1c" stopOpacity="0" />
        </radialGradient>
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" seed="7" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.78  0 0 0 0 0.68  0 0 0 0 0.48  0 0 0 0.28 0"
          />
        </filter>
        <filter id="wax-edge" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="4" seed="19" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wax-crackle">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="3" result="c" />
          <feColorMatrix
            in="c"
            type="matrix"
            values="0 0 0 0 0.42  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.35 0"
          />
        </filter>
        <filter id="stamp" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dx="0.6" dy="1.1" result="off" />
          <feGaussianBlur in="off" stdDeviation="0.5" result="blur" />
          <feBlend in="SourceGraphic" in2="blur" mode="multiply" />
        </filter>
      </defs>

      <ellipse cx="200" cy="276" rx="152" ry="12" fill="#3d2c22" opacity="0.18" />

      <g transform="rotate(-1.4 200 160)">
        <path
          d="M44 84 C44 68 58 58 78 58 L322 58 C342 58 356 68 356 84 L356 240 C356 256 342 266 322 266 L78 266 C58 266 44 256 44 240 Z"
          fill="url(#paper-edge)"
        />
        <g clipPath="url(#env-body)">
          <path
            d="M40 80 C40 64 56 54 76 54 L324 54 C344 54 360 64 360 80 L360 236 C360 252 344 262 324 262 L76 262 C56 262 40 252 40 236 Z"
            fill="url(#paper-front)"
          />
          <rect x="40" y="54" width="320" height="210" filter="url(#paper-grain)" opacity="0.55" />
          <path d="M48 88 L200 178 L48 240 Z" fill="#d8c4a0" opacity="0.55" />
          <path d="M352 88 L200 178 L352 240 Z" fill="#cbb892" opacity="0.42" />
          <path
            d="M54 244 L200 172 L346 244 L346 252 C346 256 338 258 324 258 L76 258 C62 258 54 256 54 252 Z"
            fill="#e4d2b2"
          />
          <path
            d="M44 74 C48 58 62 48 82 48 L318 48 C338 48 352 58 356 74 L200 188 Z"
            fill="url(#paper-flap)"
          />
          <path
            d="M44 74 C48 58 62 48 82 48 L318 48 C338 48 352 58 356 74 L200 188 Z"
            filter="url(#paper-grain)"
            opacity="0.4"
          />
          <path
            d="M78 58 L200 176 L322 58"
            fill="none"
            stroke="#b08958"
            strokeOpacity="0.45"
            strokeWidth="1.4"
          />
          <path
            d="M64 70 Q200 18 336 70"
            fill="none"
            stroke="#fffdf8"
            strokeOpacity="0.5"
            strokeWidth="2.4"
          />
        </g>
      </g>

      <g transform="translate(200 172) rotate(-2)" filter="url(#wax-edge)">
        <path
          d="M-10 36 C-22 50 -12 64 2 60 C12 70 26 58 22 44 C34 46 32 30 18 28"
          fill="#5c1614"
        />
        <path
          d="M8 38 C22 56 10 70 -2 64 C-12 72 -24 58 -16 44"
          fill="#4a1010"
        />
        <path
          d="M2 -44 C22 -46 42 -30 48 -8 C54 16 40 42 14 48 C-6 54 -32 42 -44 18 C-54 -6 -32 -42 2 -44 Z"
          fill="url(#wax-fill)"
        />
        <path
          d="M2 -44 C22 -46 42 -30 48 -8 C54 16 40 42 14 48 C-6 54 -32 42 -44 18 C-54 -6 -32 -42 2 -44 Z"
          fill="url(#wax-crackle)"
        />
        <ellipse cx="-8" cy="-14" rx="18" ry="12" fill="url(#wax-sheen)" />
        <path
          d="M1 -26 C14 -26 24 -16 26 -2 C28 14 16 26 1 28 C-14 30 -26 16 -28 0 C-30 -16 -14 -26 1 -26 Z"
          fill="none"
          stroke="#f6ead4"
          strokeOpacity="0.38"
          strokeWidth="1.6"
        />
        <text
          y="8"
          textAnchor="middle"
          fill="#f8efe2"
          fontFamily="var(--font-cormorant), Georgia, serif"
          fontSize="23"
          letterSpacing="0.14em"
          filter="url(#stamp)"
        >
          {initials}
        </text>
      </g>
    </svg>
  );
}
