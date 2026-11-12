import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, Ground, CloudRow } from "../components/Backgrounds";
import { FloatingHearts } from "../components/Decor";
import { Figure } from "../components/Stage";
import { SpeechBubble } from "../components/SpeechBubble";
import { FONT } from "../fonts";
import { TIMINGS } from "../timing";
import { C, H } from "../theme";

const Msg: React.FC<{ from: number; to: number; text: string; top: number }> = ({ from, to, text, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = frame - from;
  if (l < 0 || frame > to) return null;
  const pop = spring({ frame: l, fps, config: { damping: 12, stiffness: 180 } });
  const out = interpolate(frame, [to - 10, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 150, top, transform: `scale(${pop})`, opacity: out, transformOrigin: "left center" }}>
      <div style={{ background: "#7ec8ff", color: "#fff", fontFamily: FONT.dialog, fontWeight: 700, fontSize: 44, padding: "18px 30px", borderRadius: "28px 28px 28px 8px", boxShadow: "0 8px 20px rgba(80,120,160,0.3)" }}>{text}</div>
    </div>
  );
};

export const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = TIMINGS.find((x) => x.index === 9)!;
  const ne = t.narrationDelay + t.narrationDur;
  const bob = Math.abs(Math.sin((frame / fps) * 6)) * 24;

  return (
    <SceneBase index={9}>
      <Gradient from="#ffe3ef" to="#fff3d9" />
      <CloudRow speed={11} opacity={0.9} />
      <Ground y={H - 330} color="#bfe3a1" color2="#d4efbf" />
      <FloatingHearts count={10} seed="s9" area={{ x: 0, y: 500, w: 1080, h: 1100 }} />

      <Msg from={ne + 6} to={ne + 120} text="Vamos nos ver! 🥳" top={360} />
      <Msg from={ne + 60} to={ne + 180} text="Vamos sair! 😄" top={500} />
      <Msg from={ne + 120} to={ne + 250} text="Tô com saudade de você! ❤️" top={640} />

      <div style={{ position: "absolute", transform: `translateY(${-bob}px)` }}>
        <Figure who="ele" expression="happy" cx={330} baseY={H - 190} width={370} leftArm="up" rightArm="up" blush />
      </div>
      <Figure who="ela" expression="smile" cx={760} baseY={H - 190} width={330} flip leftArm="hip" rightArm="down" />

      <SpeechBubble text={"Bah, que guri\ninsistente! 😏💕"} from={ne + 150} to={ne + 260} tail="right" style={{ right: 120, top: H - 1120, whiteSpace: "pre-line" }} />
    </SceneBase>
  );
};
