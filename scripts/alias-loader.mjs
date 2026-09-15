import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), "../src");

function isFile(path) {
  return existsSync(path) && statSync(path).isFile();
}

function resolveSrc(subpath) {
  const base = join(srcRoot, subpath);
  const candidates = [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts")];
  return candidates.find((path) => isFile(path));
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const hit = resolveSrc(specifier.slice(2));
    if (hit) {
      return { url: pathToFileURL(hit).href, shortCircuit: true };
    }
  }
  return nextResolve(specifier, context);
}
