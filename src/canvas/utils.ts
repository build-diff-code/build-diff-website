export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Deterministic string -> number hash (djb2 variant).
export const hashString = (str: string): number => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
};

// Deterministic pseudo-random in [0, 1) from an integer seed.
// Uses a mulberry32-style mix instead of Math.sin(seed) — the sine-based
// approach correlates for nearby/sequential seeds (e.g. seed, seed+1000,
// seed+2000...), which caused the same product to get picked repeatedly
// in nearby chunks. This gives a much more uniform spread.
export const seededRandom = (seed: number): number => {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};