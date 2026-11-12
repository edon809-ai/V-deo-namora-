import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Caption } from "./Caption";
import { DialogTrack } from "./DialogTrack";
import { loadFonts } from "../fonts";
import { getScene, narrationOf } from "../schedule";

/** Base de cada cena: toca a narração + falas, mostra a legenda e envolve o conteúdo. */
export const SceneBase: React.FC<{
  index: number;
  children: React.ReactNode;
  caption?: boolean;
  dialog?: boolean;
  volume?: number;
}> = ({ index, children, caption = true, dialog = true, volume = 1 }) => {
  loadFonts();
  const t = getScene(index);
  const text = narrationOf(index);

  return (
    <AbsoluteFill>
      {children}
      <Sequence from={t.narrationDelay} durationInFrames={t.narrationDur + 30}>
        <Audio src={staticFile(`audio/scene${index}.mp3`)} volume={volume} />
      </Sequence>
      {dialog && <DialogTrack index={index} />}
      {caption && (
        <Caption text={text} from={t.narrationDelay} to={t.narrationDelay + t.narrationDur + 6} />
      )}
    </AbsoluteFill>
  );
};
