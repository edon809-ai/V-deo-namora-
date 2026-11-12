#!/usr/bin/env python3
"""Baixa os woff2 das fontes do Google (subsets latin + latin-ext) para
public/fonts e gera um fonts.json com as @font-face para o Remotion injetar."""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FDIR = os.path.join(ROOT, "public", "fonts")
os.makedirs(FDIR, exist_ok=True)
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/120.0 Safari/537.36")

FAMILIES = {
    "Fredoka": "Fredoka:wght@500;600;700",
    "Baloo 2": "Baloo+2:wght@500;600;700",
    "Nunito": "Nunito:wght@600;700;800",
}
WANT_SUBSETS = {"latin", "latin-ext"}


def curl(url: str) -> bytes:
    return subprocess.check_output(
        ["curl", "-sS", "--max-time", "30", "-A", UA, url])


faces = []
for family, q in FAMILIES.items():
    css = curl(f"https://fonts.googleapis.com/css2?family={q}&display=swap").decode()
    # cada bloco: /* subset */\n@font-face{...}
    blocks = re.split(r"/\*\s*([\w-]+)\s*\*/", css)
    # blocks = ['', subset, cssblock, subset, cssblock, ...]
    for i in range(1, len(blocks) - 1, 2):
        subset = blocks[i].strip()
        block = blocks[i + 1]
        if subset not in WANT_SUBSETS:
            continue
        weight_m = re.search(r"font-weight:\s*(\d+)", block)
        url_m = re.search(r"url\((https://[^)]+\.woff2)\)", block)
        if not (weight_m and url_m):
            continue
        weight = weight_m.group(1)
        url = url_m.group(1)
        fname = f"{family.replace(' ', '')}-{weight}-{subset}.woff2"
        data = curl(url)
        with open(os.path.join(FDIR, fname), "wb") as f:
            f.write(data)
        faces.append({"family": family, "weight": int(weight), "file": fname})
        print(f"{family} {weight} {subset:9s} -> {fname} ({len(data)} B)")

with open(os.path.join(FDIR, "fonts.json"), "w") as f:
    json.dump(faces, f, ensure_ascii=False, indent=2)
print(f"\n{len(faces)} font-faces salvos")
