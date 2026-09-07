export default async function run(page, ui) {
  await page.click('#add-material');
  await page.selectOption('.material-category', 'Glass products');
  await page.selectOption('.material-type', 'Toughened safety glass');
  await page.selectOption('.material-size', '10mm per m2');
  await page.waitForTimeout(200);
  await page.locator('.material-row .material-width').fill('2400');
  await page.locator('.material-row .material-height').fill('1200');
  await page.waitForTimeout(300);
  return await page.evaluate(() => ({
    materialTotal: document.querySelector('.material-total')?.textContent,
    bestPrice: document.querySelector('.material-best-price')?.textContent,
    summaryMaterials: document.getElementById('summary-materials')?.textContent,
    grandTotal: document.getElementById('grand-total')?.textContent
  }));
}
