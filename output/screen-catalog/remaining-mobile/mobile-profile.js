async page => {
  const o = "output/screen-catalog/remaining-mobile/";
  await page.locator(".node-2").first().click({ force: true });
  await page.waitForTimeout(150);
  await page.locator(".lesson-profile-button").click({ force: true });
  await page.waitForTimeout(150);
  await page.screenshot({ path: o + "63-learning-profile-mobile.png" });
  await page.getByRole("button", { name: /Sổ tay đã học/ }).click();
  await page.screenshot({ path: o + "64-learning-notebook-mobile.png" });
  await page.getByRole("button", { name: /Về bản đồ|Về lộ trình/ }).click();
  await page.locator(".lesson-pet-button").click({ force: true });
  await page.waitForTimeout(150);
  await page.screenshot({ path: o + "65-companion-garden-mobile.png" });
  await page.getByRole("button", { name: "Về lộ trình" }).click();
}
