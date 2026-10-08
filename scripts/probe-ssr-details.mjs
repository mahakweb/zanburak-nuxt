const checks = [
  { url: '/about', must: ['درباره', 'زنبورک'] },
  { url: '/contact', must: ['ارتباط', 'تماس'] },
  { url: '/course/tailwind-css-zero-to-hero', must: ['Tailwind', 'آموزش'] },
  { url: '/path/devops-deployment-path', must: ['DevOps', 'مسیر'] },
  { url: '/article/RAG-Architecture-Explained', must: ['RAG'] },
]

async function probe(path, must) {
  const res = await fetch('http://localhost:3000' + path)
  const html = await res.text()
  const hasPayload = html.includes('__NUXT_DATA__')
  const err = html.includes('"error":true') || /Internal Server Error/i.test(html)
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || ''
  const hits = must.map((m) => ({ m, ok: html.includes(m) }))
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim().slice(0, 80) || ''
  console.log(JSON.stringify({
    path,
    status: res.status,
    len: html.length,
    hasPayload,
    err,
    title: title.slice(0, 80),
    h1,
    hits,
  }, null, 2))
}

// discover a discuss slug
try {
  const api = await fetch('http://localhost:8000/api/discuss?page=1').then((r) => r.json()).catch(() => null)
  const slug = api?.questions?.[0]?.slug || api?.data?.[0]?.slug
  if (slug) checks.push({ url: `/discuss/${slug}`, must: [slug.slice(0, 8)] })
} catch {}

for (const c of checks) {
  await probe(c.url, c.must)
}

// episode from course page html if possible
const courseHtml = await fetch('http://localhost:3000/course/tailwind-css-zero-to-hero').then((r) => r.text())
const ep = courseHtml.match(/\/course\/[^"/]+\/episode\/\d+/)
if (ep) {
  await probe(ep[0], ['episode', 'اپیزود', 'ویدیو', 'جلسه'].slice(0, 2))
}
