import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, Ground, CloudRow } from "../components/Backgrounds";
import { FloatingHearts, Sparkles, Heart } from "../components/Decor";
import { Figure } from "../components/Stage";
import { FONT } from "../fonts";
import { C, H } from "../theme";

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 120 } });
  const sub = interpolate(frame, [24, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneBase index={1}>
      <Gradient from={C.skyTop} to={C.skyBot} />
      <CloudRow speed={12} opacity={0.95} />
      <Sparkles count={14} seed="s1" area={{ x: 60, y: 120, w: 960, h: 700 }} />
      <FloatingHearts count={10} seed="s1h" area={{ x: 0, y: 400, w: 1080, h: 1200 }} />
      <Ground y={H - 360} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <div style={{ transform: `scale(${pop})`, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <Heart size={120} color={C.heart} />
          </div>
          <div
            style={{
              fontFamily: FONT.head,
              fontWeight: 700,
              fontSize: 118,
              color: "#ff5b92",
              lineHeight: 1.05,
              textShadow: "0 6px 0 #fff, 0 10px 18px rgba(255,111,145,0.35)",
              padding: "0 40px",
            }}
          >
            Onde tudo
            <br />
            começou
          </div>
        </div>
        <div
          style={{
            opacity: sub,
            marginTop: 26,
            fontFamily: FONT.dialog,
            fontWeight: 600,
            fontSize: 52,
            color: "#8a6a9a",
          }}
        >
          — a nossa história —
        </div>
      </AbsoluteFill>

      <Figure who="ela" expression="happy" cx={400} baseY={H - 150} width={330} leftArm="wave" rightArm="hip" />
      <Figure who="ele" expression="smile" cx={700} baseY={H - 150} width={350} rightArm="wave" leftArm="hip" blush />
    </SceneBase>
  );
};
