import fs from 'fs'

const src = fs.readFileSync(
  new URL('../../zanburak-frontend/src/routes/router.js', import.meta.url),
  'utf8',
)

const meta = {}

function parseMetaBlock(body) {
  const entry = {}
  if (/requiresAuth:\s*true/.test(body)) entry.requiresAuth = true
  const canM = body.match(/can:\s*(\[[\s\S]*?\]|'[^']+'|"[^"]+")/)
  if (canM) {
    try {
      // eslint-disable-next-line no-eval
      entry.can = eval(canM[1])
    } catch {
      /* skip */
    }
  }
  if (/superuserOnly:\s*true/.test(body)) entry.superuserOnly = true
  return entry
}

const routeRe = /\{\s*path:[\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?meta:\s*\{([\s\S]*?)\}\s*(?:,|\})/g
let m
while ((m = routeRe.exec(src)) !== null) {
  const name = m[1]
  const entry = parseMetaBlock(m[2])
  if (Object.keys(entry).length) meta[name] = { ...meta[name], ...entry }
}

const childRe = /name:\s*['"]([^'"]+)['"]\s*,\s*component:[\s\S]*?meta:\s*\{([\s\S]*?)\}/g
while ((m = childRe.exec(src)) !== null) {
  const name = m[1]
  const entry = parseMetaBlock(m[2])
  if (Object.keys(entry).length) meta[name] = { ...meta[name], ...entry }
}

const out = `/** Auto-generated from zanburak-frontend/src/routes/router.js */\nexport const ROUTE_META = ${JSON.stringify(meta, null, 2)};\n`
fs.writeFileSync(new URL('../app/utils/routeMeta.js', import.meta.url), out)
console.log('ROUTE_META entries:', Object.keys(meta).length)
