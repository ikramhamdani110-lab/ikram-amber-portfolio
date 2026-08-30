export default async function run(page, ui) {
  await page.waitForFunction(() => document.body.innerText.length > 200, null, { timeout: 20000 }).catch(() => { })
  // 1. Click About, capture overlay mid-count
  let snap = await ui.snapshot()
  await ui.click(snap.match(/@(e\d+) button "About"/)?.[1])
  await page.waitForTimeout(450)
  await page.screenshot({ path: 'shot-overlay.png' })
  await page.waitForTimeout(1500)
  // 2. Back to home; capture hero right as lines should be visible
  snap = await ui.snapshot()
  await ui.click(snap.match(/@(e\d+) button "Go to home"/)?.[1])
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'shot-lines.png' })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: 'shot-lines-gone.png' })
  return 'done'
}
