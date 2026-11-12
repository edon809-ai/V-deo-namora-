import audioData from "./audioData.json";
import { FPS } from "./theme";

const durations = audioData.durations as Record<string, number>;

// lead = segundos antes da narração começar (entrada da cena)
// tail = segundos depois da narração (falas em balão / ação / saída)
const PAD: Record<number, { lead: number; tail: number }> = {
  1: { lead: 1.6, tail: 4.0 },
  2: { lead: 2.0, tail: 3.6 },
  3: { lead: 2.0, tail: 3.2 },
  4: { lead: 1.6, tail: 8.6 },
  5: { lead: 1.6, tail: 10.8 },
  6: { lead: 1.6, tail: 5.2 },
  7: { lead: 1.6, tail: 8.2 },
  8: { lead: 2.0, tail: 4.4 },
  9: { lead: 1.6, tail: 8.2 },
  10: { lead: 1.6, tail: 4.8 },
  11: { lead: 1.6, tail: 11.0 },
  12: { lead: 2.0, tail: 4.0 },
  13: { lead: 1.6, tail: 7.0 },
};

const sec = (n: number) => Math.round(n * FPS);

export type SceneTiming = {
  index: number;
  durationInFrames: number;
  narrationDelay: number; // frames
  narrationDur: number; // frames
};

export const TIMINGS: SceneTiming[] = Object.keys(PAD)
  .map(Number)
  .sort((a, b) => a - b)
  .map((index) => {
    const dur = durations[String(index)] ?? 4;
    const { lead, tail } = PAD[index];
    return {
      index,
      narrationDelay: sec(lead),
      narrationDur: sec(dur),
      durationInFrames: sec(lead + dur + tail),
    };
  });

// pequena sobreposição para o crossfade entre cenas
export const TRANSITION = sec(0.7);

export const TOTAL_FRAMES =
  TIMINGS.reduce((a, t) => a + t.durationInFrames, 0) -
  TRANSITION * (TIMINGS.length - 1);
