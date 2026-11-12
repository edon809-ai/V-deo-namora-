import React from "react";
import { Composition } from "remotion";
import { NossaHistoria } from "./Video";
import { CharPreview } from "./Preview";
import { TOTAL_FRAMES } from "./schedule";
import { W, H, FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NossaHistoria"
        component={NossaHistoria}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="CharPreview" component={CharPreview} durationInFrames={90} fps={FPS} width={W} height={H} />
    </>
  );
};
