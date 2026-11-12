import React from "react";
import { Character, CharacterProps } from "./Character";

/** Posiciona um personagem pelo centro-x e base-y (px na tela 1080x1920). */
export const Figure: React.FC<
  CharacterProps & { cx: number; baseY: number; width: number; rotate?: number; extraStyle?: React.CSSProperties }
> = ({ cx, baseY, width, rotate = 0, extraStyle, ...props }) => {
  const height = (width * 480) / 320;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - width / 2,
        top: baseY - height,
        width,
        height,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "center bottom",
        ...extraStyle,
      }}
    >
      <Character {...props} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
