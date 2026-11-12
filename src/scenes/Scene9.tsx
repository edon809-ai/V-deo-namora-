import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, Ground, CloudRow } from "../components/Backgrounds";
import { FloatingHearts } from "../components/Decor";
import { Figure } from "../components/Stage";
import { exprFor } from "../schedule";
import { FONT } from "../fonts";
import { H } from "../theme";

const Msg: React.FC<{ from: number; text: string; top: number }> = ({ from, text, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = frame - from;
  const life = fps * 2.0;
  if (l < 0 || l > life) return null;
  const pop = spring({ frame: l, fps, config: { damping: 12, stiffness: 180 } });
  const out = interpolate(l, [life - 10, life], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 150, top, transform: `scale(${pop})`, opacity: out, transformOrigin: "left center" }}>
      <div style={{ background: "#7ec8ff", color: "#fff", fontFamily: FONT.dialog, fontWeight: 700, fontSize: 42, padding: "16px 28px", borderRadius: "28px 28px 28px 8px", boxShadow: "0 8px 20px rgba(80,120,160,0.3)" }}>{text}</div>
    </div>
  );
};

export const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bob = Math.abs(Math.sin((frame / fps) * 6)) * 22;
  const elaExpr = exprFor(9, "ela", frame, "smile");

  return (
    <SceneBase index={9}>
      <Gradient from="#ffe3ef" to="#fff3d9" />
      <CloudRow speed={11} opacity={0.9} />
      <Ground y={H - 330} color="#bfe3a1" color2="#d4efbf" />
      <FloatingHearts count={10} seed="s9" area={{ x: 0, y: 500, w: 1080, h: 1100 }} />

      <Msg from={6} text="Vamos nos ver! 🥳" top={380} />
      <Msg from={46} text="Vamos sair! 😄" top={520} />
      <Msg from={90} text="Tô com saudade! ❤️" top={660} />

      <div style={{ position: "absolute", transform: `translateY(${-bob}px)` }}>
        <Figure who="ele" expression="happy" cx={330} baseY={H - 190} width={370} leftArm="up" rightArm="up" blush />
      </div>
      <Figure who="ela" expression={elaExpr} cx={760} baseY={H - 190} width={330} flip leftArm="hip" rightArm="down" />
    </SceneBase>
  );
};
