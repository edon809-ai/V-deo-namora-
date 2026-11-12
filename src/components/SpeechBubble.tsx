import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FONT } from "../fonts";
import { C } from "../theme";

/** Balão de fala com pop-in. `tail` = lado para onde aponta o rabinho. */
export const SpeechBubble: React.FC<{
  text: string;
  from: number;
  to?: number;
  tail?: "left" | "right" | "down";
  color?: string;
  textColor?: string;
  style?: React.CSSProperties;
  fontSize?: number;
}> = ({ text, from, to, tail = "down", color = C.bubble, textColor = C.bubbleText, style, fontSize = 46 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;
  if (local < 0) return null;

  const pop = spring({ frame: local, fps, config: { damping: 11, stiffness: 160, mass: 0.7 } });
  const out = to ? interpolate(frame, [to - 8, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  if (to && frame > to) return null;

  const tailEl = () => {
    const common = { fill: color } as const;
    if (tail === "left")
      return <path d="M 2 18 L -26 34 L 20 44 Z" {...common} style={{ position: "absolute", left: -2, top: "55%" }} />;
    if (tail === "right")
      return <path d="M -2 18 L 26 34 L -20 44 Z" {...common} />;
    return null;
  };

  return (
    <div
      style={{
        position: "absolute",
        transform: `scale(${pop})`,
        transformOrigin: tail === "left" ? "left bottom" : tail === "right" ? "right bottom" : "center bottom",
        opacity: out,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          background: color,
          color: textColor,
          fontFamily: FONT.dialog,
          fontWeight: 700,
          fontSize,
          lineHeight: 1.18,
          padding: "20px 30px",
          borderRadius: 32,
          boxShadow: "0 10px 24px rgba(90,74,99,0.22)",
          maxWidth: 520,
          textAlign: "center",
          border: "4px solid rgba(255,255,255,0.7)",
        }}
      >
        {text}
        {/* rabinho */}
        {tail === "down" && (
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "20px solid transparent",
              borderRight: "20px solid transparent",
              borderTop: `26px solid ${color}`,
            }}
          />
        )}
        {tail === "left" && (
          <div style={{ position: "absolute", bottom: 18, left: -22, width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderRight: `28px solid ${color}` }} />
        )}
        {tail === "right" && (
          <div style={{ position: "absolute", bottom: 18, right: -22, width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: `28px solid ${color}` }} />
        )}
      </div>
      {tailEl()}
    </div>
  );
};
