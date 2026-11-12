import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { getScene } from "../schedule";
import { SpeechBubble } from "./SpeechBubble";

/** Toca as falas (voz) de uma cena e mostra os balões sincronizados. */
export const DialogTrack: React.FC<{ index: number }> = ({ index }) => {
  const { lines } = getScene(index);
  return (
    <>
      {lines.map((l) => (
        <React.Fragment key={l.id}>
          <Sequence from={l.start} durationInFrames={l.audioEnd - l.start + 15}>
            <Audio src={staticFile(`audio/${l.id}.mp3`)} />
          </Sequence>
          <SpeechBubble
            text={l.show}
            from={l.start}
            to={l.bubbleEnd}
            tail={l.tail}
            color={l.color}
            style={{
              ...(l.left !== undefined ? { left: l.left } : {}),
              ...(l.right !== undefined ? { right: l.right } : {}),
              top: l.top,
              whiteSpace: "pre-line",
            }}
          />
        </React.Fragment>
      ))}
    </>
  );
};
