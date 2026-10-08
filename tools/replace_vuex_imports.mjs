import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = fileURLToPath(new URL('../app', import.meta.url))

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules') continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (/\.(vue|js|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}

const useStoreFrom = "@/composables/useStore"
const vuexCompatFrom = "@/composables/useStore"

let changed = 0
for (const file of walk(root)) {
  let s = fs.readFileSync(file, 'utf8')
  const before = s
  s = s.replace(/import\s*\{\s*useStore\s*\}\s*from\s*['"]vuex['"]/g, `import { useStore } from "${useStoreFrom}"`)
  s = s.replace(/import\s*\{\s*useStore\s*\}\s*from\s*['"]vuex['"]/g, `import { useStore } from '${useStoreFrom}'`)
  s = s.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]vuex['"]/g,
    (full, inner) => {
      const names = inner.split(',').map((x) => x.trim()).filter(Boolean)
      const hasUseStore = names.includes('useStore')
      const mapNames = names.filter((n) => n !== 'useStore')
      const parts = []
      if (hasUseStore) parts.push(`import { useStore } from "${vuexCompatFrom}"`)
      if (mapNames.length) parts.push(`import { ${mapNames.join(', ')} } from "${vuexCompatFrom}"`)
      return parts.join('\n')
    },
  )
  if (s !== before) {
    fs.writeFileSync(file, s)
    changed++
  }
}
console.log('files updated:', changed)
