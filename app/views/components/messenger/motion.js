/**
 * Shared Telegram-like motion constants for messenger JS gestures.
 * CSS counterparts live in messenger-theme.css (--tg-ease-*, --tg-dur-*).
 */

export const TG_EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const TG_EASE_SPRING = 'cubic-bezier(0.34, 1.3, 0.64, 1)';
export const TG_EASE_EMPHASIZED = 'cubic-bezier(0.2, 0, 0, 1)';

/** Long-press → multi-select (Telegram Web ~400–450ms). */
export const LONG_PRESS_MS = 450;

/** Horizontal swipe-to-reply arm distance (px). */
export const SWIPE_REPLY_THRESHOLD = 56;

/** Edge page-swipe to leave chat (px). */
export const PAGE_SWIPE_THRESHOLD = 72;

/** Soft keyboard considered open above this visualViewport shrink (px). */
export const KEYBOARD_OPEN_PX = 80;

/** Suppress native contextmenu after a selection long-press (ms). */
export const CONTEXTMENU_GUARD_MS = 420;

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function animationsEnabled() {
  if (typeof document === 'undefined') return true;
  if (document.documentElement.classList.contains('messenger-no-anim')) return false;
  return !prefersReducedMotion();
}

/** CSS transition string for imperative transforms. */
export function tgTransformTransition(durationMs = 220, ease = TG_EASE_OUT) {
  if (!animationsEnabled()) return 'none';
  return `transform ${durationMs}ms ${ease}`;
}
