import { createServer } from 'node:http'

// Boot nitro by importing the built server entry's handler
const { default: handler } = await import('../.output/server/index.mjs').catch(() => ({ default: null }))

// Nitro node-server exposes via listening; instead use ofetch against child
import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const child = spawn('node', ['.output/server/index.mjs'], {
  cwd: new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1').replace(/\//g, '\\').replace(/^\\/, '') || 'c:\\zanburak\\zanburak-nuxt',
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NITRO_NO_CLUSTER: '1' },
})

let buf = ''
child.stdout.on('data', (d) => { buf += d.toString(); process.stdout.write(d) })
child.stderr.on('data', (d) => { buf += d.toString(); process.stderr.write(d) })

await sleep(2500)

const res = await fetch('http://127.0.0.1:3000/')
const text = await res.text()
console.log('STATUS', res.status)
console.log('BODY_HEAD', text.slice(0, 2000))
console.log('BUF_TAIL', buf.slice(-2000))
child.kill()
