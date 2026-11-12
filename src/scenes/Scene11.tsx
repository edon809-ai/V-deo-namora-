import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient } from "../components/Backgrounds";
import { FloatingHearts, Sparkles, Heart } from "../components/Decor";
import { Figure } from "../components/Stage";
import { getScene } from "../schedule";
import { C, W, H } from "../theme";

export const Scene11: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const yesAt = getScene(11).lines[1].start; // "Bah, claro que sim!"
  const burst = spring({ frame: frame - yesAt, fps, config: { damping: 9, stiffness: 120 } });

  return (
    <SceneBase index={11}>
      <Gradient from="#ffd9ea" to="#ffecd2" />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.7), transparent 55%)" }} />
      <Sparkles count={22} seed="s11" area={{ x: 40, y: 200, w: 1000, h: 900 }} />
      <FloatingHearts count={16} seed="s11h" area={{ x: 0, y: 400, w: W, h: 1300 }} />

      <div style={{ position: "absolute", bottom: 0, width: "100%", height: 320, background: "linear-gradient(180deg,#f7c9dd,#e8a9c6)" }} />

      <Figure who="ele" expression="love" cx={360} baseY={H - 220} width={360} kneel leftArm="reachR" rightArm="down" ring blush />
      <Figure who="ela" expression="love" cx={760} baseY={H - 220} width={330} flip leftArm="heartL" rightArm="heartR" />

      {frame >= yesAt &&
        [0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          const d = burst * 220;
          return (
            <div key={i} style={{ position: "absolute", left: W / 2 + Math.cos(a) * d - 40, top: H / 2 - 260 + Math.sin(a) * d - 40, transform: `scale(${burst})` }}>
              <Heart size={80} color={i % 2 ? C.heart2 : C.heart} />
            </div>
          );
        })}
    </SceneBase>
  );
};
