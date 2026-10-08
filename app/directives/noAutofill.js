/**
 * Suppress browser / password-manager autofill bars (Chrome Android key/card/address strip).
 *
 * Usage:
 *   <input v-no-autofill />
 *   <input v-no-autofill="'strong'" />  <!-- new-password: stronger against Chrome -->
 *
 * Leaves OTP fields alone â€” those should keep autocomplete="one-time-code".
 */

const STATIC_ATTRS = {
  autocorrect: 'off',
  autocapitalize: 'off',
  spellcheck: 'false',
  'data-lpignore': 'true',
  'data-1p-ignore': 'true',
  'data-bwignore': 'true',
  'data-form-type': 'other',
};

function resolveAutocomplete(binding) {
  const v = binding?.value;
  if (v === 'strong' || v === 'new-password' || binding?.arg === 'strong') {
    return 'new-password';
  }
  if (typeof v === 'string' && v.length) return v;
  // Non-standard token â€” Chrome often ignores plain "off"
  return 'off';
}

function applyStaticAttrs(el, binding) {
  Object.entries(STATIC_ATTRS).forEach(([key, val]) => {
    el.setAttribute(key, val);
  });
  el.setAttribute('autocomplete', resolveAutocomplete(binding));
}

function bindUnlockOnInteract(el) {
  if (el._noAutofillBound) return;
  el._noAutofillBound = true;

  // Chrome scans focused/mountable fields; readonly until user interaction blocks that pass.
  el.setAttribute('readonly', 'readonly');
  el.dataset.noAutofillReadonly = '1';

  const unlock = () => {
    if (el.dataset.noAutofillReadonly === '1') {
      el.removeAttribute('readonly');
      delete el.dataset.noAutofillReadonly;
    }
  };

  el.addEventListener('focus', unlock);
  el.addEventListener('touchstart', unlock, { passive: true });
  el.addEventListener('mousedown', unlock);
  el._noAutofillUnlock = unlock;
}

function cleanup(el) {
  if (el._noAutofillUnlock) {
    el.removeEventListener('focus', el._noAutofillUnlock);
    el.removeEventListener('touchstart', el._noAutofillUnlock);
    el.removeEventListener('mousedown', el._noAutofillUnlock);
    delete el._noAutofillUnlock;
  }
  delete el._noAutofillBound;
  if (el.dataset.noAutofillReadonly === '1') {
    el.removeAttribute('readonly');
    delete el.dataset.noAutofillReadonly;
  }
}

export default {
  getSSRProps() { return {} },
  mounted(el, binding) {
    applyStaticAttrs(el, binding);
    bindUnlockOnInteract(el);
  },
  updated(el, binding) {
    applyStaticAttrs(el, binding);
  },
  unmounted(el) {
    cleanup(el);
  },
};

