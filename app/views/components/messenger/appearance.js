// Messenger UI fonts: per-slot preferences applied via CSS variables on the shell.

/**
 * Text-only stacks — never include color-emoji faces (Apple/Segoe/Noto Color Emoji).
 * Real emoji still render via the OS; picker / big-emoji nodes set emoji fonts locally.
 * The user's face comes first. MsgUiDigits only fills digits that face does not have.
 */
const DIGIT_FACE = "'MsgUiDigits'";
/** Chosen face first so its own digits win; MsgUiDigits only fills missing ASCII. */
const TEXT_TAIL = `${DIGIT_FACE}, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;

const SYSTEM_FAMILY = `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, ${DIGIT_FACE}, sans-serif`;

export const FONTS = [
  { id: 'system', label: 'System', family: SYSTEM_FAMILY, faNum: false },
  { id: 'YekanBakh', label: 'یکان بخ', family: `'YekanBakh', ${TEXT_TAIL}`, faNum: true },
  { id: 'Anjoman', label: 'انجمن', family: `'Anjoman', ${TEXT_TAIL}`, faNum: true },
];

const FONT_BY_ID = Object.fromEntries(FONTS.map((f) => [f.id, f]));
const FANUM_IDS = new Set(FONTS.filter((f) => f.faNum).map((f) => f.id));
const FA_DIGIT_MAP = '۰۱۲۳۴۵۶۷۸۹';

/** Legacy single-font key — still honored as the message-body default. */
const LS_KEY = 'messenger_font';
const LS_SLOTS_KEY = 'messenger_font_slots';
const LS_CUSTOM_KEY = 'messenger_font_custom';
const LS_SLOTS_REV_KEY = 'messenger_font_slots_rev';
const SLOTS_REV = 5;

/**
 * Slots the user can set independently.
 * `group` drives section headers in the Fonts settings screen.
 */
export const FONT_SLOTS = [
  // Chat content
  { id: 'message', labelKey: 'messenger.fontSlotMessage', group: 'chat' },
  { id: 'composer', labelKey: 'messenger.fontSlotComposer', group: 'chat' },
  { id: 'meta', labelKey: 'messenger.fontSlotMeta', group: 'chat' },
  { id: 'date', labelKey: 'messenger.fontSlotDate', group: 'chat' },
  { id: 'header', labelKey: 'messenger.fontSlotHeader', group: 'chat' },
  // Menus & overlays
  { id: 'menu', labelKey: 'messenger.fontSlotMenu', group: 'menus' },
  { id: 'settings', labelKey: 'messenger.fontSlotSettings', group: 'menus' },
  // Lists & chrome
  { id: 'sidebar', labelKey: 'messenger.fontSlotSidebar', group: 'chrome' },
  { id: 'search', labelKey: 'messenger.fontSlotSearch', group: 'chrome' },
  { id: 'profile', labelKey: 'messenger.fontSlotProfile', group: 'chrome' },
  { id: 'ui', labelKey: 'messenger.fontSlotUi', group: 'chrome' },
];

export const FONT_SLOT_GROUPS = [
  { id: 'chat', labelKey: 'messenger.fontGroupChat' },
  { id: 'menus', labelKey: 'messenger.fontGroupMenus' },
  { id: 'chrome', labelKey: 'messenger.fontGroupChrome' },
];

export function isRtlDirection(dir) {
  const v = dir != null && dir !== ''
    ? String(dir)
    : (() => {
      try {
        if (typeof document !== 'undefined' && document.documentElement?.dir) {
          return document.documentElement.dir;
        }
        return localStorage.getItem('direction') || 'rtl';
      } catch (e) {
        return 'rtl';
      }
    })();
  return v.toLowerCase() === 'rtl';
}

/** RTL → YekanBakh, LTR → system UI. */
export function defaultFontId(dir) {
  return isRtlDirection(dir) ? 'YekanBakh' : 'system';
}

export function defaultSlots(dir) {
  const id = defaultFontId(dir);
  return Object.fromEntries(FONT_SLOTS.map((s) => [s.id, id]));
}

export const DEFAULT_FONT = 'YekanBakh';

export function fontFamily(id) {
  return (FONT_BY_ID[id] || FONT_BY_ID[defaultFontId()]).family;
}

export function isFaNumFont(id) {
  return FANUM_IDS.has(id);
}

export function getFontSlot(slotId) {
  return FONT_SLOTS.find((s) => s.id === slotId) || null;
}

export function isFontCustom() {
  try {
    return localStorage.getItem(LS_CUSTOM_KEY) === '1';
  } catch (e) {
    return false;
  }
}

function setCustomFlag(on) {
  try {
    localStorage.setItem(LS_CUSTOM_KEY, on ? '1' : '0');
  } catch (e) { /* noop */ }
}

function allSlotsEqual(slots, fontId) {
  return FONT_SLOTS.every((s) => slots[s.id] === fontId);
}

/** Legacy all-YekanBakh (old hardcoded default) is not a manual choice. */
function inferCustomFromSlots(slots) {
  if (allSlotsEqual(slots, 'YekanBakh')) return false;
  if (allSlotsEqual(slots, defaultFontId())) return false;
  return FONT_SLOTS.some((s) => slots[s.id] && slots[s.id] !== defaultFontId());
}

function normalizeSlotMap(raw, dir) {
  const out = defaultSlots(dir);
  if (!raw || typeof raw !== 'object') return out;
  FONT_SLOTS.forEach((s) => {
    const v = raw[s.id];
    if (v && FONT_BY_ID[v]) out[s.id] = v;
  });
  return out;
}

function persistSlots(slots, { custom } = {}) {
  try {
    localStorage.setItem(LS_SLOTS_KEY, JSON.stringify(slots));
    localStorage.setItem(LS_KEY, slots.message);
    localStorage.setItem(LS_SLOTS_REV_KEY, String(SLOTS_REV));
    if (custom != null) setCustomFlag(custom);
  } catch (e) { /* noop */ }
  return slots;
}

/** @returns {string} legacy single id (message slot) */
export function loadFont() {
  try {
    const slots = loadFontSlots();
    if (slots.message && FONT_BY_ID[slots.message]) return slots.message;
    const v = localStorage.getItem(LS_KEY);
    if (v && FONT_BY_ID[v]) return v;
  } catch (e) { /* noop */ }
  return defaultFontId();
}

export function saveFont(id) {
  if (!FONT_BY_ID[id]) return;
  try {
    localStorage.setItem(LS_KEY, id);
  } catch (e) { /* noop */ }
  const slots = {};
  FONT_SLOTS.forEach((s) => { slots[s.id] = id; });
  persistSlots(normalizeSlotMap(slots), { custom: true });
}

export function loadFontSlots() {
  try {
    const custom = localStorage.getItem(LS_CUSTOM_KEY);
    const raw = localStorage.getItem(LS_SLOTS_KEY);

    if (custom === '1' && raw) {
      return normalizeSlotMap(JSON.parse(raw));
    }

    if (custom === '0') {
      const defs = defaultSlots();
      persistSlots(defs, { custom: false });
      return defs;
    }

    // First run after this revision: decide whether stored slots were a manual pick.
    if (raw) {
      const parsed = normalizeSlotMap(JSON.parse(raw));
      if (inferCustomFromSlots(parsed)) {
        persistSlots(parsed, { custom: true });
        return parsed;
      }
    } else {
      const legacy = localStorage.getItem(LS_KEY);
      if (legacy && FONT_BY_ID[legacy] && legacy !== 'YekanBakh' && legacy !== defaultFontId()) {
        const mapped = {};
        FONT_SLOTS.forEach((s) => { mapped[s.id] = legacy; });
        const next = normalizeSlotMap(mapped);
        persistSlots(next, { custom: true });
        return next;
      }
    }
  } catch (e) { /* noop */ }
  const defs = defaultSlots();
  persistSlots(defs, { custom: false });
  return defs;
}

export function saveFontSlots(slots, { custom = true } = {}) {
  return persistSlots(normalizeSlotMap(slots), { custom });
}

export function saveFontSlot(slotId, fontId) {
  const slots = loadFontSlots();
  if (!FONT_SLOTS.some((s) => s.id === slotId) || !FONT_BY_ID[fontId]) return slots;
  slots[slotId] = fontId;
  return saveFontSlots(slots, { custom: true });
}

/** Clear manual picks and restore RTL=YekanBakh / LTR=system for every slot. */
export function resetFontSlots(dir) {
  return persistSlots(defaultSlots(dir), { custom: false });
}

/** If the user has not picked fonts, re-apply direction defaults. */
export function applyDirectionFontDefaults(dir) {
  if (isFontCustom()) return loadFontSlots();
  return resetFontSlots(dir);
}

/**
 * Strip keycap / emoji-digit sequences back to plain ASCII digits,
 * then map to Persian digits for FaNum UI (or always in RTL).
 */
export function sanitizePlainDigits(text) {
  return String(text ?? '')
    // 1️⃣ → 1  (digit + optional VS16 + combining keycap)
    .replace(/([0-9])\uFE0F?\u20E3/g, '$1')
    // orphan variation selectors on digits
    .replace(/([0-9\u06F0-\u06F9])[\uFE0E\uFE0F]/g, '$1');
}

/**
 * Map ASCII 0-9 onto Persian digits so FaNum faces (YekanBakh / Anjoman)
 * own the glyphs as normal text — never color-emoji keycaps.
 * @param {string|number|null|undefined} text
 * @param {string|null} fontIdOrSlot font id, or a FONT_SLOTS id (message/meta/…)
 */
export function shapeUiDigits(text, fontIdOrSlot = null) {
  let s = sanitizePlainDigits(text);
  let id = fontIdOrSlot;
  if (id && !FONT_BY_ID[id] && FONT_SLOTS.some((slot) => slot.id === id)) {
    id = loadFontSlots()[id];
  }
  if (!id || !FONT_BY_ID[id]) {
    id = loadFontSlots().meta || defaultFontId();
  }
  // Always reshape in RTL messenger UI so digits never stay as emoji-prone ASCII.
  const useFa = FANUM_IDS.has(id) || isRtlDirection();
  if (!useFa) return s;
  return s.replace(/[0-9]/g, (ch) => FA_DIGIT_MAP[ch.charCodeAt(0) - 48] || ch);
}

/** CSS custom properties for the messenger shell. */
export function fontSlotStyle(slotsArg = null) {
  const slots = normalizeSlotMap(slotsArg || loadFontSlots());
  return {
    '--msg-font-ui': fontFamily(slots.ui),
    '--msg-font-message': fontFamily(slots.message),
    '--msg-font-meta': fontFamily(slots.meta),
    '--msg-font-menu': fontFamily(slots.menu),
    '--msg-font-settings': fontFamily(slots.settings),
    '--msg-font-profile': fontFamily(slots.profile),
    '--msg-font-composer': fontFamily(slots.composer),
    '--msg-font-sidebar': fontFamily(slots.sidebar),
    '--msg-font-search': fontFamily(slots.search),
    '--msg-font-header': fontFamily(slots.header),
    '--msg-font-date': fontFamily(slots.date),
    fontFamily: fontFamily(slots.ui),
  };
}
