import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { FONT } from "../fonts";
import { C } from "../theme";

/** Legenda da narração, embaixo da tela. Visível de `from` até `to`. */
export const Caption: React.FC<{
  text: string;
  from: number;
  to: number;
}> = ({ text, from, to }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [from, from + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [to - 12, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const rise = interpolate(frame, [from, from + 14], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 150,
        display: "flex",
        justifyContent: "center",
        padding: "0 70px",
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <div
        style={{
          background: C.captionBg,
          backdropFilter: "blur(2px)",
          color: C.caption,
          fontFamily: FONT.caption,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.28,
          textAlign: "center",
          padding: "22px 40px",
          borderRadius: 34,
          maxWidth: 940,
          boxShadow: "0 10px 30px rgba(60,40,70,0.25)",
          textShadow: "0 2px 6px rgba(0,0,0,0.35)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
