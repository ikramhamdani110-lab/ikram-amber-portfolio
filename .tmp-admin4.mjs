export default async function run(page, ui) {
  const results = {}
  await page.waitForSelector('input[type=password]', { timeout: 20000 })
  await page.fill('input[type=password]', 'admin123')
  await page.click('button[type=submit]')
  await page.waitForTimeout(2500)

  // Updates Feed tab
  await ui.click('@e7')
  await page.waitForTimeout(700)
  let s = await ui.snapshot()
  const addRef = s.match(/@(e\d+) button "ADD UPDATE"/)?.[1]
  await ui.click(addRef)
  await page.waitForTimeout(600)
  await page.fill('main input[type=text]', 'QA Test Update')
  await page.fill('main textarea', 'Temporary test entry from automated QA.')
  results.dateDefaulted = Boolean(await page.inputValue('main input[type=date]'))
  s = await ui.snapshot()
  const pubRef = s.match(/@(e\d+) button "PUBLISH UPDATE"/)?.[1]
  await ui.click(pubRef)
  await page.waitForTimeout(1200)
  results.afterAdd = await page.evaluate(() => document.querySelector('main')?.innerText.toUpperCase().includes('QA TEST UPDATE'))
  await page.screenshot({ path: 'shot-admin-update.png' })

  // delete it (confirm dialog)
  page.once('dialog', d => d.accept())
  await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('main h4'))
    const t = els.find(h => h.textContent.includes('QA Test Update'))
    let row = t
    for (let i = 0; i < 6 && row; i++) {
      row = row.parentElement
      if (row && row.className.includes('rounded-3xl') && row.querySelectorAll('button').length >= 2) break
    }
    if (row) row.setAttribute('data-qa-row', '1')
  })
  const btns = page.locator('[data-qa-row] button')
  const n = await btns.count()
  results.rowButtons = n
  if (n > 0) {
    await btns.last().click()
    await page.waitForTimeout(1200)
    results.afterDelete = await page.evaluate(() => !document.querySelector('main')?.innerText.toUpperCase().includes('QA TEST UPDATE'))
  }
  return results
}
