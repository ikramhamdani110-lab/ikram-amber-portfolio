export default async function run(page, ui) {
  await page.waitForFunction(() => document.body.innerText.length > 200, null, { timeout: 20000 }).catch(() => { })
  const results = {}

  // Click About in nav -> overlay should appear instantly with counter
  let snap = await ui.snapshot()
  const aboutRef = snap.match(/@(e\d+) button "About"/)?.[1]
  await ui.click(aboutRef)
  await page.waitForTimeout(300)
  results.overlayEarly = await page.evaluate(() => {
    const el = document.querySelector('.fixed.inset-0')
    if (!el) return null
    return { text: el.innerText.replace(/\n/g, ' | '), lineW: (() => { const l = el.querySelector('.h-full'); return l ? getComputedStyle(l).width : null })() }
  })
  await page.waitForTimeout(500)
  results.overlayMid = await page.evaluate(() => {
    const el = document.querySelector('.fixed.inset-0')
    return el ? el.innerText.replace(/\n/g, ' | ') : 'GONE'
  })
  await page.waitForTimeout(700)
  results.afterDone = await page.evaluate(() => {
    const el = document.querySelector('.fixed.inset-0')
    const h2 = document.querySelector('main h2, main section h2')
    return { overlayGone: !el, heading: h2 ? h2.textContent.slice(0, 50) : null }
  })

  // Back to Home via wordmark -> hero mounts, dashed lines should animate then vanish
  snap = await ui.snapshot()
  const homeRef = snap.match(/@(e\d+) button "Go to home"/)?.[1]
  await ui.click(homeRef)
  await page.waitForTimeout(1500)
  results.linesVisibleMid = await page.evaluate(() => {
    const lines = document.querySelectorAll('svg motion-line, svg line')
    const arr = Array.from(lines).map(l => getComputedStyle(l).opacity)
    return arr
  })
  await page.waitForTimeout(2500)
  results.linesAfterFade = await page.evaluate(() => {
    const lines = document.querySelectorAll('svg line')
    return Array.from(lines).map(l => getComputedStyle(l).opacity)
  })

  // screenshot hero right after lines appear for visual check
  return results
}
