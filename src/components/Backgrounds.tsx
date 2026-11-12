import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from "remotion";
import { C, W, H } from "../theme";
import { Cloud } from "./Decor";

export const Gradient: React.FC<{ from: string; to: string; children?: React.ReactNode }> = ({ from, to, children }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)` }}>{children}</AbsoluteFill>
);

/** Chão com morrinho fofo. */
export const Ground: React.FC<{ color?: string; color2?: string; y?: number }> = ({ color = C.grass, color2 = C.grassLight, y = H - 420 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <path d={`M 0 ${y + 80} Q ${W * 0.25} ${y - 20} ${W * 0.5} ${y + 60} Q ${W * 0.75} ${y + 140} ${W} ${y + 40} L ${W} ${H} L 0 ${H} Z`} fill={color2} />
    <path d={`M 0 ${y + 200} Q ${W * 0.5} ${y + 90} ${W} ${y + 200} L ${W} ${H} L 0 ${H} Z`} fill={color} />
  </svg>
);

/** Chuva caindo (cena da enchente). */
export const Rain: React.FC<{ count?: number; opacity?: number }> = ({ count = 90, opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`rx${i}`) * (W + 200) - 100;
        const speed = 700 + random(`rs${i}`) * 500;
        const len = 22 + random(`rl${i}`) * 26;
        const t = (frame / fps + random(`ro${i}`) * 3) % 2;
        const y = ((t * speed) % (H + 120)) - 60;
        const x = x0 + y * 0.22;
        return <line key={i} x1={x} y1={y} x2={x - len * 0.22} y2={y - len} stroke="#dff0ff" strokeWidth={3} opacity={opacity} strokeLinecap="round" />;
      })}
    </svg>
  );
};

/** Água/enchente subindo com brilho. */
export const Flood: React.FC<{ y?: number }> = ({ y = H - 520 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wob = Math.sin((frame / fps) * 2) * 8;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <path d={`M 0 ${y + wob} Q ${W * 0.3} ${y - 16 + wob} ${W * 0.55} ${y + wob} Q ${W * 0.8} ${y + 16 + wob} ${W} ${y + wob} L ${W} ${H} L 0 ${H} Z`} fill="#6ba8c9" opacity={0.92} />
      <path d={`M 0 ${y + 18 + wob} Q ${W * 0.4} ${y + 2 + wob} ${W} ${y + 22 + wob} L ${W} ${H} L 0 ${H} Z`} fill="#4e86aa" opacity={0.6} />
      {new Array(6).fill(0).map((_, i) => {
        const x = (i / 6) * W + Math.sin((frame / fps) * 1.5 + i) * 20;
        return <ellipse key={i} cx={x} cy={y + 50 + (i % 2) * 40} rx={40} ry={5} fill="#cfeaf5" opacity={0.4} />;
      })}
    </svg>
  );
};

export const Sun: React.FC<{ x: number; y: number; r?: number; color?: string }> = ({ x, y, r = 90, color = "#ffe08a" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin((frame / fps) * 1.2) * 0.03;
  return (
    <svg style={{ position: "absolute", left: x - r * 2.2, top: y - r * 2.2 }} width={r * 4.4} height={r * 4.4} viewBox={`${-r * 2.2} ${-r * 2.2} ${r * 4.4} ${r * 4.4}`}>
      <circle cx={0} cy={0} r={r * 1.7} fill={color} opacity={0.18} />
      <circle cx={0} cy={0} r={r * 1.25} fill={color} opacity={0.22} />
      <circle cx={0} cy={0} r={r * pulse} fill={color} />
    </svg>
  );
};

export const Stars: React.FC<{ count?: number }> = ({ count = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`sx${i}`) * W;
        const y = random(`sy${i}`) * H * 0.6;
        const tw = (Math.sin((frame / fps) * 3 + random(`sp${i}`) * 6) + 1) / 2;
        return <circle key={i} cx={x} cy={y} r={1.5 + random(`sr${i}`) * 2.5} fill="#fff" opacity={0.4 + tw * 0.6} />;
      })}
    </svg>
  );
};

/** Montanhas (Gramado) */
export const Hills: React.FC<{ y?: number }> = ({ y = H - 560 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <path d={`M 0 ${y} L ${W * 0.25} ${y - 180} L ${W * 0.5} ${y} Z`} fill="#8ea7b8" />
    <path d={`M ${W * 0.35} ${y} L ${W * 0.65} ${y - 230} L ${W * 0.95} ${y} Z`} fill="#7a93a5" />
    <path d={`M ${W * 0.25} ${y - 150} L ${W * 0.25} ${y - 180} L ${W * 0.3} ${y - 150} Z`} fill="#fff" />
    <path d={`M ${W * 0.6} ${y - 195} L ${W * 0.65} ${y - 230} L ${W * 0.72} ${y - 185} Z`} fill="#fff" />
  </svg>
);

export const CloudRow: React.FC<{ speed?: number; opacity?: number }> = ({ speed = 10, opacity = 0.9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dx = ((frame / fps) * speed) % (W + 300);
  return (
    <>
      <Cloud x={120 - dx} y={180} s={1} opacity={opacity} />
      <Cloud x={620 - dx} y={110} s={0.7} opacity={opacity * 0.85} />
      <Cloud x={120 - dx + (W + 300)} y={180} s={1} opacity={opacity} />
      <Cloud x={620 - dx + (W + 300)} y={110} s={0.7} opacity={opacity * 0.85} />
      <Cloud x={420 - dx} y={320} s={0.55} opacity={opacity * 0.7} />
      <Cloud x={420 - dx + (W + 300)} y={320} s={0.55} opacity={opacity * 0.7} />
    </>
  );
};
