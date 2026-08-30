export default async function run(page, ui) {
  await page.waitForFunction(() => document.body.innerText.length > 200, null, { timeout: 20000 }).catch(() => { })
  const sections = ['About', 'Skills', 'Certifications', 'Journey', 'Connect']
  const results = {}
  for (const label of sections) {
    let s = await ui.snapshot()
    const ref = s.match(new RegExp(`@(e\\d+) button "${label}"`))?.[1]
    if (!ref) { results[label] = 'NAV BUTTON NOT FOUND'; continue }
    await ui.click(ref)
    await page.waitForTimeout(900)
    const full = await ui.snapshot({ full: true })
    const imgs = await page.evaluate(() => Array.from(document.images).map(i => ({ src: i.src.slice(0, 90), ok: i.complete && i.naturalWidth > 0 })).filter(i => !i.ok))
    const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2)
    results[label] = {
      bodyLen: full.length,
      brokenImgs: imgs,
      horizontalOverflow: overflowX,
      sample: full.split('\n').slice(2, 12).join(' | ').slice(0, 400),
    }
  }
  return results
}
