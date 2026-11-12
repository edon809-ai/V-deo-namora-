#!/usr/bin/env python3
"""Gera uma música de fundo suave (pad + arpejo) e salva em public/music.mp3.
Progressão calma I-V-vi-IV em Fá maior, volume baixo, fade in/out."""
import os
import subprocess
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
DUR = 185.0  # segundos (>= duração do vídeo)

def note(n):  # midi -> hz
    return 440.0 * 2 ** ((n - 69) / 12)

# F3=53 ... acordes (triades) da progressão F - C - Dm - Bb
CHORDS = [
    [53, 57, 60],  # F  (F A C)
    [48, 52, 55],  # C  (C E G)
    [50, 53, 57],  # Dm (D F A)
    [46, 50, 53],  # Bb (Bb D F)
]
CHORD_LEN = 4.0  # s por acorde

t = np.arange(int(SR * DUR)) / SR
audio = np.zeros_like(t)

def soft(freq, t0, dur, amp, partials=(1, 2, 3), decays=(1, 0.4, 0.2)):
    idx = (t >= t0) & (t < t0 + dur)
    tt = t[idx] - t0
    env = np.minimum(tt / 0.6, 1.0) * np.exp(-tt / (dur * 0.9))  # ataque suave + release
    sig = np.zeros_like(tt)
    for p, d in zip(partials, decays):
        sig += d * np.sin(2 * np.pi * freq * p * tt)
    audio[idx] += amp * env * sig

def bell(freq, t0, amp):
    idx = (t >= t0) & (t < t0 + 1.6)
    tt = t[idx] - t0
    env = np.exp(-tt * 3.2)
    audio[idx] += amp * env * (np.sin(2 * np.pi * freq * tt) + 0.3 * np.sin(2 * np.pi * freq * 2 * tt))

n_ch = int(np.ceil(DUR / CHORD_LEN))
for i in range(n_ch):
    t0 = i * CHORD_LEN
    chord = CHORDS[i % len(CHORDS)]
    # pad: triade sustentada
    for m in chord:
        soft(note(m), t0, CHORD_LEN + 0.3, amp=0.10)
    # baixo suave uma oitava abaixo da fundamental
    soft(note(chord[0] - 12), t0, CHORD_LEN + 0.3, amp=0.12, partials=(1, 2), decays=(1, 0.2))
    # arpejo delicado em cima
    arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 12]
    for j, m in enumerate(arp):
        bell(note(m), t0 + j * (CHORD_LEN / 4), amp=0.07)

# tremolo leve e fade global
audio *= 1 + 0.05 * np.sin(2 * np.pi * 0.15 * t)
fade = int(SR * 3)
audio[:fade] *= np.linspace(0, 1, fade)
audio[-fade:] *= np.linspace(1, 0, fade)

# normaliza baixinho
audio = audio / (np.max(np.abs(audio)) + 1e-9) * 0.5
stereo = np.stack([audio, np.roll(audio, 400)], axis=1)  # leve estéreo
pcm = (stereo * 32767).astype(np.int16)

raw = os.path.join(ROOT, "public", "_music.raw")
pcm.tofile(raw)
subprocess.run([
    "ffmpeg", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", raw,
    "-c:a", "libmp3lame", "-b:a", "160k", os.path.join(ROOT, "public", "music.mp3"),
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
os.remove(raw)
print("music.mp3 gerado:", round(DUR, 1), "s")
