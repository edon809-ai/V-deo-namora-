import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, Sun, CloudRow, Hills } from "../components/Backgrounds";
import { FloatingHearts, Sparkles } from "../components/Decor";
import { Figure } from "../components/Stage";
import { FONT } from "../fonts";
import { C, W, H } from "../theme";

const fadeWin = (f: number, a: number, b: number) =>
  Math.min(
    interpolate(f, [a, a + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [b - 18, b], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

const Label: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", top: 240, width: "100%", textAlign: "center", fontFamily: FONT.head, fontWeight: 700, fontSize: 92, color: "#fff", textShadow: "0 4px 0 rgba(255,111,145,0.5), 0 8px 18px rgba(0,0,0,0.2)" }}>{text}</div>
);

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const seg = durationInFrames / 3;

  return (
    <SceneBase index={6}>
      {/* PRAIA */}
      <AbsoluteFill style={{ opacity: fadeWin(frame, 0, seg + 20) }}>
        <Gradient from="#bfe8ff" to="#ffe6c7" />
        <Sun x={840} y={360} r={100} />
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: 640, background: `linear-gradient(180deg,${C.water},#9fd9ea)` }} />
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: 300, background: `linear-gradient(180deg,${C.sand},#ffe0a0)`, borderRadius: "60% 60% 0 0" }} />
        <Label text="praia 🏖️" />
        <Figure who="ela" expression="happy" cx={400} baseY={H - 170} width={320} leftArm="wave" rightArm="hip" />
        <Figure who="ele" expression="happy" cx={690} baseY={H - 170} width={350} flip leftArm="wave" rightArm="hip" blush />
      </AbsoluteFill>

      {/* GRAMADO */}
      <AbsoluteFill style={{ opacity: fadeWin(frame, seg, seg * 2 + 20) }}>
        <Gradient from="#cfe0ef" to="#eef6ff" />
        <CloudRow speed={8} opacity={0.9} />
        <Hills y={H - 640} />
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: 420, background: "linear-gradient(180deg,#a7d98a,#7bc45e)" }} />
        {[150, 320, 760, 930].map((x, i) => (
          <svg key={i} width={120} height={200} viewBox="0 0 120 200" style={{ position: "absolute", left: x, top: H - 640 }}>
            <rect x={52} y={150} width="16" height="40" fill="#7a5230" />
            <path d="M60 10 L95 90 L25 90 Z" fill="#3f8f4f" />
            <path d="M60 50 L100 140 L20 140 Z" fill="#4aa85c" />
          </svg>
        ))}
        <Label text="Gramado ❄️" />
        <Figure who="ela" expression="love" cx={420} baseY={H - 150} width={320} leftArm="heartR" rightArm="heartL" />
        <Figure who="ele" expression="smile" cx={690} baseY={H - 150} width={350} flip leftArm="hip" rightArm="down" blush />
      </AbsoluteFill>

      {/* VIAGENS */}
      <AbsoluteFill style={{ opacity: fadeWin(frame, seg * 2, durationInFrames + 10) }}>
        <Gradient from={C.skyTop} to="#ffe9d6" />
        <Sun x={200} y={300} r={80} color="#ffd08a" />
        <CloudRow speed={14} opacity={0.85} />
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: 420, background: "#9aa3b0" }} />
        <svg width={W} height={420} viewBox={`0 0 ${W} 420`} style={{ position: "absolute", bottom: 0 }}>
          {new Array(8).fill(0).map((_, i) => {
            const x = ((i * 180 - (frame * 10) % 180) + W) % (W + 180) - 90;
            return <rect key={i} x={x} y={190} width="90" height="16" rx="8" fill="#ffe08a" />;
          })}
        </svg>
        <Label text="viagens ✈️" />
        <Figure who="ela" expression="happy" cx={430} baseY={H - 150} width={320} leftArm="up" rightArm="up" />
        <Figure who="ele" expression="happy" cx={700} baseY={H - 150} width={350} flip leftArm="up" rightArm="up" blush />
      </AbsoluteFill>

      <FloatingHearts count={12} seed="s6" area={{ x: 0, y: 500, w: W, h: 1200 }} />
      <Sparkles count={10} seed="s6s" area={{ x: 60, y: 300, w: 960, h: 600 }} />
    </SceneBase>
  );
};
