export default async function run(page, ui) {
  await page.waitForFunction(() => document.body.innerText.length > 200, null, { timeout: 20000 }).catch(() => { })
  const results = {}

  // 1. Shine class on the IKRAM h1
  results.shineClass = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    return h1 ? h1.className.includes('animate-name-shine') : false
  })

  // 2. Typewriter cycles — sample the <p> text over time
  const grabText = () => page.evaluate(() => {
    const p = document.querySelector('main p')
    return p ? p.textContent.trim() : null
  })
  const samples = new Set()
  for (let i = 0; i < 30; i++) { samples.add(await grabText()); await page.waitForTimeout(400) }
  results.typewriterSamples = Array.from(samples).filter(Boolean).slice(0, 15)

  // 3. No layout shift below the title: measure bio paragraph position at min height
  results.titleBox = await page.evaluate(() => {
    const p = document.querySelector('main p')
    if (!p) return null
    const r = p.getBoundingClientRect()
    const bio = p.nextElementSibling ? p.nextElementSibling.getBoundingClientRect().top : null
    return { titleTop: Math.round(r.top), titleHeight: Math.round(r.height), bioTop: bio ? Math.round(bio) : null }
  })

  // 4. Click a nav button -> expect IKRAM overlay, then About section
  const snap = await ui.snapshot()
  const aboutRef = snap.match(/@(e\d+) button "About"/)?.[1]
  await ui.click(aboutRef)
  await page.waitForTimeout(250)
  results.overlayDuringTransition = await page.evaluate(() => {
    const el = document.querySelector('.fixed.inset-0')
    return el ? { found: true, text: el.innerText.replace(/\n/g, ' ').slice(0, 40) } : { found: false }
  })
  results.overlayLine = await page.evaluate(() => {
    const el = document.querySelector('.fixed.inset-0 .h-full')
    return el ? getComputedStyle(el).width : null
  })
  await page.waitForTimeout(1200)
  results.afterTransition = await page.evaluate(() => {
    const overlay = document.querySelector('.fixed.inset-0')
    const h2 = document.querySelector('main h2, main section h2')
    return { overlayGone: !overlay, heading: h2 ? h2.textContent.slice(0, 60) : null }
  })
  // record mid-transition width of line
  return results
}
