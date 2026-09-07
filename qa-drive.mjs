export default async function run(page, ui) {
  const snap0 = await ui.snapshot();
  const ref = snap0.match(/@(e\d+) button ".*Saved quotes/)?.[1];
  if (!ref) return { error: 'no saved quotes button', snapshot: snap0 };
  await ui.click(ref);
  await page.waitForTimeout(400);
  const snap1 = await ui.snapshot();
  const signin = snap1.match(/@(e\d+) button "Sign in to Google"/)?.[1];
  if (!signin) return { error: 'no sign-in button', snapshot: snap1 };
  await ui.click(signin);
  // Give the Google popup/redirect a moment
  await page.waitForTimeout(5000);
  const url = page.url();
  const text = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  return { afterClickUrl: url, pageText: text };
}
