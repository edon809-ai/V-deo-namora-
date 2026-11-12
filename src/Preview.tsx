import React from "react";
import { AbsoluteFill } from "remotion";
import { Character } from "./components/Character";
import { loadFonts, FONT } from "./fonts";
import { C } from "./theme";

const Face: React.FC<{ who: "ela" | "ele"; expr: any; blush?: boolean }> = ({ who, expr, blush }) => (
  <div style={{ width: 150, height: 150, overflow: "hidden", borderRadius: 24, background: "#fff", boxShadow: "0 8px 18px rgba(90,74,99,0.18)" }}>
    <div style={{ transform: "translate(-32px,-6px) scale(1.5)" }}>
      <Character who={who} expression={expr} blush={blush} style={{ width: 300, height: 450 }} />
    </div>
  </div>
);

export const CharPreview: React.FC = () => {
  loadFonts();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.skyTop}, ${C.skyBot})` }}>
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: FONT.head, fontWeight: 700, fontSize: 80, color: "#ff5b92" }}>
        Preview dos personagens
      </div>

      <div style={{ position: "absolute", top: 360, left: 40, width: 480, textAlign: "center" }}>
        <Character who="ela" expression="love" leftArm="wave" rightArm="hip" style={{ width: 480, height: 720 }} />
        <div style={{ fontFamily: FONT.dialog, fontWeight: 700, fontSize: 56, color: "#8a5a9a" }}>ELA</div>
      </div>
      <div style={{ position: "absolute", top: 360, right: 40, width: 500, textAlign: "center" }}>
        <Character who="ele" expression="smile" leftArm="hip" rightArm="wave" blush style={{ width: 500, height: 750 }} />
        <div style={{ fontFamily: FONT.dialog, fontWeight: 700, fontSize: 56, color: "#4f7ec0" }}>ELE</div>
      </div>

      <div style={{ position: "absolute", bottom: 90, width: "100%", display: "flex", justifyContent: "center", gap: 18 }}>
        <Face who="ela" expr="happy" />
        <Face who="ela" expr="shocked" />
        <Face who="ela" expr="sad" />
        <Face who="ele" expr="happy" blush />
        <Face who="ele" expr="neutral" />
        <Face who="ele" expr="sad" />
      </div>
    </AbsoluteFill>
  );
};
