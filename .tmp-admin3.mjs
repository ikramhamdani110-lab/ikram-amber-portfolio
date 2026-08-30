export default async function run(page, ui) {
  const results = {}
  await page.waitForSelector('input[type=password]', { timeout: 20000 })
  await page.fill('input[type=password]', 'admin123')
  await page.click('button[type=submit]')
  await page.waitForSelector('header, main', { timeout: 20000 })
  await page.waitForTimeout(1200)
  results.loggedIn = true
  results.stats = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 250).replace(/\n/g, ' | '))

  let s = await ui.snapshot()
  await ui.click(s.match(/@(e\d+) button "Updates/)?.[1])
  await page.waitForTimeout(600)
  s = await ui.snapshot()
  await ui.click(s.match(/@(e\d+) button "Add Update"/)?.[1])
  await page.waitForTimeout(500)
  await page.fill('main input[type=text]', 'QA Test Update')
  await page.fill('main textarea', 'Temporary test entry from automated QA.')
  results.dateDefaulted = Boolean(await page.inputValue('main input[type=date]'))
  s = await ui.snapshot()
  await ui.click(s.match(/@(e\d+) button "Publish Update"/)?.[1])
  await page.waitForTimeout(1000)
  results.afterAdd = await page.evaluate(() => document.querySelector('main')?.innerText.includes('QA Test Update'))

  page.once('dialog', d => d.accept())
  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('main div'))
    const row = rows.find(r => r.className.includes('rounded-3xl') && r.textContent.includes('QA Test Update') && r.querySelector('button'))
    if (row) row.setAttribute('data-qa-row', '1')
  })
  const rowBtns = page.locator('[data-qa-row] button')
  const n = await rowBtns.count()
  if (n > 0) {
    await rowBtns.last().click()
    await page.waitForTimeout(1000)
    results.afterDelete = await page.evaluate(() => !document.querySelector('main')?.innerText.includes('QA Test Update'))
  } else { results.afterDelete = 'row not found' }

  return results
}
