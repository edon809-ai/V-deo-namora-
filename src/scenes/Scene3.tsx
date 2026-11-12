import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, Ground, CloudRow } from "../components/Backgrounds";
import { Heart, Sparkles } from "../components/Decor";
import { Figure } from "../components/Stage";
import { getScene } from "../schedule";
import { C, W, H } from "../theme";

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = getScene(3);
  const narrEnd = t.narrationDelay + t.narrationDur;
  const heartPop = spring({ frame: frame - (narrEnd - 40), fps, config: { damping: 10, stiffness: 140 } });
  const inEla = interpolate(frame, [6, 30], [-400, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const inEle = interpolate(frame, [6, 30], [400, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <SceneBase index={3}>
      <Gradient from={C.skyTop} to="#fff0dd" />
      <CloudRow speed={10} opacity={0.9} />
      <Sparkles count={8} seed="s3" area={{ x: 80, y: 300, w: 920, h: 500 }} />

      {/* obra: prédio em construção + guindaste */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        {/* guindaste */}
        <g stroke="#f4a63b" strokeWidth={12} fill="none">
          <line x1={840} y1={1160} x2={840} y2={430} />
          <line x1={560} y1={470} x2={980} y2={470} />
          <line x1={840} y1={430} x2={620} y2={470} />
          <line x1={840} y1={430} x2={960} y2={470} />
        </g>
        <rect x={610} y={470} width="40" height="70" fill="#ffcf4d" stroke="#f4a63b" strokeWidth={6} />
        <line x1={630} y1={540} x2={630} y2={700} stroke="#8a8a8a" strokeWidth={4} />
        <rect x={604} y={700} width="54" height="34" rx="6" fill="#c9a36b" />
        {/* estrutura em construção */}
        <g>
          <rect x={120} y={700} width="360" height="460" fill="#d9c3a3" opacity={0.5} />
          {[700, 820, 940, 1060].map((y) => (
            <rect key={y} x={120} y={y} width="360" height="14" fill="#b89b72" />
          ))}
          {[120, 240, 360, 466].map((x) => (
            <rect key={x} x={x} y={700} width="14" height="460" fill="#b89b72" />
          ))}
          {/* andaime */}
          <g stroke="#9aa7bd" strokeWidth={6}>
            <line x1={110} y1={760} x2={500} y2={760} />
            <line x1={110} y1={1000} x2={500} y2={1000} />
            <line x1={150} y1={700} x2={150} y2={1160} />
            <line x1={440} y1={700} x2={440} y2={1160} />
          </g>
        </g>
      </svg>

      <Ground color="#cbb79a" color2="#ddcbb0" y={H - 300} />
      {/* tapumes / cones */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        {[180, 900].map((x, i) => (
          <g key={i} transform={`translate(${x} 1480)`}>
            <path d="M 0 0 L 28 -70 L 56 0 Z" fill="#ff7a3c" />
            <rect x={8} y={-40} width="40" height="10" fill="#fff" />
            <ellipse cx={28} cy={2} rx={34} ry={8} fill="#e86a2e" />
          </g>
        ))}
      </svg>

      <div style={{ position: "absolute", transform: `translateX(${inEle}px)` }}>
        <Figure who="ele" expression="smile" cx={700} baseY={H - 300} width={380} helmet leftArm="hip" rightArm="down" blush />
      </div>
      <div style={{ position: "absolute", transform: `translateX(${inEla}px)` }}>
        <Figure who="ela" expression="happy" cx={380} baseY={H - 300} width={340} badge leftArm="wave" rightArm="down" />
      </div>

      <div style={{ position: "absolute", left: W / 2 - 60, top: H - 820, transform: `scale(${Math.max(0, heartPop)})` }}>
        <Heart size={120} color={C.heart} />
      </div>
    </SceneBase>
  );
};
