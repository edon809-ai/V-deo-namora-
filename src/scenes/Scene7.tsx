import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, CloudRow } from "../components/Backgrounds";
import { Figure } from "../components/Stage";
import { W, H } from "../theme";

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const dash = interpolate(frame, [20, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneBase index={7}>
      <Gradient from="#aec4de" to="#dfe7f2" />
      <CloudRow speed={7} opacity={0.6} />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <rect x={120} y={700} width="360" height="470" rx="10" fill="#cfd7e6" />
        {[740, 840, 940, 1040].map((y) => [160, 260, 360].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="66" height="56" rx="6" fill="#9fd0ff" />))}
        <path d="M 110 700 L 300 640 L 490 700 Z" fill="#9aa7bd" />
      </svg>

      <svg width={520} height={340} viewBox="0 0 520 340" style={{ position: "absolute", right: 60, top: 300 }}>
        <rect x={0} y={0} width="520" height="340" rx="24" fill="#fff" opacity={0.92} />
        <path d="M 60 120 Q 200 60 300 120 Q 440 150 460 260 Q 360 320 180 300 Q 60 260 60 120 Z" fill="#cdeccb" />
        <circle cx={140} cy={240} r={12} fill="#ff6f91" />
        <text x={140} y={280} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize="30" fill="#5a4a63">POA</text>
        <circle cx={380} cy={140} r={12} fill="#4aa0ff" />
        <text x={392} y={120} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize="30" fill="#5a4a63">SP</text>
        <path d="M 140 240 Q 260 140 380 140" stroke="#ff8fb0" strokeWidth={6} fill="none" strokeDasharray="14 12" strokeDashoffset={-frame * 2} strokeLinecap="round" opacity={dash} />
        <text x={260} y={210} textAnchor="middle" fontFamily="Nunito" fontWeight={800} fontSize="34" fill="#ff6f91" opacity={dash}>± 1.100 km</text>
      </svg>

      <Figure who="ele" expression="sad" cx={330} baseY={H - 180} width={360} rightArm="wave" leftArm="down" />
      <svg width={150} height={140} viewBox="0 0 150 140" style={{ position: "absolute", left: 470, top: H - 360 }}>
        <rect x={10} y={40} width="130" height="90" rx="12" fill="#c98a5a" stroke="#a8703f" strokeWidth={6} />
        <rect x={55} y={22} width="40" height="26" rx="8" fill="none" stroke="#a8703f" strokeWidth={8} />
        <rect x={10} y={72} width="130" height="12" fill="#a8703f" />
      </svg>
      <Figure who="ela" expression="sad" cx={760} baseY={H - 180} width={330} flip rightArm="down" leftArm="wave" />
    </SceneBase>
  );
};
