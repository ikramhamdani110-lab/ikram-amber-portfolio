export default async function run(page, ui) {
  // Wait for the app to finish loading (loading screen shows "IKRAM.")
  await page.waitForFunction(() => document.body.innerText.length > 200, null, { timeout: 20000 }).catch(() => { })
  const snap = await ui.snapshot({ full: true })
  // Navigate through all nav items and record body text length for each
  const results = { sections: {}, errors: page.__consoleErrors || null }
  const navMatch = snap.match(/@(e\d+) button "(\w[\w ]*)"/g) || []
  return { snapHead: snap.slice(0, 3000) }
}
