const FORBIDDEN_TAGS = new Set([
  'script', 'iframe', 'object', 'embed', 'link', 'meta', 'base',
  'form', 'input', 'button', 'textarea', 'select', 'style',
  'math', 'foreignobject', 'frame', 'frameset', 'applet',
  'animate', 'set', 'handler', 'use',
])

function isDangerousUrl(value) {
  const trimmed = String(value || '').trim().toLowerCase()
  return /^(javascript|vbscript|data):/.test(trimmed)
}

function sanitizeElement(el) {
  const tag = (el.tagName || '').toLowerCase()
  if (FORBIDDEN_TAGS.has(tag)) {
    el.remove()
    return
  }

  for (const attr of [...el.attributes]) {
    const name = attr.name.toLowerCase()
    const value = attr.value || ''
    if (name.startsWith('on') || name === 'srcdoc' || name.startsWith('xmlns')) {
      el.removeAttribute(attr.name)
      continue
    }
    if ((name === 'href' || name === 'src' || name === 'xlink:href' || name === 'action') && isDangerousUrl(value)) {
      el.removeAttribute(attr.name)
    }
  }
}

/**
 * Strip active XSS from rendered markdown/HTML while keeping formatting tags.
 * Uses the document DOM (Nuxt SSR installs a request-local shim).
 */
export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== 'string') return ''

  if (typeof document === 'undefined') {
    return dirty
      .replace(/<script\b[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)\s*=\s*(['"])\s*(javascript|vbscript|data):[\s\S]*?\2/gi, '$1="#"')
  }

  const template = document.createElement('template')
  template.innerHTML = dirty
  template.content.querySelectorAll('*').forEach(sanitizeElement)
  return template.innerHTML
}
