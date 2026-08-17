export const CHUNK_SIZE = 40;
export const ITEMS_PER_CHUNK = 5;
export const RENDER_DISTANCE = 1; // chunks fully opaque within this chebyshev distance
export const CHUNK_FADE_MARGIN = 1; // extra chunks over which opacity fades to 0
export const MAX_VELOCITY = 3.2; // tune to taste — try values between 1.5–4
export const DEPTH_FADE_START = 30;
export const DEPTH_FADE_END = 60;

export const INVIS_THRESHOLD = 0.01;
export const KEYBOARD_SPEED = 0.18;
export const VELOCITY_LERP = 0.16;
export const VELOCITY_DECAY = 0.9;
export const OPACITY_LERP = 0.18;

// Passive mouse-parallax (no click/drag needed) — the camera eases toward
// an offset derived from cursor position within the canvas.
export const PARALLAX_STRENGTH = 4; // how far the camera drifts toward the cursor, in world units. try 2-8
export const PARALLAX_LERP = 0.05; // how quickly it eases toward the target — lower = smoother/laggier, try 0.03-0.1

export const INITIAL_CAMERA_Z = 30;
export const CAMERA_FOV = 60;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 200;

// Precomputed 3x3x3 neighborhood around the camera's current chunk.
export const CHUNK_OFFSETS: { dx: number; dy: number; dz: number }[] = [];
for (let dx = -1; dx <= 1; dx++) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dz = -1; dz <= 1; dz++) {
      CHUNK_OFFSETS.push({ dx, dy, dz });
    }
  }
}