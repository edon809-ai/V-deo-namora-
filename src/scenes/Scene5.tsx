import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient } from "../components/Backgrounds";
import { Sparkles } from "../components/Decor";
import { Figure } from "../components/Stage";
import { SpeechBubble } from "../components/SpeechBubble";
import { Character, Expression } from "../components/Character";
import { FONT } from "../fonts";
import { TIMINGS } from "../timing";
import { W, H } from "../theme";

const MoviePoster: React.FC = () => (
  <svg width={300} height={440} viewBox="0 0 300 440" style={{ position: "absolute", left: W - 330, top: 300 }}>
    <rect x={0} y={0} width="300" height="440" rx="18" fill="#2b2140" stroke="#ffcf4d" strokeWidth={8} />
    <rect x={14} y={14} width="272" height="300" rx="10" fill="#ffb24d" />
    {/* juba */}
    <circle cx={150} cy={170} r={120} fill="#c97b2c" />
    {/* rosto leão */}
    <circle cx={150} cy={175} r={82} fill="#ffd99b" />
    <ellipse cx={120} cy={160} rx={14} ry={18} fill="#3a2a1a" />
    <ellipse cx={180} cy={160} rx={14} ry={18} fill="#3a2a1a" />
    <circle cx={116} cy={154} r={4} fill="#fff" />
    <circle cx={176} cy={154} r={4} fill="#fff" />
    <path d="M 135 200 Q 150 216 165 200" stroke="#5a3a1a" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M 150 182 L 140 196 L 160 196 Z" fill="#8a5a2a" />
    <text x={150} y={372} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="58" fill="#ffcf4d">
      MUFASA
    </text>
    <text x={150} y={410} textAnchor="middle" fontFamily="Nunito" fontWeight={700} fontSize="24" fill="#fff">
      EM CARTAZ
    </text>
  </svg>
);

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = TIMINGS.find((x) => x.index === 5)!;
  const ne = t.narrationDelay + t.narrationDur;

  // janelas de fala
  const w1 = [ne + 10, ne + 120]; // ela: bora ver Mufasa
  const w2 = [ne + 128, ne + 215]; // ele: quem é mufasa
  const w3 = [ne + 222, ne + 330]; // ela: barbaridade!

  const elaExpr: Expression = frame >= w3[0] && frame < w3[1] ? "shocked" : "happy";
  const eleExpr: Expression = frame >= w2[0] && frame < w2[1] ? "neutral" : frame >= w3[1] ? "happy" : "smile";
  const laughing = frame >= w3[1] - 10;
  const bob = laughing ? Math.abs(Math.sin((frame / fps) * 12)) * 10 : 0;

  return (
    <SceneBase index={5}>
      <Gradient from="#3a2f55" to="#6a5a8a" />
      {/* carpete vermelho / piso */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: 520, background: "linear-gradient(180deg,#7a3b55,#5a2a40)" }} />
      <Sparkles count={16} seed="s5" area={{ x: 40, y: 120, w: 1000, h: 500 }} />
      {/* marquise do cinema */}
      <div style={{ position: "absolute", top: 150, left: 90, width: 500, height: 150, background: "#1f1730", borderRadius: 20, border: "6px solid #ffcf4d", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: FONT.head, fontWeight: 700, fontSize: 58, color: "#ffe08a" }}>CINEMA ✦</span>
      </div>
      <MoviePoster />

      <div style={{ position: "absolute", transform: `translateY(${-bob}px)` }}>
        <Figure who="ela" expression={elaExpr} cx={330} baseY={H - 170} width={340} leftArm={elaExpr === "shocked" ? "wave" : "hip"} rightArm="down" />
      </div>
      <div style={{ position: "absolute", transform: `translateY(${-bob}px)` }}>
        <Figure who="ele" expression={eleExpr} cx={640} baseY={H - 170} width={370} flip leftArm="hip" rightArm="down" blush />
      </div>

      <SpeechBubble text="Bah, bora ver Mufasa? 🎬" from={w1[0]} to={w1[1]} tail="left" style={{ left: 150, top: H - 1180 }} />
      <SpeechBubble text="Quem é Mufasa? 😅" from={w2[0]} to={w2[1]} tail="right" style={{ right: 150, top: H - 1120 }} />
      <SpeechBubble text={"Barbaridade!\nTu não conhece\no Mufasa?! 😱"} from={w3[0]} to={w3[1]} tail="left" color="#fff0f5" style={{ left: 120, top: H - 1240, whiteSpace: "pre-line" }} />
    </SceneBase>
  );
};
