import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, CloudRow } from "../components/Backgrounds";
import { FloatingHearts, Sparkles } from "../components/Decor";
import { Figure } from "../components/Stage";
import { FONT } from "../fonts";
import { C, W, H } from "../theme";

const fadeWin = (f: number, a: number, b: number) =>
  Math.min(
    interpolate(f, [a, a + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [b - 18, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

const Label: React.FC<{ text: string; color?: string }> = ({ text, color = "#fff" }) => (
  <div style={{ position: "absolute", top: 240, width: "100%", textAlign: "center", fontFamily: FONT.head, fontWeight: 700, fontSize: 92, color, textShadow: "0 4px 0 rgba(255,111,145,0.45), 0 8px 18px rgba(0,0,0,0.25)" }}>{text}</div>
);

export const Scene10: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const seg = durationInFrames / 3;
  const dance = Math.sin((frame / fps) * 8) * 10;

  return (
    <SceneBase index={10}>
      {/* SHOW */}
      <AbsoluteFill style={{ opacity: fadeWin(frame, 0, seg + 20) }}>
        <Gradient from="#2a1f45" to="#54406e" />
        {[0, 1, 2, 3, 4].map((i) => {
          const hue = (i * 70 + frame * 3) % 360;
          const x = 120 + i * 200;
          return (
            <svg key={i} width={300} height={900} viewBox="0 0 300 900" style={{ position: "absolute", left: x - 150, top: 0, opacity: 0.5 }}>
              <path d="M150 0 L40 900 L260 900 Z" fill={`hsl(${hue} 90% 65%)`} opacity={0.5} />
            </svg>
          );
        })}
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: 360, background: "#1a1430" }} />
        <Sparkles count={20} seed="s10a" area={{ x: 40, y: 120, w: 1000, h: 700 }} />
        <Label text="show 🎶" color="#ffe08a" />
        <div style={{ position: "absolute", transform: `rotate(${dance}deg)`, transformOrigin: "400px 1700px" }}>
          <Figure who="ela" expression="happy" cx={400} baseY={H - 160} width={320} leftArm="up" rightArm="up" />
        </div>
        <div style={{ position: "absolute", transform: `rotate(${-dance}deg)`, transformOrigin: "690px 1700px" }}>
          <Figure who="ele" expression="happy" cx={690} baseY={H - 160} width={350} flip leftArm="up" rightArm="up" blush />
        </div>
      </AbsoluteFill>

      {/* JANTAR */}
      <AbsoluteFill style={{ opacity: fadeWin(frame, seg, seg * 2 + 20) }}>
        <Gradient from="#ffdcc0" to="#ffc9a3" />
        <Label text="jantar 🍝" color="#7a4a2a" />
        <Figure who="ela" expression="love" cx={360} baseY={H - 420} width={300} leftArm="hip" rightArm="down" />
        <Figure who="ele" expression="smile" cx={720} baseY={H - 420} width={330} flip leftArm="hip" rightArm="down" blush />
        {/* mesa */}
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: 360, background: "linear-gradient(180deg,#b5764a,#8a5833)" }} />
        <div style={{ position: "absolute", bottom: 300, left: W / 2 - 40, width: 80, height: 90 }}>
          <svg width={80} height={120} viewBox="0 0 80 120"><rect x={32} y={40} width="16" height="60" fill="#ffd76a" /><ellipse cx={40} cy={34} rx={10} ry={18} fill="#ff9f43" /><ellipse cx={40} cy={28} rx={5} ry={9} fill="#ffe08a" /></svg>
        </div>
        <FloatingHearts count={8} seed="s10j" area={{ x: 200, y: 500, w: 680, h: 700 }} />
      </AbsoluteFill>

      {/* PASSEIOS */}
      <AbsoluteFill style={{ opacity: fadeWin(frame, seg * 2, durationInFrames + 10) }}>
        <Gradient from={C.skyTop} to="#ffe9f2" />
        <CloudRow speed={10} opacity={0.9} />
        {/* roda gigante */}
        <svg width={420} height={420} viewBox="0 0 420 420" style={{ position: "absolute", right: 40, top: 360 }}>
          <g transform={`rotate(${frame * 1.2} 210 210)`}>
            <circle cx={210} cy={210} r={180} fill="none" stroke="#ff9fb3" strokeWidth={10} />
            {new Array(8).fill(0).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <g key={i}><line x1={210} y1={210} x2={210 + Math.cos(a) * 180} y2={210 + Math.sin(a) * 180} stroke="#ffc2cf" strokeWidth={6} /><circle cx={210 + Math.cos(a) * 180} cy={210 + Math.sin(a) * 180} r={22} fill={["#ffd76a", "#9fd0ff", "#a7d98a", "#ff9fb3"][i % 4]} /></g>;
            })}
          </g>
          <rect x={200} y={210} width="20" height="200" fill="#c9a36b" />
        </svg>
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: 300, background: "linear-gradient(180deg,#a7d98a,#7bc45e)" }} />
        <Label text="passeios 🎡" />
        <Figure who="ela" expression="happy" cx={360} baseY={H - 170} width={320} leftArm="wave" rightArm="reachR" />
        <Figure who="ele" expression="happy" cx={620} baseY={H - 170} width={350} flip leftArm="hip" rightArm="reachR" blush />
      </AbsoluteFill>
    </SceneBase>
  );
};
