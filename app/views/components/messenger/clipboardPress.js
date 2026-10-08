import { copyText } from './inviteLinks';
import { LONG_PRESS_MS } from './motion';

/**
 * Attach click / contextmenu / long-press handlers that copy text to clipboard.
 * Returns a cleanup function.
 */
export function bindCopyOnPress(el, getText, onCopied) {
  if (!el) return () => {};

  let lpTimer = null;
  let lpMoved = false;
  let lpStart = null;

  const resolveText = () => {
    const raw = typeof getText === 'function' ? getText() : getText;
    return String(raw || '').trim();
  };

  const doCopy = async () => {
    const text = resolveText();
    if (!text) return;
    const ok = await copyText(text);
    if (ok && typeof onCopied === 'function') onCopied(text);
  };

  const onClick = (e) => {
    if (el._copySuppressClick) {
      el._copySuppressClick = false;
      return;
    }
    doCopy();
    e.preventDefault();
  };

  const onContext = (e) => {
    e.preventDefault();
    doCopy();
  };

  const onTouchStart = (e) => {
    const t = e.touches?.[0];
    lpStart = t ? { x: t.clientX, y: t.clientY } : null;
    lpMoved = false;
    clearTimeout(lpTimer);
    lpTimer = setTimeout(() => {
      if (!lpMoved) {
        el._copySuppressClick = true;
        doCopy();
      }
    }, LONG_PRESS_MS + 40);
  };

  const onTouchMove = (e) => {
    const t = e.touches?.[0];
    if (!lpStart || !t) return;
    const dx = Math.abs(t.clientX - lpStart.x);
    const dy = Math.abs(t.clientY - lpStart.y);
    if (dx > 10 || dy > 10) {
      lpMoved = true;
      clearTimeout(lpTimer);
    }
  };

  const onTouchEnd = () => {
    clearTimeout(lpTimer);
    lpStart = null;
  };

  el.addEventListener('click', onClick);
  el.addEventListener('contextmenu', onContext);
  el.addEventListener('touchstart', onTouchStart, { passive: true });
  el.addEventListener('touchmove', onTouchMove, { passive: true });
  el.addEventListener('touchend', onTouchEnd);
  el.addEventListener('touchcancel', onTouchEnd);

  return () => {
    clearTimeout(lpTimer);
    el.removeEventListener('click', onClick);
    el.removeEventListener('contextmenu', onContext);
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchmove', onTouchMove);
    el.removeEventListener('touchend', onTouchEnd);
    el.removeEventListener('touchcancel', onTouchEnd);
  };
}
