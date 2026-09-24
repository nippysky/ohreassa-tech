import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("revised homepage and services preserve the layout and use the confirmed contact channels", async ({
  page,
  isMobile,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Reliable Power.Made Affordable.",
  );
  await expect(
    page.getByRole("heading", {
      name: /testimonials|customer stories|customer reviews/i,
    }),
  ).toHaveCount(0);
  const whatsappLinks = await page
    .locator('a[href^="https://wa.me/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(whatsappLinks.length).toBeGreaterThan(0);
  expect(
    whatsappLinks.every((link) =>
      link?.startsWith("https://wa.me/2348122214307?"),
    ),
  ).toBe(true);
  await expect(page.locator('footer a[href="tel:08068244971"]')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => document.fonts.ready);
  const lifestyleImage = page.locator(".lifestyle-image img");
  await lifestyleImage.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      lifestyleImage.evaluate(
        (image) =>
          (image as HTMLImageElement).complete &&
          (image as HTMLImageElement).naturalWidth > 0,
      ),
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({
    path: testInfo.outputPath("home.png"),
    fullPage: true,
    animations: "disabled",
  });

  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Solar solutions & services", exact: true })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Solar solutions", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your power needs. Our expertise.",
  );
  const installation = page.locator("#service-installation");
  await expect(installation.getByRole("heading")).toHaveText(
    "Professional solar installation",
  );
  const enquiry = await installation.getByRole("link").getAttribute("href");
  const url = new URL(enquiry!);
  expect(url.pathname).toBe("/2348122214307");
  expect(url.searchParams.get("text")).toContain(
    "professional solar installation",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("services.png"),
    fullPage: true,
    animations: "disabled",
  });
  await page.goto("/contact");
  await expect(page.locator('a[href="tel:08122214307"]')).toHaveCount(0);
  await expect(
    page
      .locator(".contact-card")
      .getByRole("link", { name: "08068244971", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("services has its own canonical URL and sharing card", async ({
  request,
}) => {
  const response = await request.get("/services");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toMatch(/rel="canonical" href="[^"]+\/services"/);
  expect(html).toContain("page=services");
  expect(html).toContain('"@type":"Service"');
});

test("home and services fit narrow phones and tablet widths", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "The desktop browser can resize through all intermediate widths.",
  );
  for (const path of ["/", "/services"]) {
    await page.goto(path);
    for (const width of [360, 820, 950, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toBeVisible();
      const header = await page.locator(".header-inner").evaluate((el) => {
        const box = el.getBoundingClientRect();
        return Array.from(el.children).every((child) => {
          const b = child.getBoundingClientRect();
          return b.width === 0 || b.right <= box.right + 1;
        });
      });
      expect(header, `Navigation fits at ${width}px`).toBe(true);
    }
  }
});
