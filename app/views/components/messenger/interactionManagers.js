/**
 * Centralized mobile interaction managers for Telegram-like messenger UX.
 * Overlay stacking, history-backed back navigation, keyboard state, and
 * ghost-click grace shared by confirm sheets / drawers.
 */

/** Ignore backdrop clicks for this long after open (mobile ghost-click). */
export const OPEN_CLICK_GRACE_MS = 700;

/**
 * Run after the current pointer gesture finishes so a leftover click
 * cannot hit a freshly opened confirm backdrop.
 */
export function openAfterPointerSettled(fn, delayMs = 60) {
  if (typeof fn !== 'function') return;
  const run = () => {
    try { fn(); } catch { /* noop */ }
  };
  if (typeof window === 'undefined') {
    run();
    return;
  }
  window.setTimeout(() => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(run);
    } else {
      run();
    }
  }, delayMs);
}

export function withinOpenGrace(openedAtMs, graceMs = OPEN_CLICK_GRACE_MS) {
  if (!openedAtMs) return false;
  return Date.now() - openedAtMs < graceMs;
}

/* ------------------------------------------------------------------ */
/* Overlay stack                                                      */
/* ------------------------------------------------------------------ */

const overlays = new Map(); // id → { id, kind, priority, close }
let overlaySeq = 0;

/**
 * Register an open overlay. Returns an unregister function.
 * Higher priority closes first on back. Same priority → LIFO.
 */
export function registerOverlay({ kind = 'overlay', priority = 100, close } = {}) {
  const id = `ov-${++overlaySeq}`;
  overlays.set(id, {
    id,
    kind: String(kind || 'overlay'),
    priority: Number(priority) || 100,
    close: typeof close === 'function' ? close : null,
    openedAt: Date.now(),
  });
  return () => {
    overlays.delete(id);
  };
}

export function getTopOverlay() {
  if (!overlays.size) return null;
  let top = null;
  for (const entry of overlays.values()) {
    if (!top
      || entry.priority > top.priority
      || (entry.priority === top.priority && entry.openedAt >= top.openedAt)) {
      top = entry;
    }
  }
  return top;
}

export function hasOverlayOfKind(kind) {
  const k = String(kind || '');
  for (const entry of overlays.values()) {
    if (entry.kind === k) return true;
  }
  return false;
}

export function overlayCount() {
  return overlays.size;
}

/** Close the highest-priority overlay. Returns true if one was closed. */
export function closeTopOverlay() {
  const top = getTopOverlay();
  if (!top?.close) return false;
  try {
    top.close();
  } catch {
    /* noop */
  }
  overlays.delete(top.id);
  return true;
}

export function clearOverlayStack() {
  overlays.clear();
}

/* Overlay priority bands (higher = closer first) */
export const OVERLAY_PRIORITY = {
  confirm: 900,
  mediaViewer: 850,
  hold: 840,
  sheet: 800,
  menu: 750,
  popover: 700,
  emoji: 650,
  panel: 600,
  search: 550,
  modal: 500,
};

/* ------------------------------------------------------------------ */
/* Keyboard manager                                                   */
/* ------------------------------------------------------------------ */

const keyboardListeners = new Set();
let keyboardOpen = false;
let keyboardHeight = 0;
let vvBound = false;

function notifyKeyboard() {
  const snap = { open: keyboardOpen, height: keyboardHeight };
  keyboardListeners.forEach((fn) => {
    try { fn(snap); } catch { /* noop */ }
  });
}

function readKeyboardFromViewport() {
  if (typeof window === 'undefined') {
    keyboardOpen = false;
    keyboardHeight = 0;
    return;
  }
  const vv = window.visualViewport;
  if (!vv) {
    keyboardOpen = false;
    keyboardHeight = 0;
    return;
  }
  const inset = Math.max(0, Math.round(window.innerHeight - vv.height - (vv.offsetTop || 0)));
  keyboardHeight = inset;
  keyboardOpen = inset > 80;
}

function onViewportChange() {
  readKeyboardFromViewport();
  notifyKeyboard();
}

function ensureKeyboardBinding() {
  if (vvBound || typeof window === 'undefined') return;
  vvBound = true;
  readKeyboardFromViewport();
  window.addEventListener('resize', onViewportChange);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onViewportChange);
    window.visualViewport.addEventListener('scroll', onViewportChange);
  }
}

export function isKeyboardOpen() {
  ensureKeyboardBinding();
  readKeyboardFromViewport();
  return keyboardOpen;
}

export function getKeyboardHeight() {
  ensureKeyboardBinding();
  readKeyboardFromViewport();
  return keyboardHeight;
}

export function subscribeKeyboard(fn) {
  if (typeof fn !== 'function') return () => {};
  ensureKeyboardBinding();
  keyboardListeners.add(fn);
  fn({ open: keyboardOpen, height: keyboardHeight });
  return () => keyboardListeners.delete(fn);
}

/** Blur active editable so soft keyboard collapses. */
export function dismissKeyboard() {
  if (typeof document === 'undefined') return false;
  const el = document.activeElement;
  if (!el) return false;
  const tag = (el.tagName || '').toLowerCase();
  const editable = tag === 'textarea' || tag === 'input' || el.isContentEditable;
  if (!editable) return false;
  try { el.blur(); } catch { /* noop */ }
  return true;
}

/* ------------------------------------------------------------------ */
/* Navigation / History stack                                         */
/* ------------------------------------------------------------------ */

const HISTORY_KEY = 'mzrNav';
const TRAP_STATE = { [HISTORY_KEY]: true, mzrTrap: true };

/**
 * Create a history-trap controller for Android/browser back.
 * `onBack` should return true if a level was consumed (stay in app).
 * `onRootBack` is called when already at the logical root (e.g. show exit sheet).
 */
export function createNavigationHistory({ onBack, onRootBack, isAtRoot } = {}) {
  let armed = false;
  let handling = false;

  function pushTrap() {
    if (typeof window === 'undefined') return;
    try {
      window.history.pushState({ ...TRAP_STATE, t: Date.now() }, '');
    } catch {
      /* noop */
    }
  }

  function onPopState() {
    if (handling) return;
    handling = true;
    try {
      // Always re-arm first so Vue Router cannot leave mid-handling.
      pushTrap();

      const atRoot = typeof isAtRoot === 'function' ? !!isAtRoot() : false;
      if (atRoot) {
        if (typeof onRootBack === 'function') onRootBack();
        return;
      }
      if (typeof onBack === 'function') onBack();
    } finally {
      handling = false;
    }
  }

  function arm() {
    if (armed || typeof window === 'undefined') return;
    armed = true;
    pushTrap();
    window.addEventListener('popstate', onPopState, true);
  }

  function disarm() {
    if (!armed || typeof window === 'undefined') return;
    armed = false;
    window.removeEventListener('popstate', onPopState, true);
  }

  /** Temporarily allow a real history exit (after user confirms leave). */
  function allowExit(navigate) {
    disarm();
    if (typeof navigate === 'function') navigate();
  }

  return { arm, disarm, allowExit, pushTrap };
}

/**
 * Priority-ordered back step helper used by MessengerPage.
 * Each handler returns true if it consumed the back press.
 */
export function runBackPriority(handlers = []) {
  for (const fn of handlers) {
    if (typeof fn !== 'function') continue;
    try {
      if (fn()) return true;
    } catch {
      /* continue */
    }
  }
  return false;
}
