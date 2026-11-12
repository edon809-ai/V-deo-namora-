import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, Ground, CloudRow } from "../components/Backgrounds";
import { Heart } from "../components/Decor";
import { Figure } from "../components/Stage";
import { SpeechBubble } from "../components/SpeechBubble";
import { Phone } from "../components/Character";
import { FONT } from "../fonts";
import { TIMINGS } from "../timing";
import { C, H } from "../theme";

const MsgPuff: React.FC<{ from: number; x: number }> = ({ from, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = frame - from;
  if (l < 0 || l > fps * 2.4) return null;
  const p = l / (fps * 2.4);
  const y = interpolate(p, [0, 1], [0, -180]);
  const op = interpolate(p, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
  const pop = spring({ frame: l, fps, config: { damping: 12, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", left: x, top: H - 980 + y, opacity: op, transform: `scale(${pop})` }}>
      <div style={{ background: "#7ec8ff", color: "#fff", fontFamily: FONT.dialog, fontWeight: 700, fontSize: 38, padding: "14px 24px", borderRadius: "24px 24px 24px 6px", boxShadow: "0 6px 16px rgba(80,120,160,0.3)" }}>
        Oi, tudo bem? 😊
      </div>
    </div>
  );
};

const LikePuff: React.FC<{ from: number; x: number }> = ({ from, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l = frame - from;
  if (l < 0 || l > fps * 2) return null;
  const p = l / (fps * 2);
  const op = interpolate(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const pop = spring({ frame: l, fps, config: { damping: 9, stiffness: 150 } });
  return (
    <div style={{ position: "absolute", left: x, top: H - 1120 - p * 140, opacity: op, transform: `scale(${pop})` }}>
      <Heart size={54} color={C.heart} />
    </div>
  );
};

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const t = TIMINGS.find((x) => x.index === 4)!;
  const narrEnd = t.narrationDelay + t.narrationDur;

  return (
    <SceneBase index={4}>
      <Gradient from="#d9ecff" to={C.skyBot} />
      <CloudRow speed={9} opacity={0.9} />
      <Ground y={H - 330} color="#bfe3a1" color2="#d4efbf" />

      {[0, 42, 90, 140, 196].map((f, i) => (
        <MsgPuff key={i} from={f} x={250 + (i % 2) * 50} />
      ))}
      {[20, 70, 120, 175].map((f, i) => (
        <LikePuff key={i} from={f} x={360 + (i % 3) * 60} />
      ))}

      <Figure who="ele" expression="happy" cx={360} baseY={H - 200} width={360} leftArm="forward" rightArm="forward" blush />
      <div style={{ position: "absolute", left: 330, top: H - 680, transform: "rotate(-8deg)" }}>
        <Phone style={{ width: 70 }} />
      </div>

      <Figure who="ela" expression="neutral" cx={760} baseY={H - 200} width={330} flip leftArm="hip" rightArm="hip" />

      <SpeechBubble
        text={"Bah, esse guri\nde novo, tchê? 🤨"}
        from={narrEnd + 18}
        to={narrEnd + 150}
        tail="right"
        style={{ left: 560, top: H - 1120, whiteSpace: "pre-line" }}
      />
    </SceneBase>
  );
};
