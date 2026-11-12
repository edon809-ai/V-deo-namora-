# Nossa História 💛

Vídeo animado 2D (estilo chibi fofinho) feito com **Remotion (React)**, contando
a história do casal — da obra do Aeroporto de Porto Alegre ao pedido de namoro.

- Formato **vertical 1080×1920**, **30fps**, ~3 minutos.
- Personagens desenhados em **SVG dentro do código** (piscar, respirar, andar,
  pular de alegria, corações flutuando, balões de fala).
- **Narração** gerada com `edge-tts` (voz `pt-BR-FranciscaNeural`), um áudio por
  cena, com a duração de cada cena sincronizada ao áudio.
- **Música de fundo** suave gerada proceduralmente.

## Como gerar do zero

```bash
# 1. dependências JS
npm install

# 2. narração (precisa de acesso a speech.platform.bing.com)
python3 -m pip install edge-tts numpy
python3 scripts/gen_narration.py      # -> public/audio/*.mp3 + src/audioData.json

# 3. fontes (Google Fonts, baixadas localmente)
python3 scripts/fetch_fonts.py        # -> public/fonts/

# 4. música de fundo
python3 scripts/gen_music.py          # -> public/music.mp3

# 5. render final
npm run render                        # -> out/nossa-historia.mp4
```

Para pré-visualizar no estúdio: `npm run studio`.

## Estrutura

- `src/scenes/Scene1..13.tsx` — as 13 cenas da história.
- `src/components/Character.tsx` — os personagens chibi em SVG (ELA e ELE).
- `src/components/` — balões de fala, legenda, corações, fundos, etc.
- `src/timing.ts` — duração de cada cena, derivada do áudio da narração.
- `scripts/` — geração de narração, fontes e música.
