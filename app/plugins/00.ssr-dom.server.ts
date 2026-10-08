/**
 * Minimal DOM shims for SSR so legacy Options API / setup code that
 * touches document/window during render does not crash the request.
 * Client hydration uses the real browser globals.
 */

function createClassList() {
  const set = new Set()
  return {
    add: (...tokens) => tokens.forEach((t) => set.add(String(t))),
    remove: (...tokens) => tokens.forEach((t) => set.delete(String(t))),
    contains: (token) => set.has(String(token)),
    toggle: (token, force) => {
      const t = String(token)
      if (force === true) {
        set.add(t)
        return true
      }
      if (force === false) {
        set.delete(t)
        return false
      }
      if (set.has(t)) {
        set.delete(t)
        return false
      }
      set.add(t)
      return true
    },
    get length() {
      return set.size
    },
    value: '',
  }
}

function createElementShim(tag = 'div') {
  return {
    tagName: String(tag).toUpperCase(),
    style: {},
    classList: createClassList(),
    children: [],
    childNodes: [],
    parentNode: null,
    parentElement: null,
    innerHTML: '',
    textContent: '',
    value: '',
    checked: false,
    disabled: false,
    href: '',
    src: '',
    id: '',
    className: '',
    dataset: {},
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = String(value)
      if (name === 'class') this.className = String(value)
      if (name === 'dir') this.dir = String(value)
      if (name === 'lang') this.lang = String(value)
    },
    getAttribute(name) {
      return this.attributes[name] ?? null
    },
    removeAttribute(name) {
      delete this.attributes[name]
    },
    hasAttribute(name) {
      return name in this.attributes
    },
    appendChild(child) {
      this.children.push(child)
      return child
    },
    removeChild(child) {
      this.children = this.children.filter((c) => c !== child)
      return child
    },
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return true
    },
    focus() {},
    blur() {},
    click() {},
    getBoundingClientRect() {
      return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }
    },
    querySelector() {
      return null
    },
    querySelectorAll() {
      return []
    },
    closest() {
      return null
    },
  }
}

export default defineNuxtPlugin({
  name: 'ssr-dom-shim',
  enforce: 'pre',
  setup() {
    if (import.meta.client) return

    const documentElement = {
      ...createElementShim('html'),
      dir: 'rtl',
      lang: 'fa',
      classList: createClassList(),
      style: {},
      scrollTop: 0,
      scrollLeft: 0,
      clientWidth: 1280,
      clientHeight: 720,
    }

    const body = createElementShim('body')
    const head = createElementShim('head')

    const fullDocument = {
      documentElement,
      body,
      head,
      title: '',
      cookie: '',
      readyState: 'complete',
      visibilityState: 'visible',
      hidden: false,
      location: { href: '/', pathname: '/', search: '', hash: '' },
      createElement: (tag) => createElementShim(tag),
      createElementNS: (_ns, tag) => createElementShim(tag),
      createTextNode: (text) => ({ nodeType: 3, textContent: String(text ?? '') }),
      createDocumentFragment: () => createElementShim('fragment'),
      getElementById: () => null,
      getElementsByTagName: () => [],
      getElementsByClassName: () => [],
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return true
      },
      createEvent() {
        return { initEvent() {} }
      },
    }

    // Patch even if a partial document stub already exists
    if (!globalThis.document?.documentElement) {
      globalThis.document = {
        ...(globalThis.document || {}),
        ...fullDocument,
        documentElement,
        body: globalThis.document?.body || body,
        head: globalThis.document?.head || head,
      }
    }

    // Ensure a usable window shim (vue-cropperjs etc. call window.addEventListener at import).
    const win = (typeof globalThis.window === 'object' && globalThis.window) || globalThis
    if (typeof win.addEventListener !== 'function') win.addEventListener = () => {}
    if (typeof win.removeEventListener !== 'function') win.removeEventListener = () => {}
    if (typeof win.dispatchEvent !== 'function') win.dispatchEvent = () => true
    if (typeof win.getComputedStyle !== 'function') {
      win.getComputedStyle = () => new Proxy({}, { get: () => '' })
    }
    if (!win.document) win.document = globalThis.document
    // Node 20+/24 may expose a partial `navigator` without userAgent; easymde/codemirror crash on import.
    const navShim = {
      userAgent: 'zanburak-ssr',
      language: 'fa',
      languages: ['fa'],
      onLine: true,
      clipboard: undefined,
      platform: 'ssr',
      vendor: '',
    }
    if (!win.navigator) {
      win.navigator = navShim
    } else {
      for (const [k, v] of Object.entries(navShim)) {
        if (win.navigator[k] == null) {
          try {
            Object.defineProperty(win.navigator, k, { value: v, configurable: true })
          } catch {
            /* ignore non-configurable */
          }
        }
      }
    }
    if (!win.location) win.location = { href: '/', pathname: '/', search: '', hash: '', origin: 'http://localhost' }
    globalThis.window = win
    if (typeof globalThis.addEventListener !== 'function') {
      globalThis.addEventListener = win.addEventListener
      globalThis.removeEventListener = win.removeEventListener
    }

    if (typeof globalThis.navigator === 'undefined' || globalThis.navigator?.userAgent == null) {
      try {
        Object.defineProperty(globalThis, 'navigator', {
          value: win.navigator,
          configurable: true,
          writable: true,
        })
      } catch {
        globalThis.navigator = win.navigator
      }
    }

    if (typeof globalThis.matchMedia !== 'function') {
      globalThis.matchMedia = () => ({
        matches: false,
        media: '',
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
          return false
        },
      })
    }

    if (typeof globalThis.getComputedStyle !== 'function') {
      globalThis.getComputedStyle = () => new Proxy({}, { get: () => '' })
    }

    if (typeof globalThis.requestAnimationFrame !== 'function') {
      globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16)
      globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
    }
  },
})
