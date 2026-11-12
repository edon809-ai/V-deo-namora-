import scriptJson from "./script.json";
import audioData from "./audioData.json";
import { FPS } from "./theme";
import type { Expression } from "./components/Character";

const narrationText = scriptJson.narration as Record<string, string>;
const dialogCfg = scriptJson.dialog as Record<string, RawLine[]>;
const narrDur = audioData.narrationDur as Record<string, number>;
const dialogDur = audioData.dialogDur as Record<string, number>;

type RawLine = {
  id: string;
  who: "ela" | "ele";
  show: string;
  tail: "left" | "right" | "down";
  left?: number;
  right?: number;
  top: number;
  color?: string;
  ela?: string;
  ele?: string;
};

export type DialogLine = RawLine & {
  start: number; // frame em que a fala começa (e o balão aparece)
  audioEnd: number; // fim do áudio
  bubbleEnd: number; // fim do balão (áudio + hold)
};

export type SceneSchedule = {
  index: number;
  durationInFrames: number;
  narrationDelay: number;
  narrationDur: number; // frames
  lines: DialogLine[];
};

const sec = (n: number) => Math.round(n * FPS);

// ritmo (frames)
const LEAD = 18; // entrada da cena antes da narração
const POST_GAP = 14; // após a narração, antes da 1ª fala
const BETWEEN = 11; // entre falas
const HOLD = 16; // balão fica um pouco após o áudio

// espaço extra no fim das cenas SEM diálogo
const END_PAD: Record<number, number> = { 1: 30, 2: 20, 3: 22, 6: 60, 8: 28, 10: 60, 12: 24, 13: 96 };
// espaço extra no fim das cenas COM diálogo (ex.: risada, explosão de corações)
const FINAL_TAIL: Record<number, number> = { 5: 40, 9: 40, 11: 52 };

export const SCHEDULE: SceneSchedule[] = Object.keys(narrationText)
  .map(Number)
  .sort((a, b) => a - b)
  .map((index) => {
    const nd = sec(narrDur[String(index)] ?? 4);
    const narrationDelay = LEAD;
    const raws = dialogCfg[String(index)] ?? [];

    const lines: DialogLine[] = [];
    let cursor = LEAD + nd + POST_GAP;
    for (const r of raws) {
      const d = sec(dialogDur[r.id] ?? 2);
      const start = cursor;
      const audioEnd = start + d;
      const bubbleEnd = audioEnd + HOLD;
      lines.push({ ...r, start, audioEnd, bubbleEnd });
      cursor = audioEnd + BETWEEN;
    }

    let durationInFrames: number;
    if (lines.length) {
      const lastEnd = lines[lines.length - 1].bubbleEnd;
      durationInFrames = lastEnd + (FINAL_TAIL[index] ?? 24);
    } else {
      durationInFrames = LEAD + nd + (END_PAD[index] ?? 26);
    }

    return { index, durationInFrames, narrationDelay, narrationDur: nd, lines };
  });

export const getScene = (index: number) => SCHEDULE.find((s) => s.index === index)!;
export const narrationOf = (index: number) => narrationText[String(index)];

/** Fala ativa (para expressões) no frame local da cena. */
export const activeLine = (index: number, localFrame: number): DialogLine | null => {
  for (const l of getScene(index).lines) {
    if (localFrame >= l.start && localFrame < l.bubbleEnd) return l;
  }
  return null;
};

/** Expressão atual de um personagem considerando as falas. */
export const exprFor = (
  index: number,
  who: "ela" | "ele",
  localFrame: number,
  fallback: Expression,
): Expression => {
  const l = activeLine(index, localFrame);
  if (l && l[who]) return l[who] as Expression;
  return fallback;
};

export const TRANSITION = 15;
export const TOTAL_FRAMES =
  SCHEDULE.reduce((a, s) => a + s.durationInFrames, 0) - TRANSITION * (SCHEDULE.length - 1);
