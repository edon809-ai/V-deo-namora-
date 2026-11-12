import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, CloudRow } from "../components/Backgrounds";
import { FloatingHearts, Sparkles, Heart } from "../components/Decor";
import { Figure } from "../components/Stage";
import { FONT } from "../fonts";
import { getScene } from "../schedule";
import { C, H } from "../theme";

export const Scene13: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = getScene(13);
  const ne = t.narrationDelay + t.narrationDur;
  const card = spring({ frame: frame - (ne + 10), fps, config: { damping: 13, stiffness: 110 } });
  const heartBeat = 1 + Math.abs(Math.sin((frame / fps) * 3)) * 0.12;
  const glow = interpolate(frame % 90, [0, 45, 90], [0.4, 1, 0.4]);

  return (
    <SceneBase index={13}>
      <Gradient from="#ffe0ee" to="#fff2d9" />
      <CloudRow speed={8} opacity={0.9} />
      <Sparkles count={20} seed="s13" area={{ x: 40, y: 160, w: 1000, h: 900 }} />
      <FloatingHearts count={18} seed="s13h" area={{ x: 0, y: 300, w: 1080, h: 1400 }} />

      <div style={{ position: "absolute", top: 300, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${heartBeat})`, filter: `drop-shadow(0 0 ${glow * 30}px rgba(255,111,145,0.7))` }}>
        <Heart size={200} color={C.heart} />
      </div>

      {/* card de texto final */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${Math.max(0, card)})`, background: "rgba(255,255,255,0.9)", borderRadius: 40, padding: "48px 56px", maxWidth: 900, textAlign: "center", boxShadow: "0 16px 40px rgba(255,111,145,0.3)", border: "5px solid #ffd0e0", marginTop: 120 }}>
          <div style={{ fontFamily: FONT.dialog, fontWeight: 700, fontSize: 64, color: "#c24a73", lineHeight: 1.3 }}>
            Ainda bem que você
            <br /> me deu essa chance.
          </div>
          <div style={{ fontFamily: FONT.head, fontWeight: 700, fontSize: 90, color: "#ff5b92", marginTop: 20 }}>
            Te amo! ❤️
          </div>
        </div>
      </AbsoluteFill>

      <Figure who="ela" expression="love" cx={400} baseY={H - 120} width={320} leftArm="heartL" rightArm="down" />
      <Figure who="ele" expression="love" cx={690} baseY={H - 120} width={350} flip leftArm="heartL" rightArm="down" blush />
    </SceneBase>
  );
};
