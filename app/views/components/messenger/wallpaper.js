// Telegram-like chat wallpaper.
//   pattern — SVG doodle tiled at a fixed CSS size + CSS color/light (instant)
//   neon    — soft blurry aurora blobs under a solid base color
//   image   — bundled photo/texture
//   custom  — user-uploaded (server gallery), with blur + dim

function patternNumber(path) {
  const m = String(path).match(/pattern-(\d+)\.svg$/i);
  return m ? Number(m[1]) : 0;
}

const SVG_MODULES = import.meta.glob(
  '../../../assets/image/messenger/bg/pattern/svg/pattern-*.svg',
  { eager: true, import: 'default' },
);

const SVG_PATTERNS = Object.entries(SVG_MODULES)
  .map(([key, url]) => {
    const n = patternNumber(key);
    return { id: `pattern-${n}`, n, url };
  })
  .sort((a, b) => a.n - b.n);

export const PATTERNS = [
  { id: 'none', n: 0, url: '' },
  ...SVG_PATTERNS,
];

const PATTERN_BY_ID = Object.fromEntries(PATTERNS.map((p) => [p.id, p]));

function tileSizeFromName(name) {
  const m = String(name).match(/(\d{2,4})x\d{2,4}/);
  if (m) {
    const w = Number(m[1]);
    if (w >= 600) return 320;
    if (w >= 300) return 240;
    return 160;
  }
  return 220;
}

const PNG_MODULES = import.meta.glob(
  '../../../assets/image/messenger/bg/pattern/png/*.png',
  { eager: true, import: 'default' },
);
const PHOTO_MODULES = import.meta.glob(
  '../../../assets/image/messenger/bg/photographs/png/*.{png,jpg,jpeg}',
  { eager: true, import: 'default' },
);

function basename(path) {
  return String(path).split('/').pop() || String(path);
}

/** Tiling PNG textures — Patterns tab only (not Gallery / Images). */
export const PATTERN_IMAGES = Object.entries(PNG_MODULES).map(([key, url]) => {
  const id = basename(key).replace(/\.png$/i, '');
  return { id, url, tile: 96, tiling: true };
});

function widthFromName(name) {
  const m = String(name).match(/(\d{2,4})x\d{2,4}/);
  return m ? Number(m[1]) : 0;
}

const PHOTO_IMAGES = Object.entries(PHOTO_MODULES)
  .filter(([key]) => widthFromName(basename(key)) >= 400)
  .map(([key, url]) => {
    const id = basename(key).replace(/\.(png|jpe?g)$/i, '');
    return { id, url, tile: tileSizeFromName(id) };
  });

/** Gallery / Images tab — photographs only (no tiling pattern PNGs). */
export const IMAGES = [...PHOTO_IMAGES]
  .sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));

const ALL_IMAGES = [...PATTERN_IMAGES, ...IMAGES];
const IMAGE_BY_ID = Object.fromEntries(ALL_IMAGES.map((p) => [p.id, p]));

export function isTilingWallpaperImage(imageId) {
  return !!(IMAGE_BY_ID[imageId]?.tiling);
}

export const COLORS = [
  '#e6ddc9', '#f0e2c8', '#f6e7d4', '#ead7c3', '#d9e2ec', '#cfe3d4',
  '#c5daf0', '#ddd0f0', '#efd0dc', '#f3c9c9', '#c8ddd8', '#d4e8f5',
  '#e4d8f5', '#f5d8e4', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b',
  '#475569', '#334155', '#1e293b', '#0f172a', '#0e1621',
];

/** Highlight / sun colors (paired with base in the pattern picker). */
export const GLOW_COLORS = [
  '#fff4c8', '#ffe7a8', '#ffd6c4', '#ffc1d6', '#e8c8ff', '#c8d8ff',
  '#b8ecff', '#c4f5d8', '#e4f7b8', '#ffffff', '#fde68a', '#f9a8d4',
  '#c4b5fd', '#7dd3fc', '#6ee7b7', '#3390ec',
];

/** Quick neon base + glow pairs (empty-chat aurora look). */
export const NEON_PRESETS = [
  { id: 'ocean', color: '#0b1219', glow: '#3390ec' },
  { id: 'sky', color: '#0a1628', glow: '#38bdf8' },
  { id: 'violet', color: '#12081c', glow: '#a78bfa' },
  { id: 'mint', color: '#071412', glow: '#2dd4bf' },
  { id: 'rose', color: '#14080e', glow: '#fb7185' },
  { id: 'amber', color: '#120e06', glow: '#fbbf24' },
  { id: 'lime', color: '#0a1208', glow: '#a3e635' },
  { id: 'indigo', color: '#0a0e1c', glow: '#818cf8' },
];

/**
 * Lighting recipes under the doodle (CSS only — paints instantly).
 * Matches Telegram color-wallpaper: sun wash, linear sky, diagonal, corner, blobs.
 */
export const LIGHT_STYLES = [
  { id: 'sun', rotate: true },
  { id: 'vertical', rotate: true },
  { id: 'diagonal', rotate: true },
  { id: 'corner', rotate: true },
  { id: 'blobs', rotate: true },
  { id: 'solid', rotate: false },
];

const LIGHT_IDS = new Set(LIGHT_STYLES.map((s) => s.id));

const FIRST_PATTERN = SVG_PATTERNS[0]?.id || 'none';
const FIRST_IMAGE = IMAGES[0]?.id || PATTERN_IMAGES[0]?.id || '';

/**
 * Artboards are 1125×2436 (iPhone 3x ≈ 375 CSS px). Tile at a fixed CSS size
 * so doodles stay the same on mobile and desktop — larger screens reveal more
 * tiles instead of stretching icons. Slightly under 375 so shapes read denser.
 */
const PATTERN_ASPECT = 2436 / 1125;
const PATTERN_TILE_W = 268;
const PATTERN_TILE_H = Math.round(PATTERN_TILE_W * PATTERN_ASPECT);

export const DEFAULT_WALLPAPER = {
  type: 'pattern',
  pattern: FIRST_PATTERN,
  image: FIRST_IMAGE,
  color: '#e6ddc9',
  glow: '#fff1c2',
  light: 'sun',
  rotation: 0,
  intensity: 22,
  scale: 88,
  blur: 0,
  dim: 0,
  url: '',
  wallpaper_id: null,
};

const DEFAULT_NEON = {
  type: 'neon',
  color: '#0b1219',
  glow: '#3390ec',
  light: 'blobs',
  rotation: 0,
  intensity: 58,
  scale: 110,
  blur: 48,
  pattern: 'none',
  image: FIRST_IMAGE,
  dim: 0,
  url: '',
  wallpaper_id: null,
};

const LS_KEY = 'messenger_wallpaper';

function hexToRgb(hex) {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return { r: 240, g: 240, b: 240 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex({ r, g, b }) {
  const h = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

function mixHex(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const k = Math.max(0, Math.min(1, Number(t) || 0));
  return rgbToHex({
    r: Math.round(A.r + (B.r - A.r) * k),
    g: Math.round(A.g + (B.g - A.g) * k),
    b: Math.round(A.b + (B.b - A.b) * k),
  });
}

function sanitizeHex(hex, fallback) {
  const s = String(hex || '').trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s)) return s.length === 4
    ? `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`
    : s;
  return fallback;
}

export function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function patternUrl(id) {
  return PATTERN_BY_ID[id]?.url || '';
}

export function resolvePatternUrl(id) {
  return patternUrl(id);
}

function patternAlpha(intensity) {
  return Math.max(0, Math.min(0.42, ((Number(intensity) || 0) / 100) * 0.42));
}

function patternMaskSize(scalePct) {
  const s = Math.max(30, Math.min(200, Number(scalePct) || 88)) / 100;
  const w = Math.round(PATTERN_TILE_W * s);
  const h = Math.round(PATTERN_TILE_H * s);
  return `${w}px ${h}px`;
}

function wrapDeg(n) {
  const d = Number(n) || 0;
  return ((d % 360) + 360) % 360;
}

/** Place the sun along an upper arc (0° = top center, 90° = right). */
function sunAnchor(rotation) {
  const deg = wrapDeg(rotation);
  const rad = ((deg - 90) * Math.PI) / 180;
  const x = 50 + Math.cos(rad) * 46;
  const y = 4 + (Math.sin(rad) + 1) * 10;
  return `${x.toFixed(1)}% ${Math.max(-8, y).toFixed(1)}%`;
}

function patternLightImage(c) {
  const base = c.color;
  const glow = c.glow;
  const rot = wrapDeg(c.rotation);
  const mid = mixHex(glow, base, 0.42);
  const wash = mixHex(glow, base, 0.62);

  switch (c.light) {
    case 'solid':
      return 'none';
    case 'vertical': {
      const angle = 180 + rot;
      return `linear-gradient(${angle}deg, ${glow} 0%, ${mid} 34%, ${base} 72%)`;
    }
    case 'diagonal': {
      const angle = 135 + rot;
      return `linear-gradient(${angle}deg, ${glow} 0%, ${mid} 40%, ${base} 78%)`;
    }
    case 'corner': {
      const pos = sunAnchor(rot + 45);
      return [
        `radial-gradient(ellipse 95% 72% at ${pos}, ${glow} 0%, ${mid} 28%, transparent 62%)`,
        `linear-gradient(180deg, ${wash} 0%, ${base} 58%)`,
      ].join(', ');
    }
    case 'blobs': {
      const shift = rot / 360;
      const p1 = `${(12 + shift * 70).toFixed(1)}% ${(10 + shift * 18).toFixed(1)}%`;
      const p2 = `${(88 - shift * 40).toFixed(1)}% ${(82 - shift * 20).toFixed(1)}%`;
      const p3 = `${(74 - shift * 20).toFixed(1)}% ${(22 + shift * 30).toFixed(1)}%`;
      const p4 = `${(28 + shift * 24).toFixed(1)}% ${(68 - shift * 16).toFixed(1)}%`;
      const c3 = mixHex(glow, base, 0.22);
      const c4 = mixHex(base, glow, 0.35);
      return [
        `radial-gradient(ellipse 72% 56% at ${p1}, ${glow} 0%, transparent 58%)`,
        `radial-gradient(ellipse 64% 52% at ${p2}, ${c3} 0%, transparent 56%)`,
        `radial-gradient(ellipse 50% 44% at ${p3}, ${mid} 0%, transparent 52%)`,
        `radial-gradient(ellipse 46% 40% at ${p4}, ${c4} 0%, transparent 50%)`,
      ].join(', ');
    }
    case 'sun':
    default: {
      const pos = sunAnchor(rot);
      return [
        `radial-gradient(ellipse 130% 78% at ${pos}, ${glow} 0%, ${mid} 32%, transparent 64%)`,
        `linear-gradient(180deg, ${wash} 0%, ${base} 54%)`,
      ].join(', ');
    }
  }
}

export function resolveWallpaperImageUrl(cfg) {
  const c = normalizeWallpaper(cfg);
  if (c.type === 'custom' && c.url) return c.url;
  if (c.type === 'image') {
    const img = IMAGE_BY_ID[c.image];
    return img?.url || '';
  }
  return '';
}

/** Normalize / migrate a wallpaper config object. */
export function normalizeWallpaper(cfg) {
  const raw = cfg || {};
  const c = { ...DEFAULT_WALLPAPER, ...raw };
  if (LEGACY_PATTERNS[c.pattern]) c.pattern = LEGACY_PATTERNS[c.pattern];
  if (c.pattern !== 'none' && !PATTERN_BY_ID[c.pattern]) c.pattern = FIRST_PATTERN;
  if (c.image && !IMAGE_BY_ID[c.image] && c.type === 'image' && !c.url) c.image = FIRST_IMAGE;

  const type = String(c.type || 'pattern');
  if (type === 'custom' && c.url) {
    c.type = 'custom';
  } else if (type === 'image') {
    c.type = 'image';
  } else if (type === 'neon') {
    c.type = 'neon';
  } else {
    c.type = 'pattern';
  }

  c.color = sanitizeHex(c.color, c.type === 'neon' ? DEFAULT_NEON.color : DEFAULT_WALLPAPER.color);
  c.glow = sanitizeHex(c.glow, c.type === 'neon' ? DEFAULT_NEON.glow : DEFAULT_WALLPAPER.glow);
  c.light = LIGHT_IDS.has(c.light) ? c.light : (c.type === 'neon' ? 'blobs' : 'sun');
  // Old pattern configs stored unused neon-blue glow — swap to a warm sun.
  if (
    c.type === 'pattern'
    && (raw.light == null || !LIGHT_IDS.has(raw.light))
    && String(raw.glow || '').toLowerCase() === '#3390ec'
  ) {
    c.glow = DEFAULT_WALLPAPER.glow;
  }
  c.rotation = wrapDeg(c.rotation);
  c.intensity = Math.max(0, Math.min(100, Number(c.intensity) || 0));
  c.scale = Math.max(30, Math.min(200, Number(c.scale) || 88));
  c.dim = Math.max(0, Math.min(80, Number(c.dim) || 0));

  if (c.type === 'neon') {
    c.blur = Math.max(0, Math.min(80, Number(c.blur) || 48));
  } else {
    c.blur = Math.max(0, Math.min(40, Number(c.blur) || 0));
  }

  if (c.wallpaper_id != null && c.wallpaper_id !== '') {
    c.wallpaper_id = Number(c.wallpaper_id) || null;
  } else {
    c.wallpaper_id = null;
  }
  c.url = c.url ? String(c.url) : '';
  return c;
}

/** Defaults when switching into neon mode. */
export function neonWallpaperDefaults(partial = {}) {
  return normalizeWallpaper({ ...DEFAULT_NEON, ...partial, type: 'neon' });
}

export function nextWallpaperRotation(rotation) {
  return wrapDeg((Number(rotation) || 0) + 45);
}

/** True when the config still uses a local blob preview (not uploaded yet). */
export function isLocalWallpaperPreview(cfg) {
  const url = String(cfg?.url || '');
  return !!url && (url.startsWith('blob:') || url.startsWith('data:'));
}

/** Payload safe to send to the API (never sends blob:/data: previews). */
export function wallpaperToApi(cfg) {
  const c = normalizeWallpaper(cfg);
  const out = {
    type: c.type,
    pattern: c.pattern,
    image: c.image,
    color: c.color,
    glow: c.glow,
    light: c.light,
    rotation: c.rotation,
    intensity: c.intensity,
    scale: c.scale,
    blur: c.blur,
    dim: c.dim,
  };
  if (c.type === 'custom') {
    if (c.url && !isLocalWallpaperPreview(c)) out.url = c.url;
    if (c.wallpaper_id) out.wallpaper_id = c.wallpaper_id;
  }
  return out;
}

export function buildWallpaperStyle(cfg) {
  const c = normalizeWallpaper(cfg);
  if ((c.type === 'image' || c.type === 'custom') && resolveWallpaperImageUrl(c)) {
    return {
      backgroundColor: c.color || '#0e1621',
      backgroundImage: 'none',
    };
  }
  if (c.type === 'neon') {
    return { backgroundColor: c.color, backgroundImage: 'none' };
  }
  const image = patternLightImage(c);
  return {
    backgroundColor: c.color,
    backgroundImage: image === 'none' ? 'none' : image,
  };
}

/** Mini preview of a lighting recipe (picker chips). */
export function buildLightSwatchStyle(styleId, color, glow) {
  const c = normalizeWallpaper({
    type: 'pattern',
    pattern: 'none',
    color,
    glow,
    light: styleId,
    rotation: 0,
  });
  return {
    ...buildWallpaperStyle(c),
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundOrigin: 'border-box',
    backgroundClip: 'border-box',
  };
}

/** Image layer (supports CSS blur). Scale up slightly so blur edges don't show. */
export function buildWallpaperImageStyle(cfg) {
  const c = normalizeWallpaper(cfg);
  const url = resolveWallpaperImageUrl(c);
  if (!url) return { display: 'none' };
  const meta = c.type === 'image' ? IMAGE_BY_ID[c.image] : null;
  const tiling = !!(meta && meta.tiling);
  const blur = tiling ? 0 : (c.blur || 0);
  const scale = !tiling && blur > 0 ? 1 + Math.min(0.18, blur / 120) : 1;
  const tile = meta?.tile || 280;
  return {
    position: 'absolute',
    inset: blur > 0 ? `-${Math.ceil(blur * 1.2)}px` : '0',
    pointerEvents: 'none',
    backgroundImage: `url("${url}")`,
    backgroundSize: tiling ? `${tile}px` : 'cover',
    backgroundRepeat: tiling ? 'repeat' : 'no-repeat',
    backgroundPosition: tiling ? '0 0' : 'center',
    filter: blur > 0 ? `blur(${blur}px)` : 'none',
    transform: scale !== 1 ? `scale(${scale})` : undefined,
  };
}

/** Darken overlay for photos (Telegram intensity). */
export function buildWallpaperDimStyle(cfg) {
  const c = normalizeWallpaper(cfg);
  const dim = (c.type === 'pattern' || c.type === 'neon') ? 0 : (c.dim || 0);
  if (dim <= 0) return { display: 'none' };
  return {
    position: 'absolute',
    inset: '0',
    pointerEvents: 'none',
    backgroundColor: `rgba(0, 0, 0, ${Math.min(0.8, dim / 100)})`,
  };
}

export function buildWallpaperPatternStyle(cfg) {
  const c = normalizeWallpaper(cfg);
  const url = c.type === 'pattern' ? patternUrl(c.pattern) : '';
  const alpha = patternAlpha(c.intensity);
  if (!url || alpha <= 0.001) return { display: 'none' };
  const tint = luminance(c.color) > 0.52 ? 'rgba(48, 58, 72, 0.95)' : 'rgba(255, 255, 255, 0.92)';
  const maskUrl = `url("${url}")`;
  const maskSize = patternMaskSize(c.scale);
  return {
    position: 'absolute',
    inset: '0',
    pointerEvents: 'none',
    opacity: String(alpha),
    backgroundColor: tint,
    backgroundImage: 'none',
    WebkitMaskImage: maskUrl,
    maskImage: maskUrl,
    WebkitMaskSize: maskSize,
    maskSize,
    WebkitMaskPosition: '0 0',
    maskPosition: '0 0',
    WebkitMaskRepeat: 'repeat',
    maskRepeat: 'repeat',
    WebkitMaskOrigin: 'border-box',
    maskOrigin: 'border-box',
    maskMode: 'alpha',
  };
}

/**
 * Soft neon / aurora wash — large blurry light blobs behind the chat.
 * Looks like light leaking through frosted glass under a dark base color.
 */
export function buildWallpaperGlowStyle(cfg) {
  const c = normalizeWallpaper(cfg);
  if (c.type !== 'neon') return { display: 'none' };

  const { r, g, b } = hexToRgb(c.glow);
  const strength = Math.max(0.06, Math.min(1, (Number(c.intensity) || 50) / 100));
  const blur = Math.max(8, Math.min(80, Number(c.blur) || 48));
  const scale = Math.max(0.55, Math.min(2, (Number(c.scale) || 100) / 100));

  const a1 = (0.5 * strength).toFixed(3);
  const a2 = (0.36 * strength).toFixed(3);
  const a3 = (0.24 * strength).toFixed(3);
  const a4 = (0.18 * strength).toFixed(3);

  const e1w = Math.round(58 * scale);
  const e1h = Math.round(44 * scale);
  const e2w = Math.round(50 * scale);
  const e2h = Math.round(40 * scale);
  const e3w = Math.round(38 * scale);
  const e3h = Math.round(32 * scale);
  const e4w = Math.round(30 * scale);
  const e4h = Math.round(26 * scale);

  return {
    position: 'absolute',
    inset: `-${Math.ceil(blur * 1.1)}px`,
    pointerEvents: 'none',
    backgroundImage: [
      `radial-gradient(ellipse ${e1w}% ${e1h}% at 16% 10%, rgba(${r},${g},${b},${a1}), transparent 62%)`,
      `radial-gradient(ellipse ${e2w}% ${e2h}% at 90% 82%, rgba(${r},${g},${b},${a2}), transparent 58%)`,
      `radial-gradient(ellipse ${e3w}% ${e3h}% at 72% 24%, rgba(${r},${g},${b},${a3}), transparent 55%)`,
      `radial-gradient(ellipse ${e4w}% ${e4h}% at 28% 68%, rgba(${r},${g},${b},${a4}), transparent 52%)`,
    ].join(', '),
    filter: `blur(${blur}px)`,
    opacity: '1',
    willChange: 'transform',
  };
}

const LEGACY_PATTERNS = {
  dots: FIRST_PATTERN,
  doodles: FIRST_PATTERN,
  food: FIRST_PATTERN,
  tech: FIRST_PATTERN,
  nature: FIRST_PATTERN,
  bees: FIRST_PATTERN,
  bubbles: FIRST_PATTERN,
  hearts: FIRST_PATTERN,
  stars: FIRST_PATTERN,
  cross: FIRST_PATTERN,
};

const preloadedUrls = new Set();

function injectPreloadLink(url, rel) {
  if (typeof document === 'undefined' || !url) return;
  const sel = `link[rel="${rel}"][href="${url}"]`;
  if (document.head.querySelector(sel)) return;
  const link = document.createElement('link');
  link.rel = rel;
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}

export function preloadPatternUrl(url) {
  if (!url || typeof Image === 'undefined') return;
  if (preloadedUrls.has(url)) return;
  preloadedUrls.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

/**
 * Color/light is CSS (instant). Only the pattern actually on screen is fetched.
 * Prefetching every pattern SVG flooded the network tab on an idle messenger.
 */
export function preloadWallpaperPatterns(cfg) {
  const c = normalizeWallpaper(cfg || DEFAULT_WALLPAPER);
  const active = c.type === 'pattern' ? patternUrl(c.pattern) : '';
  if (!active) return;
  injectPreloadLink(active, 'preload');
  preloadPatternUrl(active);
}

export function loadWallpaper() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return normalizeWallpaper(JSON.parse(raw));
  } catch (e) { /* noop */ }
  return { ...DEFAULT_WALLPAPER };
}

export function saveWallpaper(cfg) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(normalizeWallpaper(cfg)));
  } catch (e) { /* noop */ }
}

/**
 * Call from MessengerPage only — never at module import.
 * Import-time preload used to fire dozens of pattern SVG requests on every
 * site page (home, courses, …) because the Vuex messenger module is eager.
 */
export function warmWallpaperAssets(cfg) {
  preloadWallpaperPatterns(cfg || loadWallpaper());
}
