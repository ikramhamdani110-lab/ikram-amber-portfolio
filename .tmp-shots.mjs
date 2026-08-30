export default async function run(page, ui) {
  await page.waitForFunction(() => document.body.innerText.length > 200, null, { timeout: 20000 }).catch(() => { })
  const shots = []
  // Dark hero
  await page.screenshot({ path: 'shot-home-dark.png', fullPage: false })
  shots.push('shot-home-dark.png')
  // Switch to light
  let s = await ui.snapshot()
  const ref = s.match(/@(e\d+) button "Switch to light mode"/)?.[1]
  if (ref) { await ui.click(ref); await page.waitForTimeout(800) }
  await page.screenshot({ path: 'shot-home-light.png', fullPage: false })
  shots.push('shot-home-light.png')
  return shots
}
