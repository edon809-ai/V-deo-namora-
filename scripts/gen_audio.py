#!/usr/bin/env python3
"""Gera narração (por cena) e as falas dos personagens a partir de src/script.json
usando edge-tts (pt-BR-FranciscaNeural). Ritmo acelerado. Salva durações em
src/audioData.json."""
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

with open(os.path.join(ROOT, "src", "script.json"), encoding="utf-8") as f:
    SCRIPT = json.load(f)

# ritmo da narração por cena (mais rápido que antes). Emotivas um pouco menos.
NARR_RATE = {2: "+6%", 7: "+2%", 12: "+8%", 13: "+4%"}
NARR_BASE = "+12%"
DIALOG_RATE = "+10%"  # falas dos personagens, levemente ágeis


def duration_of(path: str) -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "csv=p=0", path,
    ])
    return float(out.decode().strip())


async def synth(text: str, path: str, rate: str) -> float:
    kwargs = {"text": text, "voice": VOICE, "rate": rate}
    if PROXY:
        kwargs["proxy"] = PROXY
    last = None
    for _ in range(4):
        try:
            await edge_tts.Communicate(**kwargs).save(path)
            if os.path.getsize(path) > 0:
                return duration_of(path)
        except Exception as e:  # noqa: BLE001
            last = e
            await asyncio.sleep(2)
    raise RuntimeError(f"falhou {path}: {last}")


async def main():
    narr_dur = {}
    dlg_dur = {}

    for idx in sorted(SCRIPT["narration"], key=int):
        rate = NARR_RATE.get(int(idx), NARR_BASE)
        path = os.path.join(OUT_DIR, f"scene{idx}.mp3")
        narr_dur[idx] = round(await synth(SCRIPT["narration"][idx], path, rate), 3)
        print(f"narração cena {idx:>2}: {narr_dur[idx]:5.2f}s")

    for scene, lines in SCRIPT["dialog"].items():
        for ln in lines:
            path = os.path.join(OUT_DIR, f"{ln['id']}.mp3")
            dlg_dur[ln["id"]] = round(await synth(ln["say"], path, DIALOG_RATE), 3)
            print(f"  fala {ln['id']:>6} ({ln['who']}): {dlg_dur[ln['id']]:5.2f}s")

    with open(os.path.join(ROOT, "src", "audioData.json"), "w", encoding="utf-8") as f:
        json.dump({"narrationDur": narr_dur, "dialogDur": dlg_dur}, f,
                  ensure_ascii=False, indent=2)

    tot = sum(narr_dur.values()) + sum(dlg_dur.values())
    print(f"\nnarração: {sum(narr_dur.values()):.1f}s | falas: {sum(dlg_dur.values()):.1f}s | total voz: {tot:.1f}s")


if __name__ == "__main__":
    asyncio.run(main())
