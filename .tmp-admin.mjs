
export default async function run(page, ui) {
  const results = {}

  // 1. Login
  await page.waitForSelector('input[type=password]', { timeout: 15000 })
  await page.fill('input[type=password]', 'admin123')
  await page.click('button[type=submit]')
  await page.waitForSelector('text=Dashboard', { timeout: 15000 })
  results.loggedIn = true

  // 2. Overview stats
  await page.waitForTimeout(800)
  results.stats = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 300).replace(/\n/g, ' | '))

  // 3. Cycle through all tabs, catch errors
  const tabs = ['Profile', 'Skills', 'Certifications', 'Journey', 'Social', 'Updates', 'Site Settings', 'Security']
  results.tabs = {}
  for (const t of tabs) {
    const s = await ui.snapshot()
    const ref = s.match(new RegExp(`@(e\\d+) button "${t}`))?.[1]
    if (!ref) { results.tabs[t] = 'NOT FOUND'; continue }
    await ui.click(ref)
    await page.waitForTimeout(500)
    const txt = await page.evaluate(() => document.querySelector('main')?.innerText.slice(0, 150).replace(/\n/g, ' | '))
    results.tabs[t] = txt
  }

  // 4. Updates tab: add a test update, verify, then delete it
  const s1 = await ui.snapshot()
  await ui.click(s1.match(/@(e\d+) button "Updates/)?.[1])
  await page.waitForTimeout(500)
  const s2 = await ui.snapshot()
  const addRef = s2.match(/@(e\d+) button "Add Update"/)?.[1]
  await ui.click(addRef)
  await page.waitForTimeout(400)
  await page.fill('main input[type=text]', 'QA Test Update')
  await page.fill('main textarea', 'Temporary test entry created during automated QA.')
  // ensure date filled
  const dateVal = await page.inputValue('main input[type=date]')
  results.dateDefaulted = Boolean(dateVal)
  const s3 = await ui.snapshot()
  await ui.click(s3.match(/@(e\d+) button "Publish Update"/)?.[1])
  await page.waitForTimeout(900)
  results.afterAdd = await page.evaluate(() => document.querySelector('main')?.innerText.includes('QA Test Update'))

  // delete it
  page.once('dialog', d => d.accept())
  const s4 = await ui.snapshot()
  // find the row containing QA Test Update, then its delete button
  const delRef = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('main .rounded-3xl'))
    const row = rows.find(r => r.textContent.includes('QA Test Update'))
    if (!row) return null
    row.setAttribute('data-qa-row', '1')
    return true
  })
  if (delRef) {
    // last button in that row is the trash
    const btn = page.locator('[data-qa-row] button').last()
    await btn.click()
    await page.waitForTimeout(900)
    results.afterDelete = await page.evaluate(() => !document.querySelector('main')?.innerText.includes('QA Test Update'))
  } else {
    results.afterDelete = 'row not found'
  }

  // 5. Console errors captured by harness separately
  return results
}
