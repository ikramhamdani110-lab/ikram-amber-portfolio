export default async function run(page, ui) {
  await page.waitForSelector('input[type=password]', { timeout: 20000 })
  await page.fill('input[type=password]', 'admin123')
  await page.click('button[type=submit]')
  await page.waitForTimeout(2500)
  return await ui.snapshot()
}
