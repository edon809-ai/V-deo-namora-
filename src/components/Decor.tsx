import React from "react";
import { useCurrentFrame, useVideoConfig, random, interpolate } from "remotion";
import { C, W, H } from "../theme";

export const Heart: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  color = C.heart,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 32 30" style={style}>
    <path
      d="M16 29 C 16 29 2 19 2 10 C 2 4 7 2 11 4 C 14 5 16 9 16 9 C 16 9 18 5 21 4 C 25 2 30 4 30 10 C 30 19 16 29 16 29 Z"
      fill={color}
    />
    <ellipse cx={10} cy={10} rx={3} ry={2} fill="#fff" opacity={0.6} />
  </svg>
);

/** Corações subindo e balançando. */
export const FloatingHearts: React.FC<{
  count?: number;
  seed?: string;
  area?: { x: number; y: number; w: number; h: number };
  colors?: string[];
}> = ({ count = 14, seed = "h", area = { x: 0, y: 0, w: W, h: H }, colors = [C.heart, C.heart2, "#ff8fb0"] }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const items = new Array(count).fill(0).map((_, i) => {
    const r = (k: string) => random(`${seed}-${i}-${k}`);
    const dur = fps * (3.5 + r("d") * 3);
    const start = r("s") * durationInFrames;
    const t = ((frame - start) % dur + dur) % dur;
    const p = t / dur;
    const x = area.x + r("x") * area.w + Math.sin(p * Math.PI * 2 + i) * 30;
    const y = area.y + area.h - p * (area.h * 0.9);
    const size = 26 + r("sz") * 40;
    const op = interpolate(p, [0, 0.12, 0.8, 1], [0, 0.95, 0.9, 0]);
    const color = colors[Math.floor(r("c") * colors.length)];
    return (
      <div key={i} style={{ position: "absolute", left: x, top: y, opacity: op, transform: `rotate(${Math.sin(p * 6 + i) * 18}deg)` }}>
        <Heart size={size} color={color} />
      </div>
    );
  });
  return <>{items}</>;
};

/** Brilhinhos piscando. */
export const Sparkles: React.FC<{ count?: number; seed?: string; area?: { x: number; y: number; w: number; h: number } }> = ({
  count = 12,
  seed = "s",
  area = { x: 0, y: 0, w: W, h: H },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const x = area.x + r("x") * area.w;
        const y = area.y + r("y") * area.h;
        const size = 10 + r("z") * 20;
        const ph = r("p") * Math.PI * 2;
        const tw = (Math.sin((frame / fps) * 4 + ph) + 1) / 2;
        return (
          <svg key={i} width={size * 2} height={size * 2} viewBox="-16 -16 32 32" style={{ position: "absolute", left: x, top: y, opacity: 0.4 + tw * 0.6 }}>
            <path d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3 Z" fill="#fff" />
          </svg>
        );
      })}
    </>
  );
};

/** Nuvenzinhas fofas. */
export const Cloud: React.FC<{ x: number; y: number; s?: number; color?: string; opacity?: number }> = ({
  x,
  y,
  s = 1,
  color = "#ffffff",
  opacity = 0.9,
}) => (
  <svg width={260 * s} height={120 * s} viewBox="0 0 260 120" style={{ position: "absolute", left: x, top: y, opacity }}>
    <g fill={color}>
      <circle cx={70} cy={70} r={42} />
      <circle cx={120} cy={54} r={52} />
      <circle cx={180} cy={70} r={44} />
      <rect x={60} y={74} width="140" height="40" rx="20" />
    </g>
  </svg>
);
