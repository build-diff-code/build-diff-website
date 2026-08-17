import gsap from "gsap";
import * as THREE from "three";
<<<<<<< HEAD
import type { Product } from "~/src/data/products";

=======
import type { MediaItem } from "~/src/data/media";
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
import {
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_NEAR,
  CHUNK_FADE_MARGIN,
  CHUNK_OFFSETS,
  CHUNK_SIZE,
  DEPTH_FADE_END,
  DEPTH_FADE_START,
  INITIAL_CAMERA_Z,
  INVIS_THRESHOLD,
  ITEMS_PER_CHUNK,
  MAX_VELOCITY,
  OPACITY_LERP,
  PARALLAX_LERP,
  PARALLAX_STRENGTH,
  RENDER_DISTANCE,
  VELOCITY_DECAY,
  VELOCITY_LERP,
} from "./constants";
<<<<<<< HEAD

import {
  clamp,
  hashString,
  lerp,
  seededRandom,
} from "./utils";

type PlaneUserData = {
=======
import { clamp, hashString, lerp, seededRandom } from "./utils";

type PlaneUserData<T> = {
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
  cx: number;
  cy: number;
  cz: number;
  opacity: number;
<<<<<<< HEAD
  product: Product;
=======
  product: T;
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
};

type ChunkEntry = {
  group: THREE.Group;
<<<<<<< HEAD
  meshes: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial
  >[];
=======
  meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[];
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
};

export type Theme = "light" | "dark";

<<<<<<< HEAD
=======
// Same off-white / near-black pair used in index.css (--color-bg).
// Kept here as the single source of truth for the canvas background so it
// can't drift out of sync with the CSS variables.
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
const THEME_BACKGROUNDS: Record<Theme, number> = {
  light: 0xf5f5f5,
  dark: 0x0f0f0f,
};

const isTouchDevice = () =>
<<<<<<< HEAD
  typeof window !== "undefined" &&
  ("ontouchstart" in window ||
    navigator.maxTouchPoints > 0);

export class InfiniteScene {
  private canvas: HTMLCanvasElement;
  private products: Product[];
=======
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export class InfiniteScene<T extends MediaItem = MediaItem> {
  private canvas: HTMLCanvasElement;
  private products: T[];
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
  private onProductClick?: (slug: string) => void;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private raycaster = new THREE.Raycaster();

  private theme: Theme;

<<<<<<< HEAD
  private sharedGeometry =
    new THREE.PlaneGeometry(1, 1);

  private textureLoader =
    new THREE.TextureLoader();

  private textureCache =
    new Map<string, THREE.Texture>();

  private chunks =
    new Map<string, ChunkEntry>();
=======
  private sharedGeometry = new THREE.PlaneGeometry(1, 1);
  private textureLoader = new THREE.TextureLoader();
  private textureCache = new Map<string, THREE.Texture>();

  private chunks = new Map<string, ChunkEntry>();

  // tracks the last few product indices assigned across ALL chunks so the
  // same image can't reappear again until enough other products have been
  // used first — prevents the "same photo shows up right next to itself"
  // problem you get with a small image pool.
  private recentProductIndices: number[] = [];
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb

  private rafId = 0;
  private disposed = false;

<<<<<<< HEAD
  // Camera / input state

  private basePos =
    new THREE.Vector3(
      0,
      0,
      INITIAL_CAMERA_Z,
    );

  private velocity =
    new THREE.Vector3();

  private targetVel =
    new THREE.Vector3();

  private flying = false;
  private isDragging = false;

  private lastPointer = {
    x: 0,
    y: 0,
  };

  private pointerDown = {
    x: 0,
    y: 0,
    t: 0,
  };

  private activePointers =
    new Map<
      number,
      { x: number; y: number }
    >();

  private pinchStartDist = 0;
  private scrollAccum = 0;

  private keys =
    new Set<string>();

  // Passive mouse parallax

  private pointerNDC =
    new THREE.Vector2(0, 0);

  private parallaxOffset =
    new THREE.Vector2(0, 0);

  private lastChunk = {
    cx: Number.NaN,
    cy: Number.NaN,
    cz: Number.NaN,
  };

  private pendingChunk: {
    cx: number;
    cy: number;
    cz: number;
  } | null = null;

=======
  // camera / input state
  private basePos = new THREE.Vector3(0, 0, INITIAL_CAMERA_Z);
  private velocity = new THREE.Vector3();
  private targetVel = new THREE.Vector3();
  private flying = false;
  private isDragging = false;
  private lastPointer = { x: 0, y: 0 };
  private pointerDown = { x: 0, y: 0, t: 0 };
  private activePointers = new Map<number, { x: number; y: number }>();
  private pinchStartDist = 0;
  private scrollAccum = 0;
  private keys = new Set<string>();

  // Passive mouse-parallax: unlike isDragging/lastPointer above (which only
  // track the pointer while a button/touch is held), pointerNDC updates on
  // every mousemove regardless of press state. The camera eases toward an
  // offset derived from it each frame, giving a subtle "world drifts toward
  // the cursor" feel with zero input — no click or drag needed.
  //
  // IMPORTANT: this used to listen on `this.canvas` for both move and
  // leave. Because the navbar sits visually on top of the canvas (fixed,
  // full-viewport), the instant the cursor crossed onto any navbar control
  // the browser's hit-test target changed away from the canvas — which
  // fires a `pointerleave` on the canvas even though the mouse never
  // actually left the screen. That leave handler snapped pointerNDC back
  // to dead-center, which is exactly the "hovering the navbar shifts the
  // canvas" jump that was reported. Listening on `window` for move and on
  // `document` for leave means it only recenters when the pointer truly
  // exits the browser viewport, not just this one overlapping element.
  private pointerNDC = new THREE.Vector2(0, 0);
  private parallaxOffset = new THREE.Vector2(0, 0);

  private lastChunk = { cx: Number.NaN, cy: Number.NaN, cz: Number.NaN };
  private pendingChunk: { cx: number; cy: number; cz: number } | null = null;
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
  private lastChunkUpdate = 0;

  constructor(
    canvas: HTMLCanvasElement,
<<<<<<< HEAD
    products: Product[],
=======
    products: T[],
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
    onProductClick?: (slug: string) => void,
    initialTheme: Theme = "light",
  ) {
    this.canvas = canvas;
    this.products = products;
    this.onProductClick = onProductClick;
    this.theme = initialTheme;

<<<<<<< HEAD
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      isTouchDevice() ? 1.25 : 1.5,
    );

    this.renderer =
      new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference:
          "high-performance",
      });

    this.renderer.setPixelRatio(dpr);

    this.scene = new THREE.Scene();

    this.scene.background =
      new THREE.Color(
        THEME_BACKGROUNDS[
          this.theme
        ],
      );

    this.camera =
      new THREE.PerspectiveCamera(
        CAMERA_FOV,
        1,
        CAMERA_NEAR,
        CAMERA_FAR,
      );

    this.camera.position.copy(
      this.basePos,
    );

    this.resize();
    this.bindEvents();

    this.animate =
      this.animate.bind(this);

    this.rafId =
      requestAnimationFrame(
        this.animate,
      );
  }

  setTheme(theme: Theme) {
    if (theme === this.theme) {
      return;
    }

    this.theme = theme;

    const target =
      new THREE.Color(
        THEME_BACKGROUNDS[theme],
      );

    const current =
      (this.scene.background as THREE.Color) ??
      target.clone();
=======
    const dpr = Math.min(window.devicePixelRatio || 1, isTouchDevice() ? 1.25 : 1.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(dpr);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(THEME_BACKGROUNDS[this.theme]);

    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, CAMERA_NEAR, CAMERA_FAR);
    this.camera.position.copy(this.basePos);

    this.resize();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  // Called from React when the theme toggle flips. Animates the background
  // color smoothly instead of hard-cutting, so it matches a CSS transition
  // on the rest of the page rather than popping instantly against it.
  setTheme(theme: Theme) {
    if (theme === this.theme) return;
    this.theme = theme;

    const target = new THREE.Color(THEME_BACKGROUNDS[theme]);
    const current = (this.scene.background as THREE.Color) ?? target.clone();
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb

    gsap.to(current, {
      r: target.r,
      g: target.g,
      b: target.b,
      duration: 0.4,
      ease: "power1.inOut",
<<<<<<< HEAD

      onUpdate: () => {
        this.scene.background =
          current;
=======
      onUpdate: () => {
        this.scene.background = current;
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
      },
    });
  }

  private bindEvents() {
<<<<<<< HEAD
    this.canvas.style.touchAction =
      "none";

    this.canvas.style.cursor =
      "grab";

    window.addEventListener(
      "resize",
      this.resize,
    );

    this.canvas.addEventListener(
      "pointerdown",
      this.onPointerDown,
    );

    this.canvas.addEventListener(
      "pointermove",
      this.onPointerMove,
    );

    this.canvas.addEventListener(
      "pointerup",
      this.onPointerUp,
    );

    this.canvas.addEventListener(
      "pointercancel",
      this.onPointerUp,
    );

    window.addEventListener(
      "pointermove",
      this.onParallaxMove,
    );

    document.addEventListener(
      "pointerleave",
      this.onParallaxLeave,
    );

    this.canvas.addEventListener(
      "wheel",
      this.onWheel,
      { passive: false },
    );

    window.addEventListener(
      "keydown",
      this.onKeyDown,
    );

    window.addEventListener(
      "keyup",
      this.onKeyUp,
    );
  }

  private resize = () => {
    const {
      clientWidth,
      clientHeight,
    } =
      this.canvas.parentElement ??
      document.body;

    const width =
      clientWidth ||
      window.innerWidth;

    const height =
      clientHeight ||
      window.innerHeight;

    const aspect =
      width / height;

    this.camera.aspect =
      aspect;

    const REFERENCE_ASPECT =
      1.4;

    if (
      aspect <
      REFERENCE_ASPECT
    ) {
      const scale =
        REFERENCE_ASPECT /
        aspect;

      this.camera.fov =
        Math.min(
          CAMERA_FOV *
            Math.sqrt(scale),
          100,
        );
    } else {
      this.camera.fov =
        CAMERA_FOV;
    }

    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      width,
      height,
      false,
    );
  };

  private onPointerDown = (
    e: PointerEvent,
  ) => {
    this.canvas.setPointerCapture(
      e.pointerId,
    );

    this.activePointers.set(
      e.pointerId,
      {
        x: e.clientX,
        y: e.clientY,
      },
    );

    if (
      this.activePointers.size === 1
    ) {
      this.isDragging = true;

      this.lastPointer = {
        x: e.clientX,
        y: e.clientY,
      };

      this.pointerDown = {
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
      };

      this.canvas.style.cursor =
        "grabbing";
    } else if (
      this.activePointers.size === 2
    ) {
      this.isDragging = false;

      this.pinchStartDist =
        this.currentPinchDistance();
    }
  };

  private onPointerMove = (
    e: PointerEvent,
  ) => {
    if (
      !this.activePointers.has(
        e.pointerId,
      )
    ) {
      return;
    }

    this.activePointers.set(
      e.pointerId,
      {
        x: e.clientX,
        y: e.clientY,
      },
    );

    if (
      this.activePointers.size === 1 &&
      this.isDragging
    ) {
      const dx =
        e.clientX -
        this.lastPointer.x;

      const dy =
        e.clientY -
        this.lastPointer.y;

      this.targetVel.x -=
        dx * 0.025;

      this.targetVel.y +=
        dy * 0.025;

      this.lastPointer = {
        x: e.clientX,
        y: e.clientY,
      };
    } else if (
      this.activePointers.size === 2
    ) {
      const dist =
        this.currentPinchDistance();

      const delta =
        dist -
        this.pinchStartDist;

      this.targetVel.z -=
        delta * 0.02;

      this.pinchStartDist =
        dist;
    }
  };

  private onPointerUp = (
    e: PointerEvent,
  ) => {
    this.activePointers.delete(
      e.pointerId,
    );

    if (
      this.activePointers.size === 0
    ) {
      this.isDragging = false;

      this.canvas.style.cursor =
        "grab";

      const dist =
        Math.hypot(
          e.clientX -
            this.pointerDown.x,
          e.clientY -
            this.pointerDown.y,
        );

      const duration =
        performance.now() -
        this.pointerDown.t;

      if (
        dist < 6 &&
        duration < 300
      ) {
        this.handleClick(
          e.clientX,
          e.clientY,
        );
      }
    } else if (
      this.activePointers.size === 1
    ) {
      const [remaining] =
        this.activePointers.values();

      this.lastPointer = {
        ...remaining,
      };

=======
    this.canvas.style.touchAction = "none";
    this.canvas.style.cursor = "grab";

    window.addEventListener("resize", this.resize);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointercancel", this.onPointerUp);
    // Parallax tracking intentionally lives on window/document rather than
    // the canvas — see the comment above `pointerNDC` for why. It needs to
    // keep updating even while the cursor is over an overlapping element
    // like the navbar, and should only recenter when the pointer actually
    // leaves the browser viewport.
    window.addEventListener("pointermove", this.onParallaxMove);
    document.addEventListener("pointerleave", this.onParallaxLeave);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  private resize = () => {
    const { clientWidth, clientHeight } = this.canvas.parentElement ?? document.body;
    const width = clientWidth || window.innerWidth;
    const height = clientHeight || window.innerHeight;
    const aspect = width / height;

    this.camera.aspect = aspect;

    // Vertical FOV is fixed, so horizontal FOV shrinks with aspect on narrow
    // screens — that starves portrait/mobile viewports of horizontal coverage,
    // making images look oversized and sparsely spaced. Widening the FOV for
    // narrow aspects keeps horizontal coverage roughly consistent instead.
    const REFERENCE_ASPECT = 1.4; // roughly desktop 4:3-ish baseline
    if (aspect < REFERENCE_ASPECT) {
      const scale = REFERENCE_ASPECT / aspect;
      this.camera.fov = Math.min(CAMERA_FOV * Math.sqrt(scale), 100);
    } else {
      this.camera.fov = CAMERA_FOV;
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private onPointerDown = (e: PointerEvent) => {
    this.canvas.setPointerCapture(e.pointerId);
    this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this.activePointers.size === 1) {
      this.isDragging = true;
      this.lastPointer = { x: e.clientX, y: e.clientY };
      this.pointerDown = { x: e.clientX, y: e.clientY, t: performance.now() };
      this.canvas.style.cursor = "grabbing";
    } else if (this.activePointers.size === 2) {
      this.isDragging = false;
      this.pinchStartDist = this.currentPinchDistance();
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.activePointers.has(e.pointerId)) return;
    this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this.activePointers.size === 1 && this.isDragging) {
      const dx = e.clientX - this.lastPointer.x;
      const dy = e.clientY - this.lastPointer.y;
      this.targetVel.x -= dx * 0.025;
this.targetVel.y += dy * 0.025;

      this.lastPointer = { x: e.clientX, y: e.clientY };
    } else if (this.activePointers.size === 2) {
      const dist = this.currentPinchDistance();
      const delta = dist - this.pinchStartDist;
      this.targetVel.z -= delta * 0.02;
      this.pinchStartDist = dist;
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    this.activePointers.delete(e.pointerId);

    if (this.activePointers.size === 0) {
      this.isDragging = false;
      this.canvas.style.cursor = "grab";

      const dist = Math.hypot(e.clientX - this.pointerDown.x, e.clientY - this.pointerDown.y);
      const duration = performance.now() - this.pointerDown.t;
      if (dist < 6 && duration < 300) {
        this.handleClick(e.clientX, e.clientY);
      }
    } else if (this.activePointers.size === 1) {
      const [remaining] = this.activePointers.values();
      this.lastPointer = { ...remaining };
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
      this.isDragging = true;
    }
  };

<<<<<<< HEAD
  private onParallaxMove = (
    e: PointerEvent,
  ) => {
    const rect =
      this.canvas.getBoundingClientRect();

    this.pointerNDC.x =
      ((e.clientX - rect.left) /
        rect.width) *
        2 -
      1;

    this.pointerNDC.y =
      -(
        ((e.clientY - rect.top) /
          rect.height) *
          2 -
        1
      );
  };

  private onParallaxLeave = () => {
    this.pointerNDC.set(
      0,
      0,
    );
  };

  private currentPinchDistance() {
    const pts = [
      ...this.activePointers.values(),
    ];

    return Math.hypot(
      pts[0].x -
        pts[1].x,

      pts[0].y -
        pts[1].y,
    );
  }

  private onWheel = (
    e: WheelEvent,
  ) => {
    e.preventDefault();

    this.scrollAccum +=
      e.deltaY * 0.006;

    this.targetVel.z +=
      this.scrollAccum;

    this.scrollAccum *= 0.8;
  };

  private onKeyDown = (
    e: KeyboardEvent,
  ) => {
    this.keys.add(
      e.key.toLowerCase(),
    );
  };

  private onKeyUp = (
    e: KeyboardEvent,
  ) => {
    this.keys.delete(
      e.key.toLowerCase(),
    );
  };

  private handleClick(
    clientX: number,
    clientY: number,
  ) {
    if (!this.onProductClick) {
      return;
    }

    const rect =
      this.canvas.getBoundingClientRect();

    const ndc =
      new THREE.Vector2(
        ((clientX - rect.left) /
          rect.width) *
          2 -
          1,

        -(
          ((clientY - rect.top) /
            rect.height) *
            2 -
          1
        ),
      );

    this.raycaster.setFromCamera(
      ndc,
      this.camera,
    );

    const meshes:
      THREE.Mesh[] = [];

    for (
      const entry of
        this.chunks.values()
    ) {
      for (
        const mesh of entry.meshes
      ) {
        if (mesh.visible) {
          meshes.push(mesh);
        }
      }
    }

    const hits =
      this.raycaster.intersectObjects(
        meshes,
        false,
      );

    if (!hits.length) {
      return;
    }

    const mesh =
      hits[0]
        .object as THREE.Mesh<
        THREE.PlaneGeometry,
        THREE.MeshBasicMaterial
      >;

    const { product } =
      mesh.userData as PlaneUserData;

    this.flying = true;

    this.velocity.set(
      0,
      0,
      0,
    );

    this.targetVel.set(
      0,
      0,
      0,
    );
=======
  // Runs on every window pointer move regardless of button state or what
  // element is under the cursor — this is what drives the passive
  // parallax, separate from onPointerMove's drag logic. Deliberately not
  // scoped to the canvas (see the pointerNDC comment above).
  private onParallaxMove = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNDC.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  // Cursor left the browser viewport entirely (document-level pointerleave
  // only fires for that, not for moving onto an overlapping element) —
  // ease the parallax back to center instead of leaving it pinned wherever
  // the pointer last was.
  private onParallaxLeave = () => {
    this.pointerNDC.set(0, 0);
  };

  private currentPinchDistance() {
    const pts = [...this.activePointers.values()];
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.scrollAccum += e.deltaY * 0.006;
    this.targetVel.z += this.scrollAccum;
    this.scrollAccum *= 0.8;
  };

  private onKeyDown = (e: KeyboardEvent) => this.keys.add(e.key.toLowerCase());
  private onKeyUp = (e: KeyboardEvent) => this.keys.delete(e.key.toLowerCase());

  private handleClick(clientX: number, clientY: number) {
    // No handler means these items aren't meant to be clickable (e.g. the
    // "what we like" / jams canvas) — bail before raycasting or flying so
    // there's no zoom animation and nothing gets navigated.
    if (!this.onProductClick) return;

    const rect = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(ndc, this.camera);

    const meshes: THREE.Mesh[] = [];
    for (const entry of this.chunks.values()) {
      for (const mesh of entry.meshes) {
        if (mesh.visible) meshes.push(mesh);
      }
    }

    const hits = this.raycaster.intersectObjects(meshes, false);
    if (!hits.length) return;

    const mesh = hits[0].object as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    const { product } = mesh.userData as PlaneUserData<T>;

    this.flying = true;
    this.velocity.set(0, 0, 0);
    this.targetVel.set(0, 0, 0);
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb

    gsap.to(this.basePos, {
      x: mesh.position.x,
      y: mesh.position.y,
      z: mesh.position.z + 8,
<<<<<<< HEAD

      duration: 0.6,

      ease: "power2.inOut",

      onUpdate: () => {
        this.camera.position.copy(
          this.basePos,
        );
      },

      onComplete: () => {
        this.flying = false;

        this.onProductClick?.(
          product.slug,
        );
=======
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: () => this.camera.position.copy(this.basePos),
      onComplete: () => {
        this.flying = false;
        this.onProductClick?.(product.slug);
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
      },
    });
  }

<<<<<<< HEAD
  private getTexture(
    product: Product,
  ): THREE.Texture {
    const cached =
      this.textureCache.get(
        product.url,
      );

    if (cached) {
      return cached;
    }

    const tex =
      this.textureLoader.load(
        product.url,
      );

    tex.colorSpace =
      THREE.SRGBColorSpace;

    tex.minFilter =
      THREE.LinearMipmapLinearFilter;

    tex.magFilter =
      THREE.LinearFilter;

    tex.generateMipmaps =
      true;

    tex.anisotropy = 4;

    this.textureCache.set(
      product.url,
      tex,
    );

    return tex;
  }

  private pickProductIndex(
    seed: number,
    position: THREE.Vector3,
    pendingPlanes: {
      position: THREE.Vector3;
      product: Product;
    }[],
  ): number {
    const total =
      this.products.length;

    if (total === 0) {
      throw new Error(
        "InfiniteScene requires at least one product.",
      );
    }

    // The same product cannot appear
    // within this world-space distance.

    const MIN_SAME_PRODUCT_DISTANCE =
      35;

    const startIndex =
      Math.floor(
        seededRandom(seed) *
          1_000_000,
      ) % total;

    const candidates: number[] =
      [];

    for (
      let i = 0;
      i < total;
      i++
    ) {
      candidates.push(
        (startIndex + i) %
          total,
      );
    }

    for (
      const index of candidates
    ) {
      const product =
        this.products[index];

      let tooClose = false;

      // Check products already created
      // in other loaded chunks.

      for (
        const entry of
          this.chunks.values()
      ) {
        for (
          const mesh of entry.meshes
        ) {
          const data =
            mesh.userData as PlaneUserData;

          if (
            data.product.slug !==
            product.slug
          ) {
            continue;
          }

          const distance =
            mesh.position.distanceTo(
              position,
            );

          if (
            distance <
            MIN_SAME_PRODUCT_DISTANCE
          ) {
            tooClose = true;
            break;
          }
        }

        if (tooClose) {
          break;
        }
      }

      if (tooClose) {
        continue;
      }

      // Check products already generated
      // inside THIS chunk.

      for (
        const plane of
          pendingPlanes
      ) {
        if (
          plane.product.slug !==
          product.slug
        ) {
          continue;
        }

        const distance =
          plane.position.distanceTo(
            position,
          );

        if (
          distance <
          MIN_SAME_PRODUCT_DISTANCE
        ) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        return index;
      }
    }

    // If every product is too close,
    // use the seeded fallback.

    return candidates[0];
  }

  private generateChunkPlanes(
    cx: number,
    cy: number,
    cz: number,
  ) {
    const seed =
      hashString(
        `${cx},${cy},${cz}`,
      );

    const planes: {
      position: THREE.Vector3;
      size: number;
      product: Product;
    }[] = [];

    for (
      let i = 0;
      i < ITEMS_PER_CHUNK;
      i++
    ) {
      const s =
        seed + i * 1000;

      const r = (
        n: number,
      ) =>
        seededRandom(
          s + n,
        );

      const size =
        8 + r(4) * 6;

      const position =
        new THREE.Vector3(
          cx * CHUNK_SIZE +
            (r(0) - 0.5) *
              CHUNK_SIZE,

          cy * CHUNK_SIZE +
            (r(1) - 0.5) *
              CHUNK_SIZE,

          cz * CHUNK_SIZE +
            (r(2) - 0.5) *
              CHUNK_SIZE,
        );

      const productIndex =
        this.pickProductIndex(
          s + 5,
          position,
          planes,
        );

      planes.push({
        position,
        size,
        product:
          this.products[
            productIndex
          ],
      });
    }

    return planes;
  }

  private createChunk(
    cx: number,
    cy: number,
    cz: number,
  ) {
    const key =
      `${cx},${cy},${cz}`;

    if (
      this.chunks.has(key)
    ) {
      return;
    }

    const group =
      new THREE.Group();

    const meshes: THREE.Mesh<
      THREE.PlaneGeometry,
      THREE.MeshBasicMaterial
    >[] = [];

    for (
      const plane of
        this.generateChunkPlanes(
          cx,
          cy,
          cz,
        )
    ) {
      const material =
        new THREE.MeshBasicMaterial({
          map:
            this.getTexture(
              plane.product,
            ),

          transparent: true,

          opacity: 0,

          depthWrite: false,

          side:
            THREE.DoubleSide,
        });

      const mesh =
        new THREE.Mesh(
          this.sharedGeometry,
          material,
        );

      const aspect =
        plane.product.width /
          plane.product.height ||
        1;

      const w =
        aspect >= 1
          ? plane.size
          : plane.size * aspect;

      const h =
        aspect >= 1
          ? plane.size / aspect
          : plane.size;

      mesh.scale.set(
        w,
        h,
        1,
      );

      mesh.position.copy(
        plane.position,
      );

      mesh.visible = false;

      mesh.userData = {
        cx,
        cy,
        cz,
        opacity: 0,
        product:
          plane.product,
      } satisfies PlaneUserData;

      meshes.push(mesh);

=======
  private getTexture(product: T): THREE.Texture {
    const cached = this.textureCache.get(product.url);
    if (cached) return cached;
    const tex = this.textureLoader.load(product.url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = 4;
    this.textureCache.set(product.url, tex);
    return tex;
  }

  // Picks a product index for a plane, avoiding whatever's been used most
  // recently (across all chunks, not just this one) so a small image pool
  // doesn't repeat the same photo right next to itself.
  private pickProductIndex(seed: number): number {
    const total = this.products.length;
    // never block out more than half the pool, and always leave at least
    // one option — otherwise a tiny pool could dead-end the search below.
    const windowSize = Math.max(0, Math.min(total - 1, Math.floor(total / 2)));

    let idx = Math.floor(seededRandom(seed) * 1_000_000) % total;
    let attempts = 0;
    while (this.recentProductIndices.includes(idx) && attempts < total) {
      idx = (idx + 1) % total;
      attempts++;
    }

    this.recentProductIndices.push(idx);
    if (this.recentProductIndices.length > windowSize) {
      this.recentProductIndices.shift();
    }

    return idx;
  }

  private generateChunkPlanes(cx: number, cy: number, cz: number) {
    const seed = hashString(`${cx},${cy},${cz}`);
    const planes: { position: THREE.Vector3; size: number; product: T }[] = [];

    for (let i = 0; i < ITEMS_PER_CHUNK; i++) {
      const s = seed + i * 1000;
      const r = (n: number) => seededRandom(s + n);
      const size = 8 + r(4) * 6;
      const productIndex = this.pickProductIndex(s + 5);

      // NOTE: positions are chunk-centered — chunk (cx, cy, cz) spans
      // [cx*CHUNK_SIZE - CHUNK_SIZE/2, cx*CHUNK_SIZE + CHUNK_SIZE/2) on each
      // axis, rather than [cx*CHUNK_SIZE, (cx+1)*CHUNK_SIZE). Previously the
      // camera (which starts at the origin, dead center of chunk (0,0,0))
      // sat on the *edge* of the loaded content instead of its middle,
      // which is why the initial view looked lopsided (lots of empty space
      // on one side, everything crammed on the other).
      planes.push({
        position: new THREE.Vector3(
          cx * CHUNK_SIZE + (r(0) - 0.5) * CHUNK_SIZE,
          cy * CHUNK_SIZE + (r(1) - 0.5) * CHUNK_SIZE,
          cz * CHUNK_SIZE + (r(2) - 0.5) * CHUNK_SIZE,
        ),
        size,
        product: this.products[productIndex],
      });
    }
    return planes;
  }

  private createChunk(cx: number, cy: number, cz: number) {
    const key = `${cx},${cy},${cz}`;
    if (this.chunks.has(key)) return;

    const group = new THREE.Group();
    const meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];

    for (const plane of this.generateChunkPlanes(cx, cy, cz)) {
      const material = new THREE.MeshBasicMaterial({
        map: this.getTexture(plane.product),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(this.sharedGeometry, material);

      const aspect = plane.product.width / plane.product.height || 1;
      const w = aspect >= 1 ? plane.size : plane.size * aspect;
      const h = aspect >= 1 ? plane.size / aspect : plane.size;
      mesh.scale.set(w, h, 1);
      mesh.position.copy(plane.position);
      mesh.visible = false;
      mesh.userData = { cx, cy, cz, opacity: 0, product: plane.product } satisfies PlaneUserData<T>;

      meshes.push(mesh);
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
      group.add(mesh);
    }

    this.scene.add(group);
<<<<<<< HEAD

    this.chunks.set(key, {
      group,
      meshes,
    });
  }

  private removeChunk(
    key: string,
  ) {
    const entry =
      this.chunks.get(key);

    if (!entry) {
      return;
    }

    for (
      const mesh of entry.meshes
    ) {
      mesh.material.dispose();
    }

    this.scene.remove(
      entry.group,
    );

    this.chunks.delete(key);
  }

  private updateActiveChunks(
    cx: number,
    cy: number,
    cz: number,
  ) {
    const needed =
      new Set<string>();

    for (
      const o of CHUNK_OFFSETS
    ) {
      const key =
        `${cx + o.dx},${
          cy + o.dy
        },${cz + o.dz}`;

      needed.add(key);

      this.createChunk(
        cx + o.dx,
        cy + o.dy,
        cz + o.dz,
      );
    }

    for (
      const key of [
        ...this.chunks.keys(),
      ]
    ) {
      if (
        !needed.has(key)
      ) {
        this.removeChunk(key);
      }
    }
  }

  private updateFades(
    camCx: number,
    camCy: number,
    camCz: number,
  ) {
    const camZ =
      this.camera.position.z;

    for (
      const entry of
        this.chunks.values()
    ) {
      for (
        const mesh of entry.meshes
      ) {
        const data =
          mesh.userData as PlaneUserData;

        const dist =
          Math.max(
            Math.abs(
              data.cx -
                camCx,
            ),

            Math.abs(
              data.cy -
                camCy,
            ),

            Math.abs(
              data.cz -
                camCz,
            ),
          );

        const absDepth =
          Math.abs(
            mesh.position.z -
              camZ,
          );

        const gridFade =
          dist <=
          RENDER_DISTANCE
            ? 1
            : Math.max(
                0,
                1 -
                  (dist -
                    RENDER_DISTANCE) /
                    Math.max(
                      CHUNK_FADE_MARGIN,
                      0.0001,
                    ),
              );

        const depthFade =
          absDepth <=
          DEPTH_FADE_START
            ? 1
            : Math.max(
                0,
                1 -
                  (absDepth -
                    DEPTH_FADE_START) /
                    Math.max(
                      DEPTH_FADE_END -
                        DEPTH_FADE_START,
                      0.0001,
                    ),
              );

        const target =
          Math.min(
            gridFade,
            depthFade *
              depthFade,
          );

        data.opacity =
          target <
            INVIS_THRESHOLD &&
          data.opacity <
            INVIS_THRESHOLD
            ? 0
            : lerp(
                data.opacity,
                target,
                OPACITY_LERP,
              );

        const isFullyOpaque =
          data.opacity >
          0.99;

        mesh.material.opacity =
          isFullyOpaque
            ? 1
            : data.opacity;

        mesh.material.depthWrite =
          isFullyOpaque;

        mesh.visible =
          data.opacity >
          INVIS_THRESHOLD;
=======
    this.chunks.set(key, { group, meshes });
  }

  private removeChunk(key: string) {
    const entry = this.chunks.get(key);
    if (!entry) return;
    for (const mesh of entry.meshes) {
      mesh.material.dispose();
    }
    this.scene.remove(entry.group);
    this.chunks.delete(key);
  }

  private updateActiveChunks(cx: number, cy: number, cz: number) {
    const needed = new Set<string>();
    for (const o of CHUNK_OFFSETS) {
      needed.add(`${cx + o.dx},${cy + o.dy},${cz + o.dz}`);
      this.createChunk(cx + o.dx, cy + o.dy, cz + o.dz);
    }
    for (const key of [...this.chunks.keys()]) {
      if (!needed.has(key)) this.removeChunk(key);
    }
  }

  private updateFades(camCx: number, camCy: number, camCz: number) {
    const camZ = this.camera.position.z;

    for (const entry of this.chunks.values()) {
      for (const mesh of entry.meshes) {
        const data = mesh.userData as PlaneUserData<T>;

        const dist = Math.max(
          Math.abs(data.cx - camCx),
          Math.abs(data.cy - camCy),
          Math.abs(data.cz - camCz),
        );
        const absDepth = Math.abs(mesh.position.z - camZ);

        const gridFade =
          dist <= RENDER_DISTANCE
            ? 1
            : Math.max(0, 1 - (dist - RENDER_DISTANCE) / Math.max(CHUNK_FADE_MARGIN, 0.0001));

        const depthFade =
          absDepth <= DEPTH_FADE_START
            ? 1
            : Math.max(
                0,
                1 - (absDepth - DEPTH_FADE_START) / Math.max(DEPTH_FADE_END - DEPTH_FADE_START, 0.0001),
              );

        const target = Math.min(gridFade, depthFade * depthFade);
        data.opacity =
          target < INVIS_THRESHOLD && data.opacity < INVIS_THRESHOLD
            ? 0
            : lerp(data.opacity, target, OPACITY_LERP);

        const isFullyOpaque = data.opacity > 0.99;
        mesh.material.opacity = isFullyOpaque ? 1 : data.opacity;
        mesh.material.depthWrite = isFullyOpaque;
        mesh.visible = data.opacity > INVIS_THRESHOLD;
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
      }
    }
  }

  private animate() {
<<<<<<< HEAD
    if (this.disposed) {
      return;
    }

    this.rafId =
      requestAnimationFrame(
        this.animate,
      );

    const now =
      performance.now();
=======
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);
    const now = performance.now();
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb

    let kx = 0;
    let ky = 0;
    let kz = 0;
<<<<<<< HEAD

    if (
      this.keys.has("w") ||
      this.keys.has("arrowup")
    ) {
      ky += 1;
    }

    if (
      this.keys.has("s") ||
      this.keys.has("arrowdown")
    ) {
      ky -= 1;
    }

    if (
      this.keys.has("a") ||
      this.keys.has("arrowleft")
    ) {
      kx -= 1;
    }

    if (
      this.keys.has("d") ||
      this.keys.has("arrowright")
    ) {
      kx += 1;
    }

    if (
      this.keys.has("q")
    ) {
      kz += 1;
    }

    if (
      this.keys.has("e")
    ) {
      kz -= 1;
    }

    if (
      kx ||
      ky ||
      kz
    ) {
      this.targetVel.x +=
        kx * 0.6;

      this.targetVel.y +=
        ky * 0.6;

      this.targetVel.z +=
        kz * 0.6;
    }

    this.targetVel.x =
      clamp(
        this.targetVel.x,
        -MAX_VELOCITY,
        MAX_VELOCITY,
      );

    this.targetVel.y =
      clamp(
        this.targetVel.y,
        -MAX_VELOCITY,
        MAX_VELOCITY,
      );

    this.targetVel.z =
      clamp(
        this.targetVel.z,
        -MAX_VELOCITY,
        MAX_VELOCITY,
      );

    if (!this.flying) {
      this.velocity.x =
        lerp(
          this.velocity.x,
          this.targetVel.x,
          VELOCITY_LERP,
        );

      this.velocity.y =
        lerp(
          this.velocity.y,
          this.targetVel.y,
          VELOCITY_LERP,
        );

      this.velocity.z =
        lerp(
          this.velocity.z,
          this.targetVel.z,
          VELOCITY_LERP,
        );

      this.basePos.x +=
        this.velocity.x;

      this.basePos.y +=
        this.velocity.y;

      this.basePos.z +=
        this.velocity.z;

      this.targetVel.x *=
        VELOCITY_DECAY;

      this.targetVel.y *=
        VELOCITY_DECAY;

      this.targetVel.z *=
        VELOCITY_DECAY;
    }

    const parallaxTargetX =
      this.pointerNDC.x *
      PARALLAX_STRENGTH;

    const parallaxTargetY =
      this.pointerNDC.y *
      PARALLAX_STRENGTH;

    this.parallaxOffset.x =
      lerp(
        this.parallaxOffset.x,
        parallaxTargetX,
        PARALLAX_LERP,
      );

    this.parallaxOffset.y =
      lerp(
        this.parallaxOffset.y,
        parallaxTargetY,
        PARALLAX_LERP,
      );

    this.camera.position.x =
      this.basePos.x +
      this.parallaxOffset.x;

    this.camera.position.y =
      this.basePos.y +
      this.parallaxOffset.y;

    this.camera.position.z =
      this.basePos.z;

    const cx =
      Math.round(
        this.basePos.x /
          CHUNK_SIZE,
      );

    const cy =
      Math.round(
        this.basePos.y /
          CHUNK_SIZE,
      );

    const cz =
      Math.round(
        this.basePos.z /
          CHUNK_SIZE,
      );

    if (
      cx !==
        this.lastChunk.cx ||
      cy !==
        this.lastChunk.cy ||
      cz !==
        this.lastChunk.cz
    ) {
      this.pendingChunk = {
        cx,
        cy,
        cz,
      };

      this.lastChunk = {
        cx,
        cy,
        cz,
      };
    }

    const isZooming =
      Math.abs(
        this.velocity.z,
      ) > 0.05;

    const throttleMs =
      isZooming
        ? Math.abs(
            this.velocity.z,
          ) > 1
          ? 500
          : 400
        : 100;

    if (
      this.pendingChunk &&
      now -
        this.lastChunkUpdate >
        throttleMs
    ) {
      const {
        cx: ucx,
        cy: ucy,
        cz: ucz,
      } = this.pendingChunk;

      this.updateActiveChunks(
        ucx,
        ucy,
        ucz,
      );

      this.lastChunkUpdate =
        now;

      this.pendingChunk =
        null;
    }

    this.updateFades(
      cx,
      cy,
      cz,
    );

    this.renderer.render(
      this.scene,
      this.camera,
    );
=======
    if (this.keys.has("w") || this.keys.has("arrowup")) ky += 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) ky -= 1;
    if (this.keys.has("a") || this.keys.has("arrowleft")) kx -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) kx += 1;
    if (this.keys.has("q")) kz += 1;
    if (this.keys.has("e")) kz -= 1;
    if (kx || ky || kz) {
      this.targetVel.x += kx * 0.6;
      this.targetVel.y += ky * 0.6;
      this.targetVel.z += kz * 0.6;
    }

    this.targetVel.x = clamp(this.targetVel.x, -MAX_VELOCITY, MAX_VELOCITY);
    this.targetVel.y = clamp(this.targetVel.y, -MAX_VELOCITY, MAX_VELOCITY);
    this.targetVel.z = clamp(this.targetVel.z, -MAX_VELOCITY, MAX_VELOCITY);

    if (!this.flying) {
      this.velocity.x = lerp(this.velocity.x, this.targetVel.x, VELOCITY_LERP);
      this.velocity.y = lerp(this.velocity.y, this.targetVel.y, VELOCITY_LERP);
      this.velocity.z = lerp(this.velocity.z, this.targetVel.z, VELOCITY_LERP);

      this.basePos.x += this.velocity.x;
      this.basePos.y += this.velocity.y;
      this.basePos.z += this.velocity.z;

      this.targetVel.x *= VELOCITY_DECAY;
      this.targetVel.y *= VELOCITY_DECAY;
      this.targetVel.z *= VELOCITY_DECAY;
    }

    // Ease the parallax offset toward wherever the cursor currently is.
    // This runs every frame independent of `flying`/dragging state, so
    // moving the mouse alone (no click) gives a subtle camera drift on
    // top of whatever panning/flying is already happening.
    const parallaxTargetX = this.pointerNDC.x * PARALLAX_STRENGTH;
    const parallaxTargetY = this.pointerNDC.y * PARALLAX_STRENGTH;
    this.parallaxOffset.x = lerp(this.parallaxOffset.x, parallaxTargetX, PARALLAX_LERP);
    this.parallaxOffset.y = lerp(this.parallaxOffset.y, parallaxTargetY, PARALLAX_LERP);

    this.camera.position.x = this.basePos.x + this.parallaxOffset.x;
    this.camera.position.y = this.basePos.y + this.parallaxOffset.y;
    this.camera.position.z = this.basePos.z;

    // Use Math.round (nearest chunk) instead of Math.floor (chunk the
    // camera is inside of, corner-anchored). With chunk-centered content
    // (see generateChunkPlanes), rounding to the nearest chunk center keeps
    // the loaded neighborhood balanced around the camera at all times,
    // instead of snapping to whichever grid cell the camera happens to be
    // touching and loading lopsided content around that cell's corner.
    const cx = Math.round(this.basePos.x / CHUNK_SIZE);
    const cy = Math.round(this.basePos.y / CHUNK_SIZE);
    const cz = Math.round(this.basePos.z / CHUNK_SIZE);

    if (cx !== this.lastChunk.cx || cy !== this.lastChunk.cy || cz !== this.lastChunk.cz) {
      this.pendingChunk = { cx, cy, cz };
      this.lastChunk = { cx, cy, cz };
    }

    const isZooming = Math.abs(this.velocity.z) > 0.05;
    const throttleMs = isZooming ? (Math.abs(this.velocity.z) > 1 ? 500 : 400) : 100;

    if (this.pendingChunk && now - this.lastChunkUpdate > throttleMs) {
      const { cx: ucx, cy: ucy, cz: ucz } = this.pendingChunk;
      this.updateActiveChunks(ucx, ucy, ucz);
      this.lastChunkUpdate = now;
      this.pendingChunk = null;
    }

    this.updateFades(cx, cy, cz);
    this.renderer.render(this.scene, this.camera);
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
  }

  dispose() {
    this.disposed = true;
<<<<<<< HEAD

    cancelAnimationFrame(
      this.rafId,
    );

    window.removeEventListener(
      "resize",
      this.resize,
    );

    this.canvas.removeEventListener(
      "pointerdown",
      this.onPointerDown,
    );

    this.canvas.removeEventListener(
      "pointermove",
      this.onPointerMove,
    );

    this.canvas.removeEventListener(
      "pointerup",
      this.onPointerUp,
    );

    this.canvas.removeEventListener(
      "pointercancel",
      this.onPointerUp,
    );

    window.removeEventListener(
      "pointermove",
      this.onParallaxMove,
    );

    document.removeEventListener(
      "pointerleave",
      this.onParallaxLeave,
    );

    this.canvas.removeEventListener(
      "wheel",
      this.onWheel,
    );

    window.removeEventListener(
      "keydown",
      this.onKeyDown,
    );

    window.removeEventListener(
      "keyup",
      this.onKeyUp,
    );

    for (
      const key of [
        ...this.chunks.keys(),
      ]
    ) {
      this.removeChunk(
        key,
      );
    }

    for (
      const tex of
        this.textureCache.values()
    ) {
      tex.dispose();
    }

    this.sharedGeometry.dispose();

=======
    cancelAnimationFrame(this.rafId);

    window.removeEventListener("resize", this.resize);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
    window.removeEventListener("pointermove", this.onParallaxMove);
    document.removeEventListener("pointerleave", this.onParallaxLeave);
    this.canvas.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);

    for (const key of [...this.chunks.keys()]) this.removeChunk(key);
    for (const tex of this.textureCache.values()) tex.dispose();
    this.sharedGeometry.dispose();
>>>>>>> 178c59cc9fa5e37fd36f14ecf654e39b9e2f31bb
    this.renderer.dispose();
  }
}