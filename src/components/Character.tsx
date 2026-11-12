import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C } from "../theme";

export type Expression =
  | "happy"
  | "smile"
  | "shocked"
  | "sad"
  | "love"
  | "shy"
  | "neutral";

type Pose =
  | "down"
  | "hip"
  | "wave"
  | "up"
  | "forward"
  | "heartL"
  | "heartR"
  | "reachR"
  | "reachL"
  | "cheer";

export type CharacterProps = {
  who: "ela" | "ele";
  expression?: Expression;
  blush?: boolean;
  leftArm?: Pose; // braço no lado direito da tela (esquerda do personagem)
  rightArm?: Pose; // braço no lado esquerdo da tela
  helmet?: boolean; // capacete (ele na obra)
  badge?: boolean; // crachá (ela na obra)
  ring?: boolean; // segurando aliança (pedido)
  walk?: boolean; // anima as perninhas
  kneel?: boolean; // ajoelhado (pedido de namoro)
  flip?: boolean; // espelha horizontalmente
  style?: React.CSSProperties;
};

// mão de cada pose (viewBox 320x480). "L" = braço do lado DIREITO da tela.
const HAND_L: Record<Pose, [number, number]> = {
  down: [86, 398],
  hip: [126, 352],
  wave: [66, 150],
  up: [78, 150],
  forward: [150, 338],
  heartL: [150, 258],
  heartR: [150, 258],
  reachR: [150, 372],
  reachL: [70, 372],
  cheer: [72, 140],
};
const HAND_R: Record<Pose, [number, number]> = {
  down: [234, 398],
  hip: [194, 352],
  wave: [254, 150],
  up: [242, 150],
  forward: [170, 338],
  heartL: [170, 258],
  heartR: [170, 258],
  reachR: [250, 372],
  reachL: [170, 372],
  cheer: [248, 140],
};

const Eye: React.FC<{ cx: number; cy: number; blink: number; iris: string }> = ({
  cx,
  cy,
  blink,
  iris,
}) => (
  <g transform={`translate(${cx} ${cy}) scale(1 ${blink})`}>
    <ellipse cx={0} cy={0} rx={21} ry={26} fill="#fff" />
    <ellipse cx={0} cy={3} rx={16} ry={21} fill={iris} />
    <circle cx={0} cy={4} r={9} fill="#2a2030" />
    <circle cx={-6} cy={-6} r={7} fill="#fff" />
    <circle cx={7} cy={9} r={3.5} fill="#fff" opacity={0.9} />
    <ellipse cx={0} cy={-18} rx={19} ry={9} fill="#fff" opacity={0.25} />
  </g>
);

export const Character: React.FC<CharacterProps> = ({
  who,
  expression = "smile",
  blush,
  leftArm = "down",
  rightArm = "down",
  helmet,
  badge,
  ring,
  walk,
  kneel,
  flip,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // piscar: piscada rápida a cada ~3.4s
  const cyc = (frame % Math.round(fps * 3.4)) / fps;
  const blink = cyc > 3.15 && cyc < 3.32 ? 0.12 : 1;

  // respirar: leve sobe-desce do tronco/cabeça
  const breathe = Math.sin((frame / fps) * 2 * Math.PI * 0.42) * 3;

  // perninhas andando
  const legSwing = walk ? Math.sin((frame / fps) * 2 * Math.PI * 2.1) * 16 : 0;

  const isEla = who === "ela";
  const skin = isEla ? C.elaSkin : C.eleSkin;
  const skinSh = isEla ? C.elaSkinShade : C.eleSkinShade;
  const cheek = isEla ? C.elaCheek : C.eleCheek;
  const iris = isEla ? C.elaEye : C.eleEye;
  const shirt = isEla ? C.elaShirt : C.eleShirt;
  const shirt2 = isEla ? C.elaShirt2 : C.eleShirt2;

  const [lhx, lhy] = HAND_L[leftArm];
  const [rhx, rhy] = HAND_R[rightArm];
  const Ls: [number, number] = [116, 300];
  const Rs: [number, number] = [204, 300];

  const arm = (
    s: [number, number],
    h: [number, number],
    key: string,
  ) => {
    const mx = (s[0] + h[0]) / 2 + (h[0] < 160 ? -16 : 16);
    const my = (s[1] + h[1]) / 2 + 10;
    return (
      <g key={key}>
        <path
          d={`M ${s[0]} ${s[1]} Q ${mx} ${my} ${h[0]} ${h[1]}`}
          stroke={skin}
          strokeWidth={30}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={h[0]} cy={h[1]} r={17} fill={skin} />
      </g>
    );
  };

  // boca por expressão
  const mouth = () => {
    const my = 196;
    switch (expression) {
      case "shocked":
        return <ellipse cx={160} cy={my + 6} rx={16} ry={22} fill="#7a3b4a" />;
      case "sad":
        return (
          <path
            d={`M 140 ${my + 10} Q 160 ${my - 6} 180 ${my + 10}`}
            stroke="#a24a5c"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        );
      case "happy":
      case "love":
        return (
          <path
            d={`M 134 ${my - 4} Q 160 ${my + 34} 186 ${my - 4} Q 160 ${my + 8} 134 ${my - 4} Z`}
            fill="#8a3a4c"
          />
        );
      case "neutral":
        return (
          <path
            d={`M 146 ${my + 4} Q 160 ${my + 10} 174 ${my + 4}`}
            stroke="#a24a5c"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        );
      default: // smile / shy
        return (
          <path
            d={`M 138 ${my} Q 160 ${my + 26} 182 ${my}`}
            stroke="#a24a5c"
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
          />
        );
    }
  };

  // sobrancelhas
  const brows = () => {
    const by = expression === "shocked" ? 96 : 104;
    const lift = expression === "sad" ? -6 : 0;
    const angle = expression === "sad" ? 8 : expression === "shocked" ? -6 : -3;
    return (
      <g stroke={isEla ? C.elaHair : "#20202a"} strokeWidth={isEla ? 7 : 10} strokeLinecap="round">
        <line x1={120} y1={by + lift + angle} x2={150} y2={by + lift - angle} />
        <line x1={170} y1={by + lift - angle} x2={200} y2={by + lift + angle} />
      </g>
    );
  };

  const showBlush = blush || expression === "shy" || expression === "love";

  return (
    <svg
      viewBox="0 0 320 480"
      style={{ overflow: "visible", ...style }}
      transform={flip ? "scale(-1 1)" : undefined}
    >
      {/* sombra no chão */}
      <ellipse cx={160} cy={468} rx={96} ry={16} fill="rgba(80,60,90,0.18)" />

      <g transform={kneel ? "translate(0 36)" : undefined}>
        {/* ===== pernas ===== */}
        {kneel ? (
          <g>
            <rect x={132} y={372} width="30" height="70" rx="15" fill={isEla ? "#6f5bbd" : "#3a4a66"} />
            <path d="M 150 436 Q 150 470 198 470 L 200 452 Q 164 452 164 430 Z" fill={isEla ? "#6f5bbd" : "#3a4a66"} />
            <ellipse cx={196} cy={466} rx={22} ry={12} fill="#45413f" />
            <ellipse cx={150} cy={450} rx={20} ry={12} fill="#45413f" />
          </g>
        ) : (
          <g>
            <g transform={`translate(0 ${legSwing})`}>
              <rect x={132} y={372} width="24" height="68" rx="12" fill={isEla ? "#6f5bbd" : "#3a4a66"} />
              <ellipse cx={142} cy={446} rx={22} ry={13} fill="#45413f" />
            </g>
            <g transform={`translate(0 ${-legSwing})`}>
              <rect x={164} y={372} width="24" height="68" rx="12" fill={isEla ? "#6f5bbd" : "#3a4a66"} />
              <ellipse cx={178} cy={446} rx={22} ry={13} fill="#45413f" />
            </g>
          </g>
        )}

        {/* ===== braço de trás (lado esquerdo da tela) ===== */}
        {arm(Rs, [rhx, rhy], "armR")}

        <g transform={`translate(0 ${breathe})`}>
          {/* ===== tronco ===== */}
          <path
            d="M 108 300 Q 160 280 212 300 L 222 388 Q 160 408 98 388 Z"
            fill={shirt}
          />
          <path d="M 108 300 Q 160 318 212 300 L 210 322 Q 160 338 110 322 Z" fill={shirt2} />
          {isEla && <ellipse cx={160} cy={352} rx={10} ry={10} fill="#ffe3ef" />}
          {!isEla && (
            // colete laranja de obra
            (helmet ? (
              <g>
                <path d="M 112 302 L 128 300 L 132 392 L 108 388 Z" fill={C.eleVest} />
                <path d="M 208 302 L 192 300 L 188 392 L 212 388 Z" fill={C.eleVest} />
                <rect x={118} y={338} width="84" height="7" fill="#f2f2f2" opacity={0.85} />
              </g>
            ) : null)
          )}
          {badge && (
            <g>
              <line x1={160} y1={300} x2={140} y2={344} stroke="#4a5a7a" strokeWidth={5} />
              <rect x={122} y={344} width="40" height="52" rx="6" fill="#fff" stroke="#c7cedd" strokeWidth={2} />
              <rect x={128} y={350} width="28" height="20" rx="3" fill="#bfe3ff" />
              <rect x={128} y={376} width="28" height="5" rx="2" fill="#d7b3c9" />
              <rect x={128} y={385} width="20" height="4" rx="2" fill="#d7d7e0" />
            </g>
          )}

          {/* ===== cabeça ===== */}
          {/* cabelo de trás (ela) */}
          {isEla && (
            <path
              d="M 60 150 Q 36 300 86 372 L 120 360 Q 86 260 96 150 Z M 260 150 Q 284 300 234 372 L 200 360 Q 234 260 224 150 Z"
              fill={C.elaHair}
            />
          )}
          <circle cx={160} cy={150} r={108} fill={skin} />
          <path d="M 70 176 Q 160 250 250 176 Q 220 250 160 258 Q 100 250 70 176 Z" fill={skinSh} opacity={0.25} />

          {/* orelhas */}
          <circle cx={58} cy={160} r={16} fill={skin} />
          <circle cx={262} cy={160} r={16} fill={skin} />

          {/* ===== cabelo da frente ===== */}
          {isEla ? (
            <g fill={C.elaHair}>
              <path d="M 52 150 Q 44 54 160 44 Q 276 54 268 150 Q 250 96 212 86 Q 232 120 224 140 Q 196 92 150 92 Q 150 70 150 70 Q 118 96 112 138 Q 104 104 120 86 Q 74 100 52 150 Z" />
              <path d="M 52 150 Q 60 118 84 104 Q 70 150 86 196 L 60 196 Q 48 172 52 150 Z" />
              <path d="M 268 150 Q 260 118 236 104 Q 250 150 234 196 L 260 196 Q 272 172 268 150 Z" />
              <ellipse cx={120} cy={70} rx={30} ry={16} fill={C.elaHairLight} opacity={0.5} transform="rotate(-20 120 70)" />
            </g>
          ) : (
            <g fill={C.eleHair}>
              <path d="M 54 146 Q 44 50 160 46 Q 276 50 266 146 Q 258 120 240 110 L 236 92 L 214 108 L 206 90 L 184 104 L 174 86 L 150 102 L 140 86 L 120 104 L 108 92 L 100 112 Q 70 118 54 146 Z" />
              <path d="M 54 146 Q 50 120 64 104 L 70 150 Z" />
              <path d="M 266 146 Q 270 120 256 104 L 250 150 Z" />
            </g>
          )}

          {/* ===== rosto ===== */}
          {brows()}
          <Eye cx={128} cy={132} blink={blink} iris={iris} />
          <Eye cx={192} cy={132} blink={blink} iris={iris} />
          {/* nariz */}
          <ellipse cx={160} cy={172} rx={4} ry={3} fill={skinSh} />
          {mouth()}
          {/* lábios rosados (ela) */}
          {isEla && expression !== "shocked" && (
            <path d="M 138 196 Q 160 204 182 196" stroke={C.elaLips} strokeWidth={3} fill="none" opacity={0.6} />
          )}
          {/* bochechas rosadas */}
          <ellipse cx={104} cy={178} rx={20} ry={13} fill={cheek} opacity={showBlush ? 0.85 : 0.5} />
          <ellipse cx={216} cy={178} rx={20} ry={13} fill={cheek} opacity={showBlush ? 0.85 : 0.5} />
          {showBlush && (
            <g stroke={cheek} strokeWidth={3} strokeLinecap="round" opacity={0.7}>
              <line x1={96} y1={172} x2={96} y2={186} />
              <line x1={104} y1={170} x2={104} y2={188} />
              <line x1={112} y1={172} x2={112} y2={186} />
              <line x1={208} y1={172} x2={208} y2={186} />
              <line x1={216} y1={170} x2={216} y2={188} />
              <line x1={224} y1={172} x2={224} y2={186} />
            </g>
          )}

          {/* barba preta (ele) */}
          {!isEla && (
            <path
              d="M 74 158 Q 80 250 160 262 Q 240 250 246 158 Q 238 196 210 210 Q 232 182 228 170 Q 200 200 160 202 Q 120 200 92 170 Q 88 182 110 210 Q 82 196 74 158 Z"
              fill={C.eleBeard}
              opacity={0.96}
            />
          )}
          {!isEla && (
            <path d="M 150 196 Q 160 214 170 196" stroke={C.eleBeard} strokeWidth={10} fill="none" strokeLinecap="round" />
          )}

          {/* capacete de obra */}
          {helmet && (
            <g>
              <path d="M 52 128 Q 160 10 268 128 Q 268 140 254 140 L 66 140 Q 52 140 52 128 Z" fill="#ffcb3b" />
              <rect x={44} y={134} width="232" height="16" rx="8" fill="#f5b800" />
              <rect x={150} y={30} width="20" height="96" rx="10" fill="#f5b800" opacity={0.7} />
            </g>
          )}
        </g>

        {/* ===== braço da frente (lado direito da tela) ===== */}
        {arm(Ls, [lhx, lhy], "armL")}

        {/* aliancinha na mão */}
        {ring && (
          <g transform={`translate(${lhx} ${lhy})`}>
            <rect x={-22} y={-18} width="44" height="30" rx="6" fill="#fff" stroke="#ffd1e0" strokeWidth={2} />
            <circle cx={0} cy={-2} r={8} fill="none" stroke="#ffcf4d" strokeWidth={4} />
            <path d="M 0 -14 L 4 -8 L -4 -8 Z" fill="#9be7ff" />
          </g>
        )}
      </g>
    </svg>
  );
};

// pequeno componente: celular na mão
export const Phone: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 60 110" style={style}>
    <rect x={4} y={4} width="52" height="102" rx="12" fill="#2b2b3a" />
    <rect x={9} y={12} width="42" height="86" rx="6" fill="#bfe3ff" />
    <circle cx={30} cy={102} r={3} fill="#555" />
  </svg>
);

export const sparkle = (x: number, y: number, s: number, o = 1, key?: string) => (
  <path
    key={key}
    d={`M ${x} ${y - s} L ${x + s * 0.28} ${y - s * 0.28} L ${x + s} ${y} L ${x + s * 0.28} ${y + s * 0.28} L ${x} ${y + s} L ${x - s * 0.28} ${y + s * 0.28} L ${x - s} ${y} L ${x - s * 0.28} ${y - s * 0.28} Z`}
    fill="#fff"
    opacity={o}
  />
);

export const interpArm = interpolate; // reexport p/ conveniência
