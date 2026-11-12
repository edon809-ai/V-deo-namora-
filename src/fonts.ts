import { staticFile, continueRender, delayRender } from "remotion";
import faces from "../public/fonts/fonts.json";

const UNICODE_RANGE: Record<string, string> = {
  latin:
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  "latin-ext":
    "U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
};

export const FONT = {
  head: "Fredoka",
  dialog: "'Baloo 2'",
  caption: "Nunito",
};

let injected = false;

/** Injeta todas as @font-face locais e espera elas carregarem. */
export function loadFonts() {
  if (injected || typeof document === "undefined") return;
  injected = true;

  const subsetOf = (file: string) =>
    file.includes("latin-ext") ? "latin-ext" : "latin";

  const css = (faces as { family: string; weight: number; file: string }[])
    .map((f) => {
      const url = staticFile(`fonts/${f.file}`);
      return `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};font-display:block;src:url("${url}") format("woff2");unicode-range:${UNICODE_RANGE[subsetOf(f.file)]};}`;
    })
    .join("\n");

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // garante que o render só comece depois das fontes prontas
  const handle = delayRender("loading fonts");
  const families = [
    "500 48px Fredoka",
    "600 48px Fredoka",
    "700 48px Fredoka",
    "600 48px 'Baloo 2'",
    "700 48px 'Baloo 2'",
    "700 48px Nunito",
    "800 48px Nunito",
  ];
  Promise.all(families.map((f) => (document as any).fonts.load(f)))
    .then(() => (document as any).fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}
