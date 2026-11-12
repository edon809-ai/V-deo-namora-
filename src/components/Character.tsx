import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
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
  leftArm?: Pose;
  rightArm?: Pose;
  helmet?: boolean;
  badge?: boolean;
  ring?: boolean;
  walk?: boolean;
  kneel?: boolean;
  flip?: boolean;
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
  const uid = React.useId().replace(/:/g, "");

  const cyc = (frame % Math.round(fps * 3.4)) / fps;
  const blink = cyc > 3.15 && cyc < 3.32 ? 0.12 : 1;
  const breathe = Math.sin((frame / fps) * 2 * Math.PI * 0.42) * 2.6;
  const legSwing = walk ? Math.sin((frame / fps) * 2 * Math.PI * 2.1) * 16 : 0;

  const isEla = who === "ela";
  const skin = isEla ? C.elaSkin : C.eleSkin;
  const skinSh = isEla ? C.elaSkinShade : C.eleSkinShade;
  const skinLi = isEla ? C.elaSkinLight : C.eleSkinLight;
  const cheek = isEla ? C.elaCheek : C.eleCheek;
  const iris = isEla ? C.elaEye : C.eleEye;
  const brow = isEla ? C.elaBrow : C.eleBrow;
  const hair = isEla ? C.elaHair : C.eleHair;
  const hairLi = isEla ? C.elaHairLight : C.eleHairLight;
  const shirt = isEla ? C.elaShirt : C.eleShirt;
  const shirt2 = isEla ? C.elaShirt2 : C.eleShirt2;

  const [lhx, lhy] = HAND_L[leftArm];
  const [rhx, rhy] = HAND_R[rightArm];
  const Ls: [number, number] = [116, 300];
  const Rs: [number, number] = [204, 300];

  const arm = (s: [number, number], h: [number, number], key: string) => {
    const mx = (s[0] + h[0]) / 2 + (h[0] < 160 ? -16 : 16);
    const my = (s[1] + h[1]) / 2 + 10;
    return (
      <g key={key}>
        <path d={`M ${s[0]} ${s[1]} Q ${mx} ${my} ${h[0]} ${h[1]}`} stroke={`url(#${uid}-skin)`} strokeWidth={30} strokeLinecap="round" fill="none" />
        <circle cx={h[0]} cy={h[1]} r={16} fill={skin} />
        <circle cx={h[0] - 4} cy={h[1] - 4} r={6} fill={skinLi} opacity={0.5} />
      </g>
    );
  };

  const showBlush = blush || expression === "shy" || expression === "love";

  // ---- boca ----
  const mouth = () => {
    const my = 188;
    switch (expression) {
      case "shocked":
        return (
          <g>
            <ellipse cx={160} cy={my + 8} rx={15} ry={20} fill="#7a3b4a" />
            <ellipse cx={160} cy={my + 15} rx={9} ry={8} fill="#c65b6a" />
          </g>
        );
      case "sad":
        return <path d={`M 142 ${my + 8} Q 160 ${my - 6} 178 ${my + 8}`} stroke="#a84a5c" strokeWidth={6} fill="none" strokeLinecap="round" />;
      case "happy":
      case "love": {
        return (
          <g>
            <path d={`M 133 ${my - 2} Q 160 ${my + 6} 187 ${my - 2} Q 173 ${my + 34} 160 ${my + 34} Q 147 ${my + 34} 133 ${my - 2} Z`} fill="#8a3a4c" />
            <path d={`M 139 ${my} Q 160 ${my + 6} 181 ${my} Q 170 ${my + 7} 160 ${my + 7} Q 150 ${my + 7} 139 ${my} Z`} fill="#fff" />
            <ellipse cx={160} cy={my + 26} rx={9} ry={6} fill="#e3697e" />
          </g>
        );
      }
      case "neutral":
        return <path d={`M 148 ${my + 4} Q 160 ${my + 9} 172 ${my + 4}`} stroke="#a84a5c" strokeWidth={5} fill="none" strokeLinecap="round" />;
      default: // smile / shy
        return (
          <g>
            <path d={`M 138 ${my} Q 160 ${my + 22} 182 ${my}`} stroke="#9a4356" strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d={`M 146 ${my + 6} Q 160 ${my + 12} 174 ${my + 6}`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85} />
          </g>
        );
    }
  };

  // ---- olho ----
  const Eye: React.FC<{ cx: number }> = ({ cx }) => {
    const sad = expression === "sad";
    return (
      <g transform={`translate(${cx} 124) scale(1 ${blink})`}>
        <ellipse cx={0} cy={0} rx={18} ry={22} fill="#fff" />
        <ellipse cx={0} cy={2} rx={18} ry={22} fill={`url(#${uid}-sclera)`} />
        <ellipse cx={0} cy={3} rx={14} ry={18} fill={`url(#${uid}-iris)`} />
        <circle cx={0} cy={4} r={7.5} fill="#241a26" />
        <circle cx={-5} cy={-4} r={6} fill="#fff" />
        <circle cx={6} cy={8} r={3} fill="#fff" opacity={0.9} />
        {/* pálpebra superior */}
        <path d={`M -19 ${sad ? -4 : -10} Q 0 ${sad ? -14 : -20} 19 ${sad ? -4 : -10} L 19 -24 L -19 -24 Z`} fill={skin} />
        <path d={`M -19 ${sad ? -4 : -9} Q 0 ${sad ? -13 : -18} 19 ${sad ? -4 : -9}`} stroke={isEla ? "#6a4a3a" : "#3a2a20"} strokeWidth={isEla ? 3 : 2.5} fill="none" strokeLinecap="round" />
        {/* cílios da ela */}
        {isEla && (
          <g stroke="#3a2417" strokeWidth={2.5} strokeLinecap="round">
            <line x1={16} y1={-8} x2={23} y2={-13} />
            <line x1={10} y1={-13} x2={14} y2={-19} />
          </g>
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 320 480" style={{ overflow: "visible", ...style }} transform={flip ? "scale(-1 1)" : undefined}>
      <defs>
        <radialGradient id={`${uid}-skin`} cx="42%" cy="36%" r="70%">
          <stop offset="0%" stopColor={skinLi} />
          <stop offset="62%" stopColor={skin} />
          <stop offset="100%" stopColor={skinSh} />
        </radialGradient>
        <radialGradient id={`${uid}-sclera`} cx="50%" cy="35%" r="75%">
          <stop offset="60%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e7dced" />
        </radialGradient>
        <radialGradient id={`${uid}-iris`} cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor={hairLi} />
          <stop offset="55%" stopColor={iris} />
          <stop offset="100%" stopColor="#2a1c12" />
        </radialGradient>
        <linearGradient id={`${uid}-hair`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hairLi} />
          <stop offset="55%" stopColor={hair} />
          <stop offset="100%" stopColor={isEla ? C.elaHairDark : "#1a130d"} />
        </linearGradient>
        <linearGradient id={`${uid}-shirt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shirt} />
          <stop offset="100%" stopColor={shirt2} />
        </linearGradient>
      </defs>

      {/* sombra no chão */}
      <ellipse cx={160} cy={468} rx={92} ry={15} fill="rgba(80,60,90,0.16)" />

      <g transform={kneel ? "translate(0 36)" : undefined}>
        {/* ===== pernas ===== */}
        {kneel ? (
          <g>
            <rect x={132} y={372} width="30" height="70" rx="15" fill={isEla ? "#6f5bbd" : "#36414f"} />
            <path d="M 150 436 Q 150 470 198 470 L 200 452 Q 164 452 164 430 Z" fill={isEla ? "#6f5bbd" : "#36414f"} />
            <ellipse cx={196} cy={466} rx={22} ry={12} fill="#45413f" />
            <ellipse cx={150} cy={450} rx={20} ry={12} fill="#45413f" />
          </g>
        ) : (
          <g>
            <g transform={`translate(0 ${legSwing})`}>
              <rect x={132} y={372} width="24" height="68" rx="12" fill={isEla ? "#6f5bbd" : "#36414f"} />
              <ellipse cx={142} cy={446} rx={22} ry={13} fill="#45413f" />
              <ellipse cx={138} cy={442} rx={10} ry={5} fill="#5d5956" />
            </g>
            <g transform={`translate(0 ${-legSwing})`}>
              <rect x={164} y={372} width="24" height="68" rx="12" fill={isEla ? "#6f5bbd" : "#36414f"} />
              <ellipse cx={178} cy={446} rx={22} ry={13} fill="#45413f" />
              <ellipse cx={174} cy={442} rx={10} ry={5} fill="#5d5956" />
            </g>
          </g>
        )}

        {/* braço de trás */}
        {arm(Rs, [rhx, rhy], "armR")}

        {/* cabelo comprido de trás (ELA) — atrás do corpo */}
        {isEla && (
          <path
            d="M 66 150 Q 40 300 80 392 Q 108 404 120 388 Q 96 300 104 168 Z M 254 150 Q 280 300 240 392 Q 212 404 200 388 Q 224 300 216 168 Z"
            fill={`url(#${uid}-hair)`}
          />
        )}

        <g transform={`translate(0 ${breathe})`}>
          {/* ===== tronco ===== */}
          <path d="M 108 300 Q 160 280 212 300 L 222 388 Q 160 408 98 388 Z" fill={`url(#${uid}-shirt)`} />
          <path d="M 108 300 Q 160 318 212 300 L 210 320 Q 160 334 110 320 Z" fill={shirt2} opacity={0.6} />
          <path d="M 98 388 Q 130 400 160 400 L 160 300 Q 134 300 108 300 Z" fill="#000" opacity={0.05} />
          {isEla && <path d="M 150 300 Q 160 316 170 300 Z" fill={skinSh} opacity={0.4} />}

          {!isEla && helmet && (
            <g>
              <path d="M 112 302 L 128 300 L 132 392 L 108 388 Z" fill={C.eleVest} />
              <path d="M 208 302 L 192 300 L 188 392 L 212 388 Z" fill={C.eleVest} />
              <rect x={118} y={338} width="84" height="7" fill="#f2f2f2" opacity={0.85} />
            </g>
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
          {/* orelhas */}
          <circle cx={62} cy={150} r={15} fill={skin} />
          <circle cx={258} cy={150} r={15} fill={skin} />
          <circle cx={62} cy={150} r={7} fill={skinSh} opacity={0.5} />
          <circle cx={258} cy={150} r={7} fill={skinSh} opacity={0.5} />

          {/* rosto (oval) */}
          <path d="M 68 128 Q 68 42 160 42 Q 252 42 252 128 Q 252 196 206 232 Q 180 252 160 252 Q 140 252 114 232 Q 68 196 68 128 Z" fill={`url(#${uid}-skin)`} />
          {/* sombra lateral suave */}
          <path d="M 212 120 Q 222 190 172 236 Q 206 196 206 120 Z" fill={skinSh} opacity={0.22} />

          {/* ===== cabelo da frente ===== */}
          {isEla ? (
            <g>
              <path d="M 64 136 Q 52 44 160 40 Q 268 44 256 138 Q 250 104 224 92 Q 236 118 232 150 Q 208 100 160 96 Q 112 100 88 150 Q 84 118 96 92 Q 70 104 64 136 Z" fill={`url(#${uid}-hair)`} />
              {/* mechas laterais sobre o rosto */}
              <path d="M 64 136 Q 56 110 78 92 Q 70 150 96 212 Q 78 206 70 182 Q 60 158 64 136 Z" fill={`url(#${uid}-hair)`} />
              <path d="M 256 138 Q 264 110 242 92 Q 250 150 224 212 Q 242 206 250 182 Q 260 158 256 138 Z" fill={`url(#${uid}-hair)`} />
              {/* repartido + brilho */}
              <path d="M 160 42 Q 150 70 120 90" stroke={C.elaHairDark} strokeWidth={4} fill="none" opacity={0.5} />
              <path d="M 96 78 Q 128 58 160 60" stroke={hairLi} strokeWidth={5} fill="none" opacity={0.45} strokeLinecap="round" />
              <path d="M 224 92 Q 210 70 176 62" stroke={hairLi} strokeWidth={4} fill="none" opacity={0.4} strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <path d="M 66 134 Q 56 44 160 42 Q 264 44 254 134 Q 246 108 228 100 L 224 84 Q 206 96 196 92 L 190 78 Q 172 92 160 90 Q 148 92 130 78 L 124 92 Q 114 96 96 84 L 92 100 Q 74 108 66 134 Z" fill={`url(#${uid}-hair)`} />
              <path d="M 96 84 Q 130 66 160 68 Q 190 66 224 84" stroke={hairLi} strokeWidth={4} fill="none" opacity={0.4} strokeLinecap="round" />
              <path d="M 66 134 Q 62 108 74 96 L 80 140 Z" fill={C.eleHairLight} opacity={0.5} />
            </g>
          )}

          {/* ===== feições ===== */}
          {/* sobrancelhas */}
          <g fill={brow}>
            {(() => {
              const by = expression === "shocked" ? 92 : 98;
              const lift = expression === "sad" ? -5 : 0;
              const ang = expression === "sad" ? 7 : expression === "shocked" ? -5 : -2;
              const w = isEla ? 5 : 7;
              return (
                <>
                  <path d={`M 116 ${by + lift + ang + w} Q 128 ${by + lift - 2} 150 ${by + lift - ang} Q 132 ${by + lift + w - ang} 116 ${by + lift + ang + w} Z`} />
                  <path d={`M 204 ${by + lift + ang + w} Q 192 ${by + lift - 2} 170 ${by + lift - ang} Q 188 ${by + lift + w - ang} 204 ${by + lift + ang + w} Z`} />
                </>
              );
            })()}
          </g>

          <Eye cx={128} />
          <Eye cx={192} />

          {/* nariz */}
          <path d="M 157 150 Q 152 168 160 172 Q 168 168 163 150" fill="none" stroke={skinSh} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
          <ellipse cx={160} cy={172} rx={5} ry={3} fill={skinSh} opacity={0.6} />

          {mouth()}
          {isEla && expression !== "shocked" && (
            <path d="M 140 186 Q 160 193 180 186" stroke={C.elaLips} strokeWidth={3} fill="none" opacity={0.5} />
          )}

          {/* bochechas */}
          <ellipse cx={106} cy={176} rx={19} ry={12} fill={cheek} opacity={showBlush ? 0.8 : 0.42} />
          <ellipse cx={214} cy={176} rx={19} ry={12} fill={cheek} opacity={showBlush ? 0.8 : 0.42} />

          {/* ===== barba (ELE) ===== */}
          {!isEla && (
            <g>
              <path d="M 76 150 Q 80 214 118 240 Q 140 254 160 254 Q 180 254 202 240 Q 240 214 244 150 Q 238 182 214 196 Q 196 206 196 188 Q 176 200 160 200 Q 144 200 124 188 Q 124 206 106 196 Q 82 182 76 150 Z" fill={C.eleBeard} />
              {/* bigode */}
              <path d="M 136 182 Q 148 190 160 190 Q 172 190 184 182 Q 174 198 160 198 Q 146 198 136 182 Z" fill={C.eleBeard} />
              {/* textura */}
              <path d="M 96 176 Q 120 206 160 210 Q 200 206 224 176" stroke="#15100a" strokeWidth={2} fill="none" opacity={0.3} />
            </g>
          )}

          {/* capacete */}
          {helmet && (
            <g>
              <path d="M 56 126 Q 160 16 264 126 Q 264 138 250 138 L 70 138 Q 56 138 56 126 Z" fill="#ffcb3b" />
              <rect x={48} y={132} width="224" height="15" rx="7" fill="#f5b800" />
              <rect x={150} y={34} width="20" height="92" rx="10" fill="#f5b800" opacity={0.7} />
            </g>
          )}
        </g>

        {/* braço da frente */}
        {arm(Ls, [lhx, lhy], "armL")}

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
