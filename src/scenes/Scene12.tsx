import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Sun } from "../components/Backgrounds";
import { FloatingHearts, Sparkles } from "../components/Decor";
import { Figure } from "../components/Stage";
import { AbsoluteFill } from "remotion";
import { C, W, H } from "../theme";

export const Scene12: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sway = Math.sin((frame / fps) * 1.1) * 6;

  return (
    <SceneBase index={12}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.sunsetTop} 0%, ${C.sunsetMid} 48%, ${C.sunsetBot} 100%)` }} />
      <Sun x={W / 2} y={820} r={150} color="#ffd98f" />
      {/* reflexo/mar */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: 520, background: "linear-gradient(180deg, rgba(255,180,150,0.5), rgba(150,110,180,0.7))" }} />
      {/* passarinhos */}
      <svg width={W} height={400} viewBox={`0 0 ${W} 400`} style={{ position: "absolute", top: 240 }}>
        {[[220, 120], [300, 90], [800, 160], [880, 130]].map(([x, y], i) => (
          <path key={i} d={`M ${x} ${y} q 16 -14 32 0 q 16 -14 32 0`} stroke="#6a4a6a" strokeWidth={5} fill="none" strokeLinecap="round" />
        ))}
      </svg>
      <Sparkles count={14} seed="s12" area={{ x: 80, y: 400, w: 920, h: 500 }} />
      <FloatingHearts count={12} seed="s12h" area={{ x: 0, y: 500, w: W, h: 1200 }} colors={[C.heart, "#ffb0c8", "#ffd0a6"]} />

      {/* morrinho silhueta */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <path d={`M 0 ${H - 300} Q ${W * 0.5} ${H - 440} ${W} ${H - 300} L ${W} ${H} L 0 ${H} Z`} fill="#7a4a74" opacity={0.55} />
      </svg>

      <div style={{ position: "absolute", transform: `rotate(${sway * 0.1}deg)`, transformOrigin: `${W / 2}px ${H}px` }}>
        <Figure who="ele" expression="love" cx={430} baseY={H - 260} width={360} rightArm="reachR" leftArm="down" blush />
        <Figure who="ela" expression="love" cx={650} baseY={H - 260} width={330} leftArm="reachL" rightArm="hip" />
      </div>
    </SceneBase>
  );
};
