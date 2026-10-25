import { expect, test, type Page } from "@playwright/test";

/**
 * Collects console errors, uncaught page errors and failed same-origin
 * requests for the lifetime of the page.
 */
function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("requestfailed", (req) =>
    errors.push(`requestfailed: ${req.url()} ${req.failure()?.errorText}`),
  );
  page.on("response", (res) => {
    if (res.status() >= 400) errors.push(`http ${res.status()}: ${res.url()}`);
  });
  return errors;
}

async function progressWidth(page: Page): Promise<number> {
  return page
    .locator("[data-progress]")
    .evaluate((el) => parseFloat((el as HTMLElement).style.width) || 0);
}

/** Jumps to a fraction of the scrollable height and waits until it lands. */
async function scrollToFraction(page: Page, fraction: number): Promise<void> {
  const target = await page.evaluate((f) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const top = Math.round(max * f);
    window.scrollTo({ top, behavior: "instant" });
    return top;
  }, fraction);
  await expect
    .poll(() => page.evaluate(() => Math.round(window.scrollY)))
    .toBe(target);
}

const PAGES = ["/", "/privacy"] as const;

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test.describe(`prefers-reduced-motion: ${reducedMotion}`, () => {
    test.use({ reducedMotion });

    for (const path of PAGES) {
      test(`${path} loads without errors`, async ({ page }) => {
        const errors = trackErrors(page);
        await page.goto(path);
        await page.waitForLoadState("networkidle");

        // Hero heading lines must end up inside their reveal mask, whether
        // they animate in or are resolved statically by CSS.
        const heroLines = page.locator("h1 [data-line]");
        await expect(heroLines.first()).toBeVisible();
        for (const line of await heroLines.all()) {
          await expect(line).toBeInViewport({ ratio: 0.9 });
        }

        // Above-the-fold blocks fade in (or are static) and settle at full
        // opacity.
        await expect(page.locator("[data-in]").first()).toHaveCSS(
          "opacity",
          "1",
        );

        expect(errors).toEqual([]);
      });
    }
  });
}

test.describe("prefers-reduced-motion: reduce", () => {
  test.use({ reducedMotion: "reduce" });

  for (const path of PAGES) {
    test(`${path} shows every heading and block at rest`, async ({ page }) => {
      await page.goto(path);

      const headings = page.locator("h1, h2");
      expect(await headings.count()).toBeGreaterThan(1);
      for (const heading of await headings.all()) {
        await expect(heading).toBeVisible();
        await expect(heading).toHaveCSS("opacity", "1");
      }
      for (const line of await page.locator("[data-line]").all()) {
        await expect(line).toHaveCSS("transform", "none");
      }

      const blocks = page.locator("[data-in]");
      expect(await blocks.count()).toBeGreaterThan(0);
      for (const block of await blocks.all()) {
        await expect(block).toBeVisible();
        await expect(block).toHaveCSS("opacity", "1");
      }
    });
  }
});

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test.describe(`landing scroll (${reducedMotion})`, () => {
    test.use({ reducedMotion });

    test("scrolling to the bottom advances the reading-progress bar", async ({
      page,
    }) => {
      const errors = trackErrors(page);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const start = await progressWidth(page);
      expect(start).toBeLessThan(5);

      // Halfway: the bar has moved but is not full yet.
      await scrollToFraction(page, 0.5);
      await expect.poll(() => progressWidth(page)).toBeGreaterThan(start);
      expect(await progressWidth(page)).toBeLessThan(100);

      // Bottom: the bar is full and the closing call to action is on screen.
      await scrollToFraction(page, 1);
      await expect.poll(() => progressWidth(page)).toBeGreaterThanOrEqual(99);
      await expect(page.locator("footer")).toBeInViewport();

      // The bar tracks furthest progress and does not rewind.
      await scrollToFraction(page, 0);
      expect(await progressWidth(page)).toBeGreaterThanOrEqual(99);

      expect(errors).toEqual([]);
    });
  });
}
