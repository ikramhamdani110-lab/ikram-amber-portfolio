export default async function run(page, ui) {
  const results = {}
  await page.waitForSelector('input[type=password]', { timeout: 60000 })
  await page.fill('input[type=password]', 'admin123')
  await page.click('button[type=submit]')
  await page.waitForTimeout(2000)

  const clickByText = (txt) => page.evaluate((t) => {
    const b = Array.from(document.querySelectorAll('main button, aside button')).find(x => x.textContent.trim().toUpperCase().includes(t))
    if (b) { b.click(); return true }
    return false
  }, txt)

  const mainHas = (txt) => page.evaluate((t) => document.querySelector('main')?.innerText.toUpperCase().includes(t), txt)

  await page.waitForTimeout(1500)
  results.dashboardLoaded = await mainHas('CMS PANEL')
  results.overviewStats = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 200).replace(/\n/g, ' | '))

  results.clickedUpdates = await clickByText('UPDATES FEED')
  await page.waitForTimeout(800)
  results.updatesTab = await mainHas('UPDATES LOG')

  results.clickedAdd = await clickByText('ADD UPDATE')
  await page.waitForTimeout(700)
  results.formOpen = await mainHas('POST NEW UPDATE')
  await page.fill('main input[type=text]', 'QA Test Update')
  await page.fill('main textarea', 'Temporary test entry from automated QA.')
  results.dateDefaulted = Boolean(await page.inputValue('main input[type=date]'))
  results.clickedPublish = await clickByText('PUBLISH UPDATE')
  await page.waitForTimeout(1500)
  results.afterAdd = await mainHas('QA TEST UPDATE')
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
  results.rowButtons = await btns.count()
  if (results.rowButtons > 0) {
    await btns.last().click()
    await page.waitForTimeout(1500)
    results.afterDelete = await page.evaluate(() => !document.querySelector('main')?.innerText.toUpperCase().includes('QA TEST UPDATE'))
  }
  return results
}
