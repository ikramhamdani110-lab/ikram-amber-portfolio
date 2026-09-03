export default async function run(page) {
  await page.getByText('Skills', { exact: true }).first().click().catch(() => { });
  await page.waitForTimeout(2500);
  const skills = await page.evaluate(() => {
    const txt = document.body.innerText;
    const imgs = [...document.querySelectorAll('img')].map(i => ({src: i.getAttribute('src'), alt: i.alt, ok: i.complete && i.naturalWidth > 0}));
    return { hasSkills: /Skills/i.test(txt), imgCount: imgs.length, imgs, text: txt.slice(0, 500) };
  });
  return skills;
}
