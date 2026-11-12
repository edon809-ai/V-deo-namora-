import React from "react";
import { Composition } from "remotion";
import { NossaHistoria } from "./Video";
import { TOTAL_FRAMES } from "./timing";
import { W, H, FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="NossaHistoria"
      component={NossaHistoria}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
