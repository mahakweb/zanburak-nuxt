import test from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeHtml } from '../../app/utils/sanitizeHtml.js'
import { isSafeInternalPath, safeInternalPath } from '../../app/utils/safeRedirect.js'

test('strips script tags and event handlers without a DOM', () => {
  const dirty = '<p>ok</p><script>alert(1)</script><img src=x onerror="alert(1)">'
  const clean = sanitizeHtml(dirty)
  assert.equal(clean.includes('<script'), false)
  assert.equal(/onerror/i.test(clean), false)
  assert.equal(clean.includes('<p>ok</p>'), true)
})

test('neutralizes javascript URLs', () => {
  const clean = sanitizeHtml('<a href="javascript:alert(1)">x</a>')
  assert.equal(/javascript:/i.test(clean), false)
})

test('rejects protocol-relative and off-site redirects', () => {
  assert.equal(isSafeInternalPath('//evil.com'), false)
  assert.equal(isSafeInternalPath('/\\evil.com'), false)
  assert.equal(isSafeInternalPath('https://evil.com'), false)
  assert.equal(isSafeInternalPath('/panel/courses'), true)
  assert.equal(safeInternalPath('//evil.com'), '/')
})
