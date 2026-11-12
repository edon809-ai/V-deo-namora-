import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TIMINGS, TRANSITION } from "./timing";
import { loadFonts } from "./fonts";

import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";
import { Scene8 } from "./scenes/Scene8";
import { Scene9 } from "./scenes/Scene9";
import { Scene10 } from "./scenes/Scene10";
import { Scene11 } from "./scenes/Scene11";
import { Scene12 } from "./scenes/Scene12";
import { Scene13 } from "./scenes/Scene13";

const SCENES = [
  Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7,
  Scene8, Scene9, Scene10, Scene11, Scene12, Scene13,
];

export const NossaHistoria: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffe9f2" }}>
      <TransitionSeries>
        {SCENES.map((Scene, i) => {
          const t = TIMINGS[i];
          const nodes: React.ReactNode[] = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={t.durationInFrames}>
              <Scene />
            </TransitionSeries.Sequence>,
          ];
          if (i < SCENES.length - 1) {
            nodes.push(
              <TransitionSeries.Transition
                key={`t${i}`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />,
            );
          }
          return nodes;
        })}
      </TransitionSeries>

      {/* música de fundo suave */}
      <Audio src={staticFile("music.mp3")} volume={0.1} />
    </AbsoluteFill>
  );
};
