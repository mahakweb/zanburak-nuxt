const BLOCKED_MODIFIER_KEYS = new Set([
    'a', 'c', 'f', 'g', 'h', 'j', 'k', 'l', 'n', 'p', 'r', 's', 't', 'u', 'v', 'w', 'x',
]);

const BLOCKED_FUNCTION_KEYS = new Set([
    'F1', 'F3', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
]);

const KEYBOARD_LOCK_KEYS = [
    'PrintScreen',
    'Print',
    'Snapshot',
];

const SCREENSHOT_BLACKOUT_MS = 5000;
const SECURITY_AUDIT_MS = 300;

function isModifier(e) {
    return e.ctrlKey || e.metaKey || e.altKey;
}

function blockEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
}

function blockClipboard(e) {
    blockEvent(e);
}

function blockContextMenu(e) {
    blockEvent(e);
}

function blockDragStart(e) {
    blockEvent(e);
}

function blockSelectStart(e) {
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    blockEvent(e);
}

export function isFullscreenActive() {
    return !!(
        document.fullscreenElement
        || document.webkitFullscreenElement
        || document.msFullscreenElement
    );
}

export function isFullscreenRequired() {
    const ua = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    if (isMobile) return false;
    return !!(
        document.fullscreenEnabled
        || document.webkitFullscreenEnabled
    );
}

function osModifierHeld(e) {
    return !!(
        e.metaKey
        || e.getModifierState?.('Meta')
        || e.getModifierState?.('OS')
        || e.getModifierState?.('Super')
    );
}

function isScreenshotShortcut(e) {
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen') return true;
    if (e.key === 'Snapshot' || e.code === 'Snapshot') return true;
    if (e.code === 'F13') return true;

    const key = e.key?.toLowerCase?.() || '';

    if (e.shiftKey && osModifierHeld(e) && key === 's') return true;
    if (e.metaKey && e.shiftKey && key === 's') return true;
    if (e.altKey && (e.key === 'PrintScreen' || e.code === 'PrintScreen')) return true;

    if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) return true;
    if (e.metaKey && e.shiftKey && ['digit3', 'digit4', 'digit5'].includes(e.code?.toLowerCase?.())) {
        return true;
    }

    return false;
}

export async function clearClipboardSilently() {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText('');
        }
    } catch {
        /* noop */
    }
}

function triggerScreenshotDefense(callbacks) {
    clearClipboardSilently();
    callbacks.onScreenshotAttempt?.();
}

function onKeyDown(e, callbacks) {
    if (isScreenshotShortcut(e)) {
        blockEvent(e);
        triggerScreenshotDefense(callbacks);
        return;
    }

    if (BLOCKED_FUNCTION_KEYS.has(e.key)) {
        blockEvent(e);
        return;
    }

    if (e.key === 'F5' || (isModifier(e) && e.key.toLowerCase() === 'r')) {
        blockEvent(e);
        return;
    }

    if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (BLOCKED_MODIFIER_KEYS.has(key)) {
            blockEvent(e);
            return;
        }
        if (e.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) {
            blockEvent(e);
        }
    }
}

function onKeyUp(e, callbacks) {
    if (isScreenshotShortcut(e)) {
        blockEvent(e);
        triggerScreenshotDefense(callbacks);
    }
}

function onBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
    return '';
}

function onPopState() {
    history.pushState(null, '', window.location.href);
}

function runSecurityAudit(callbacks) {
    callbacks.onSecurityAudit?.({
        fullscreenActive: isFullscreenActive(),
        fullscreenRequired: isFullscreenRequired(),
        focused: document.hasFocus(),
        visible: !document.hidden,
    });
}

function onVisibilityChange(callbacks) {
    if (document.hidden) {
        callbacks.onTabHidden?.();
    } else {
        callbacks.onTabVisible?.();
        clearClipboardSilently();
    }
    runSecurityAudit(callbacks);
}

function onFullscreenChange(callbacks) {
    if (isFullscreenActive()) {
        lockExamKeyboard();
        callbacks.onFullscreenEntered?.();
    } else {
        callbacks.onFullscreenExit?.();
    }
    runSecurityAudit(callbacks);
}

function onWindowBlur(callbacks) {
    callbacks.onWindowBlur?.();
    runSecurityAudit(callbacks);
}

function onWindowFocus(callbacks) {
    callbacks.onWindowFocus?.();
    runSecurityAudit(callbacks);
}

export async function lockExamKeyboard() {
    if (!navigator.keyboard?.lock || !isFullscreenActive()) return;
    try {
        await navigator.keyboard.lock(KEYBOARD_LOCK_KEYS);
    } catch {
        /* fullscreen or permission required */
    }
}

export async function unlockExamKeyboard() {
    try {
        if (navigator.keyboard?.unlock) {
            await navigator.keyboard.unlock();
        }
    } catch {
        /* noop */
    }
}

/**
 * Hardens the exam surface: clipboard, refresh, devtools shortcuts, selection,
 * navigation, fullscreen, keyboard lock, and screenshot deterrence.
 */
export function enableQuizSecurity(rootEl, callbacks = {}) {
    if (!rootEl) return () => {};

    const opts = { capture: true };
    const keyDownHandler = (e) => onKeyDown(e, callbacks);
    const keyUpHandler = (e) => onKeyUp(e, callbacks);
    const visibilityHandler = () => onVisibilityChange(callbacks);
    const fullscreenHandler = () => onFullscreenChange(callbacks);
    const blurHandler = () => onWindowBlur(callbacks);
    const focusHandler = () => onWindowFocus(callbacks);

    const targets = [rootEl, document, document.body];

    targets.forEach((el) => {
        el.addEventListener('copy', blockClipboard, opts);
        el.addEventListener('cut', blockClipboard, opts);
        el.addEventListener('paste', blockClipboard, opts);
        el.addEventListener('contextmenu', blockContextMenu, opts);
        el.addEventListener('dragstart', blockDragStart, opts);
        el.addEventListener('drop', blockDragStart, opts);
        el.addEventListener('selectstart', blockSelectStart, opts);
    });

    document.addEventListener('keydown', keyDownHandler, opts);
    window.addEventListener('keydown', keyDownHandler, opts);
    document.addEventListener('keyup', keyUpHandler, opts);
    window.addEventListener('keyup', keyUpHandler, opts);
    document.addEventListener('visibilitychange', visibilityHandler);
    document.addEventListener('fullscreenchange', fullscreenHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenHandler);
    window.addEventListener('blur', blurHandler);
    window.addEventListener('focus', focusHandler);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('popstate', onPopState);

    history.pushState(null, '', window.location.href);

    const prevOverflow = document.body.style.overflow;
    const prevTouchCallout = document.body.style.webkitTouchCallout;
    document.body.style.overflow = 'hidden';
    document.body.style.webkitTouchCallout = 'none';
    document.body.classList.add('quiz-exam-active');

    const auditInterval = window.setInterval(() => runSecurityAudit(callbacks), SECURITY_AUDIT_MS);
    runSecurityAudit(callbacks);

    return () => {
        window.clearInterval(auditInterval);
        targets.forEach((el) => {
            el.removeEventListener('copy', blockClipboard, opts);
            el.removeEventListener('cut', blockClipboard, opts);
            el.removeEventListener('paste', blockClipboard, opts);
            el.removeEventListener('contextmenu', blockContextMenu, opts);
            el.removeEventListener('dragstart', blockDragStart, opts);
            el.removeEventListener('drop', blockDragStart, opts);
            el.removeEventListener('selectstart', blockSelectStart, opts);
        });
        document.removeEventListener('keydown', keyDownHandler, opts);
        window.removeEventListener('keydown', keyDownHandler, opts);
        document.removeEventListener('keyup', keyUpHandler, opts);
        window.removeEventListener('keyup', keyUpHandler, opts);
        document.removeEventListener('visibilitychange', visibilityHandler);
        document.removeEventListener('fullscreenchange', fullscreenHandler);
        document.removeEventListener('webkitfullscreenchange', fullscreenHandler);
        window.removeEventListener('blur', blurHandler);
        window.removeEventListener('focus', focusHandler);
        window.removeEventListener('beforeunload', onBeforeUnload);
        window.removeEventListener('popstate', onPopState);
        document.body.style.overflow = prevOverflow;
        document.body.style.webkitTouchCallout = prevTouchCallout;
        document.body.classList.remove('quiz-exam-active');
        unlockExamKeyboard();
    };
}

export async function requestExamFullscreen() {
    const el = document.documentElement;
    try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
        await lockExamKeyboard();
    } catch {
        /* user denied or unsupported */
    }
}

export async function exitExamFullscreen() {
    await unlockExamKeyboard();
    try {
        if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } catch {
        /* noop */
    }
}

export function formatQuizNumber(value, locale = 'fa-IR') {
    if (value === null || value === undefined || value === '∞') return value;
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return num.toLocaleString(locale);
}

export const QUIZ_SCREENSHOT_BLACKOUT_MS = SCREENSHOT_BLACKOUT_MS;
