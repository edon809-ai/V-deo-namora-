#!/usr/bin/env python3
"""Gera a narração de cada cena com edge-tts (voz pt-BR-FranciscaNeural)
e grava as durações em src/audioData.json para o Remotion sincronizar."""
import asyncio
import json
import os
import subprocess
import edge_tts

PROXY = os.environ.get("HTTPS_PROXY")
VOICE = "pt-BR-FranciscaNeural"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "audio")
os.makedirs(OUT_DIR, exist_ok=True)

# Narração de cada cena. A chave é o índice da cena (1..13).
NARRATION = {
    1: "Toda história de amor tem um começo. Mas a nossa começou de um jeito que ninguém imaginaria.",
    2: "Em 2024, o Rio Grande do Sul enfrentou uma das maiores tragédias da sua história. O Aeroporto de Porto Alegre precisava ser reconstruído.",
    3: "Ele, um paulista da construção civil. Ela, uma gaúcha que encontrou ali uma nova oportunidade. Enquanto tanta coisa era reconstruída, algo novo começava a ser construído: a nossa história.",
    4: "Todo dia, uma mensagem. Até que ela resolveu dar uma chance.",
    5: "Ele não sabia quem era Mufasa, mas estava começando a conhecer alguém muito especial.",
    6: "Vieram a praia, Gramado, viagens e risadas. Sem pressa, fomos nos aproximando.",
    7: "A obra terminou, e veio a distância.",
    8: "Mas a vida tinha outros planos. Ela foi promovida... e ia para São Paulo!",
    9: "E a insistência do começo voltou com tudo.",
    10: "Desde então, quase não houve um dia sem se ver. Foram se conhecendo de verdade.",
    11: "Até que ele deu um passo a mais.",
    12: "Hoje são quase dois anos de história, um de namoro. E tudo começou com um simples, oi, tudo bem? E uma pergunta inesquecível: quem é Mufasa?",
    13: "Essa não é uma história que chegou ao fim. É só o começo.",
}

# Ajuste fino de ritmo/entonação por cena (rate/pitch).
RATE = {2: "-8%", 7: "-10%", 12: "-6%", 13: "-8%"}


def duration_of(path: str) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "csv=p=0", path,
    ])
    return float(out.decode().strip())


async def synth(idx: int, text: str) -> float:
    path = os.path.join(OUT_DIR, f"scene{idx}.mp3")
    kwargs = {"text": text, "voice": VOICE, "rate": RATE.get(idx, "-4%")}
    if PROXY:
        kwargs["proxy"] = PROXY
    # algumas tentativas, pois o DRM pode falhar esporadicamente
    last = None
    for attempt in range(4):
        try:
            comm = edge_tts.Communicate(**kwargs)
            await comm.save(path)
            if os.path.getsize(path) > 0:
                return duration_of(path)
        except Exception as e:  # noqa: BLE001
            last = e
            await asyncio.sleep(2)
    raise RuntimeError(f"cena {idx} falhou: {last}")


async def main():
    durations = {}
    for idx in sorted(NARRATION):
        d = await synth(idx, NARRATION[idx])
        durations[idx] = round(d, 3)
        print(f"cena {idx:2d}: {d:6.2f}s  -> scene{idx}.mp3")
    with open(os.path.join(ROOT, "src", "audioData.json"), "w") as f:
        json.dump({"durations": durations, "narration": NARRATION}, f,
                  ensure_ascii=False, indent=2)
    print("total narração:", round(sum(durations.values()), 1), "s")


if __name__ == "__main__":
    asyncio.run(main())
