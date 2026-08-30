const fs = require('fs')
const p = 'components/sections/hero.tsx'
let s = fs.readFileSync(p, 'utf8')
const subs = [
  ['relative ml-8 lg:ml-14 max-w-md', 'relative ml-12 lg:ml-24 max-w-md'],
  ['overflow-visible max-w-xs"', 'overflow-visible max-w-xs lg:rotate-2"'],
]
for (const [a, b] of subs) {
  if (!s.includes(a)) { console.error('MISS: ' + a); process.exit(1) }
  s = s.split(a).join(b)
}
fs.writeFileSync(p, s)
console.log('OK')
