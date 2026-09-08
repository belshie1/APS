export default async function run(page, ui) {
  const results = {};

  // 1. Load state checks
  results.initial = await page.evaluate(() => ({
    quoteNumber: document.getElementById('quote-number')?.textContent,
    grandTotal: document.getElementById('grand-total')?.textContent,
    labourTotal: document.getElementById('labour-total')?.textContent,
    summaryCallout: document.getElementById('summary-callout')?.textContent,
    summaryMaterials: document.getElementById('summary-materials')?.textContent,
    summaryServices: document.getElementById('summary-services')?.textContent,
  }));

  // 2. Add a material and check it renders + calculates
  await page.click('#add-material');
  await page.selectOption('.material-category', 'Glass products');
  await page.selectOption('.material-type', 'Toughened safety glass');
  await page.selectOption('.material-size', '10mm per m2');
  await page.waitForTimeout(200);
  results.materialRow = await page.evaluate(() => {
    const row = document.querySelector('.material-row');
    return {
      bestPrice: row?.querySelector('.material-best-price')?.textContent,
      total: row?.querySelector('.material-total')?.textContent,
      hasWidth: !!row?.querySelector('.material-width'),
      hasHeight: !!row?.querySelector('.material-height'),
    };
  });

  // 3. Set dimensions
  await page.locator('.material-row .material-width').fill('1000');
  await page.locator('.material-row .material-height').fill('1000');
  await page.waitForTimeout(300);
  results.afterDim = await page.evaluate(() => ({
    summaryMaterials: document.getElementById('summary-materials')?.textContent,
    grandTotal: document.getElementById('grand-total')?.textContent,
  }));

  // 4. Add a service
  await page.click('#add-service');
  await page.selectOption('.service-category', 'Glazing work');
  await page.selectOption('.service-task', 'Install glass panel');
  await page.waitForTimeout(200);
  results.serviceRow = await page.evaluate(() => {
    const row = document.querySelector('.service-row');
    return {
      rate: row?.querySelector('.service-rate')?.textContent,
      total: row?.querySelector('.service-total')?.textContent,
    };
  });

  // 5. Check scenario dropdown options exist
  results.scenarios = await page.evaluate(() => {
    const sel = document.getElementById('scenario-select');
    return [...sel.options].map(o => ({ value: o.value, text: o.textContent.trim() }));
  });

  // 6. Switch to price list view
  await page.click('[data-view="price-list"]');
  await page.waitForTimeout(300);
  results.priceListCount = await page.evaluate(() => document.getElementById('price-list-count')?.textContent);

  return results;
}