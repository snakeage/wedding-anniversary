type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export function shouldUseWebGL() {
  if (typeof window === "undefined") return false;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return false;

  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return false;

  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ??
    canvas.getContext("experimental-webgl");
  if (!gl) return false;

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  if (cores <= 2 || memory < 2) return false;

  return true;
}

export function particleCountForDevice() {
  if (typeof window === "undefined") return 220;
  return window.matchMedia("(max-width: 768px)").matches ? 160 : 380;
}
