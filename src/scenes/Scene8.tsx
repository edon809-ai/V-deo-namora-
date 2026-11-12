import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, CloudRow } from "../components/Backgrounds";
import { Sparkles, FloatingHearts } from "../components/Decor";
import { Figure } from "../components/Stage";
import { FONT } from "../fonts";
import { C, W, H } from "../theme";

const Plane: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <svg width={240 * s} height={120 * s} viewBox="0 0 240 120" style={{ position: "absolute", left: x, top: y }}>
    <ellipse cx={120} cy={60} rx={100} ry={26} fill="#fff" stroke="#cdd6e6" strokeWidth={3} />
    <path d="M 120 40 L 180 6 L 196 10 L 150 44 Z" fill="#dfe6f3" />
    <path d="M 120 80 L 180 114 L 196 110 L 150 76 Z" fill="#dfe6f3" />
    <path d="M 24 52 L -6 24 L 2 54 Z" fill="#cdd6e6" />
    <circle cx={150} cy={58} r={8} fill="#9fd0ff" />
    <circle cx={178} cy={58} r={8} fill="#9fd0ff" />
    <circle cx={122} cy={58} r={8} fill="#9fd0ff" />
  </svg>
);

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const banner = spring({ frame: frame - 20, fps, config: { damping: 11, stiffness: 120 } });
  const planeX = interpolate(frame, [70, 300], [-260, W + 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const planeY = interpolate(frame, [70, 300], [360, 210]);

  return (
    <SceneBase index={8}>
      <Gradient from={C.skyTop} to="#ffeede" />
      <CloudRow speed={10} opacity={0.9} />
      <Sparkles count={18} seed="s8" area={{ x: 60, y: 160, w: 960, h: 700 }} />

      <Plane x={planeX} y={planeY} s={1.2} />
      {/* rastro de corações do avião */}
      <FloatingHearts count={8} seed="s8h" area={{ x: 80, y: 260, w: 900, h: 300 }} colors={[C.heart2, "#ffd0e0"]} />

      {/* banner promoção */}
      <div style={{ position: "absolute", top: 560, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${banner})` }}>
        <div style={{ background: "linear-gradient(180deg,#ffd76a,#ffb43b)", padding: "22px 54px", borderRadius: 30, border: "6px solid #fff", boxShadow: "0 10px 26px rgba(200,140,40,0.35)", fontFamily: FONT.head, fontWeight: 700, fontSize: 70, color: "#7a4a12" }}>
          ⭐ Promovida! ⭐
        </div>
      </div>
      {/* seta pra cima */}
      <svg width={120} height={200} viewBox="0 0 120 200" style={{ position: "absolute", left: W / 2 - 60, top: 740, opacity: banner }}>
        <path d="M 60 10 L 110 90 L 78 90 L 78 190 L 42 190 L 42 90 L 10 90 Z" fill="#7bc45e" />
      </svg>

      <Figure who="ela" expression="happy" cx={W / 2} baseY={H - 160} width={360} leftArm="cheer" rightArm="cheer" />
    </SceneBase>
  );
};
