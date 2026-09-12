"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{ lerp: 0.08, duration: 1.2, smoothWheel: true, autoRaf: true }}
    >
      {children}
    </ReactLenis>
  );
}
