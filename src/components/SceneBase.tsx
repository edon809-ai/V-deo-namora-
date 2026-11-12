import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Caption } from "./Caption";
import { loadFonts } from "../fonts";
import audioData from "../audioData.json";
import { TIMINGS } from "../timing";

const narration = audioData.narration as Record<string, string>;

/** Base de cada cena: toca a narração, mostra a legenda e envolve o conteúdo. */
export const SceneBase: React.FC<{
  index: number;
  children: React.ReactNode;
  caption?: boolean;
  volume?: number;
}> = ({ index, children, caption = true, volume = 1 }) => {
  loadFonts();
  const t = TIMINGS.find((x) => x.index === index)!;
  const text = narration[String(index)];

  return (
    <AbsoluteFill>
      {children}
      <Sequence from={t.narrationDelay} durationInFrames={t.narrationDur + 30}>
        <Audio src={staticFile(`audio/scene${index}.mp3`)} volume={volume} />
      </Sequence>
      {caption && (
        <Caption text={text} from={t.narrationDelay} to={t.narrationDelay + t.narrationDur + 8} />
      )}
    </AbsoluteFill>
  );
};
