export default async function run(page, ui) {
  await page.goto('http://localhost:3000')
  await page.waitForTimeout(6000)

  const check = async (label, width, height) => {
    await page.setViewportSize({ width, height })
    await page.waitForTimeout(800)
    return await page.evaluate((label) => {
      const h1 = document.querySelector('h1')
      if (!h1) return { label, error: 'no h1' }
      const cs = getComputedStyle(h1)
      return {
        label,
        text: h1.textContent.trim(),
        oneLine: h1.getBoundingClientRect().height <= parseFloat(cs.fontSize) * 1.3,
        color: cs.color,
        fontSize: cs.fontSize,
        nowrap: cs.whiteSpace,
        overflowX: document.documentElement.scrollWidth > window.innerWidth,
      }
    }, label)
  }

  const results = {}

  // LIGHT MODE checks
  await page.evaluate(() => localStorage.setItem('theme', 'light'))
  await page.reload()
  await page.waitForTimeout(5000)
  results.lightDesktop = await check('light-desktop', 1440, 900)
  results.lightMobile = await check('light-mobile', 390, 844)

  // DARK MODE checks
  await page.evaluate(() => localStorage.setItem('theme', 'dark'))
  await page.reload()
  await page.waitForTimeout(5000)
  results.darkDesktop = await check('dark-desktop', 1440, 900)
  results.darkMobile = await check('dark-mobile', 390, 844)

  // Screenshots
  await page.screenshot({ path: 'hero-dark-desktop.png' })
  await page.evaluate(() => localStorage.setItem('theme', 'light'))
  await page.reload()
  await page.waitForTimeout(5000)
  await page.screenshot({ path: 'hero-light-desktop.png' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(600)
  await page.screenshot({ path: 'hero-light-mobile.png' })

  return results
}
