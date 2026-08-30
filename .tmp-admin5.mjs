export default async function run(page, ui) {
  const results = {}
  await page.waitForSelector('input[type=password]', { timeout: 60000 })
  await page.fill('input[type=password]', 'admin123')
  await page.click('button[type=submit]')
  await page.waitForSelector('aside', { timeout: 30000 })
  await page.waitForTimeout(1500)

  const tab = (name) => page.getByRole('button', { name, exact: true })

  await tab('UPDATES FEED').click()
  await page.waitForTimeout(800)
  await page.getByRole('button', { name: 'ADD UPDATE', exact: true }).click()
  await page.waitForTimeout(600)
  await page.fill('main input[type=text]', 'QA Test Update')
  await page.fill('main textarea', 'Temporary test entry from automated QA.')
  results.dateDefaulted = Boolean(await page.inputValue('main input[type=date]'))
  await page.getByRole('button', { name: 'PUBLISH UPDATE', exact: true }).click()
  await page.waitForTimeout(1500)
  results.afterAdd = await page.evaluate(() => document.querySelector('main')?.innerText.toUpperCase().includes('QA TEST UPDATE'))
  await page.screenshot({ path: 'shot-admin-update.png' })

  page.once('dialog', d => d.accept())
  await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('main h4'))
    const t = els.find(h => h.textContent.includes('QA Test Update'))
    let row = t
    for (let i = 0; i < 8 && row; i++) {
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
    await page.waitForTimeout(1500)
    results.afterDelete = await page.evaluate(() => !document.querySelector('main')?.innerText.toUpperCase().includes('QA TEST UPDATE'))
  }
  return results
}
