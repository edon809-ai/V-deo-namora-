import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SceneBase } from "../components/SceneBase";
import { Gradient, Rain, Flood, CloudRow } from "../components/Backgrounds";
import { FONT } from "../fonts";
import { C, W, H } from "../theme";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const waterY = H - 520 + interpolate(frame, [0, 120], [120, 0], { extrapolateRight: "clamp" });

  return (
    <SceneBase index={2}>
      <Gradient from="#8793a8" to="#aeb9c9" />
      <CloudRow speed={16} opacity={0.5} />
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
          {/* torre de controle */}
          <rect x={160} y={720} width="70" height="380" fill="#c7cedd" />
          <rect x={150} y={680} width="90" height="70" rx="10" fill="#9aa7bd" />
          <rect x={160} y={690} width="70" height="36" fill="#bfe3ff" opacity={0.8} />
          <rect x={190} y={620} width="10" height="70" fill="#9aa7bd" />
          {/* terminal */}
          <path d="M 300 900 Q 640 760 980 900 L 980 1120 L 300 1120 Z" fill="#d7ddea" />
          <rect x={300} y={900} width="680" height="220" fill="#cdd4e3" opacity={0.5} />
          {[340, 430, 520, 610, 700, 790, 880].map((x) => (
            <rect key={x} x={x} y={940} width="48" height="80" rx="6" fill="#aebbcf" />
          ))}
          <text x={640} y={1070} textAnchor="middle" fontFamily="Fredoka" fontSize="52" fill="#8a94a8" fontWeight={700}>
            AEROPORTO
          </text>
          {/* aviãozinho parado */}
          <g transform="translate(720 840)">
            <ellipse cx={0} cy={0} rx={110} ry={30} fill="#eef2f8" />
            <path d="M -20 -6 L 40 -58 L 56 -54 L 10 -4 Z" fill="#dfe6f0" />
            <path d="M -20 6 L 40 54 L 56 50 L 10 4 Z" fill="#dfe6f0" />
            <path d="M -96 -8 L -130 -40 L -118 -6 Z" fill="#dfe6f0" />
            <circle cx={40} cy={-2} r={7} fill="#bfe3ff" />
            <circle cx={60} cy={-2} r={7} fill="#bfe3ff" />
          </g>
        </svg>
        <Flood y={waterY} />
      </AbsoluteFill>
      <Rain count={110} opacity={0.55} />

      <div
        style={{
          position: "absolute",
          top: 230,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT.head,
          fontWeight: 700,
          fontSize: 76,
          color: "#fff",
          textShadow: "0 3px 12px rgba(40,50,70,0.6)",
          opacity: fadeIn,
        }}
      >
        Porto Alegre · 2024
      </div>
    </SceneBase>
  );
};
