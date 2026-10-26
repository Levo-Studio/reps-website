import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  scrollThroughPage,
  scrollToFraction,
  trackErrors,
  waitForHydration,
} from "./helpers";

const PAGES = ["/", "/privacy"] as const;

/** Frames to watch when asserting that something stays put (~1/3 s). */
const WATCH_FRAMES = 20;

async function progressWidth(page: Page): Promise<number> {
  return page
    .locator("[data-progress]")
    .evaluate((el) => parseFloat((el as HTMLElement).style.width) || 0);
}

/** Reads the inline opacity/transform GSAP would leave behind. */
function inlineMotion(locator: Locator) {
  return locator.evaluate((el) => {
    const { opacity, transform } = (el as HTMLElement).style;
    return { opacity, transform };
  });
}

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test.describe(`prefers-reduced-motion: ${reducedMotion}`, () => {
    test.use({ reducedMotion });

    for (const path of PAGES) {
      test(`${path} loads without errors`, async ({ page }) => {
        const errors = trackErrors(page);
        await page.goto(path);
        await waitForHydration(page);

        // Hero heading lines must end up inside their reveal mask, whether
        // they animate in or are resolved statically by CSS.
        const heroLines = page.locator("h1 [data-line]");
        await expect(heroLines.first()).toBeVisible();
        for (const line of await heroLines.all()) {
          await expect(line).toBeInViewport({ ratio: 0.9 });
        }
        await expect(page.locator("[data-in]").first()).toHaveCSS(
          "opacity",
          "1",
        );

        expect(errors).toEqual([]);
      });
    }
  });
}

test.describe("prefers-reduced-motion: no-preference", () => {
  test.use({ reducedMotion: "no-preference" });

  for (const path of PAGES) {
    test(`${path} reveals every block and heading on scroll`, async ({
      page,
    }) => {
      const errors = trackErrors(page);
      await page.goto(path);
      await waitForHydration(page);
      await scrollThroughPage(page);

      const blocks = page.locator("[data-in]");
      expect(await blocks.count()).toBeGreaterThan(1);
      for (const block of await blocks.all()) {
        await block.scrollIntoViewIfNeeded();
        await expect(block).toHaveCSS("opacity", "1");
      }

      const lines = page.locator("h1 [data-line], h2 [data-line]");
      expect(await lines.count()).toBeGreaterThan(0);
      for (const line of await lines.all()) {
        await line.scrollIntoViewIfNeeded();
        await expect(line).toBeInViewport({ ratio: 0.9 });
      }

      expect(errors).toEqual([]);
    });
  }
});

test.describe("prefers-reduced-motion: reduce", () => {
  test.use({ reducedMotion: "reduce" });

  test("/ shows final session stats without counting up", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);

    const counts = page.locator("[data-count]");
    const expected = await counts.evaluateAll((els) =>
      els.map(
        (el) =>
          Number(el.getAttribute("data-count")).toLocaleString("en-US") +
          (el.getAttribute("data-suffix") ?? ""),
      ),
    );
    expect(expected.length).toBeGreaterThan(0);

    // Bring the stats on screen, then watch them for a few frames: a count-up
    // would start from zero as soon as they enter the viewport.
    await counts.first().scrollIntoViewIfNeeded();
    const frames = await counts.first().evaluate(async (_, frameCount) => {
      const seen: string[][] = [];
      for (let i = 0; i < frameCount; i++) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        seen.push(
          [...document.querySelectorAll("[data-count]")].map(
            (el) => el.textContent ?? "",
          ),
        );
      }
      return seen;
    }, WATCH_FRAMES);
    for (const texts of frames) expect(texts).toEqual(expected);
  });

  for (const path of PAGES) {
    test(`${path} keeps every heading, block and rule at rest`, async ({
      page,
    }) => {
      await page.goto(path);
      await waitForHydration(page);
      await scrollThroughPage(page);

      const headings = page.locator("h1, h2");
      expect(await headings.count()).toBeGreaterThan(1);
      for (const heading of await headings.all()) {
        await expect(heading).toBeVisible();
        await expect(heading).toHaveCSS("opacity", "1");
      }

      // Resting state via CSS, and no inline styles: the JS motion must not
      // have run at all.
      for (const line of await page.locator("[data-line]").all()) {
        await expect(line).toHaveCSS("transform", "none");
        expect(await inlineMotion(line)).toEqual({ opacity: "", transform: "" });
      }

      const blocks = page.locator("[data-in]");
      expect(await blocks.count()).toBeGreaterThan(0);
      for (const block of await blocks.all()) {
        await expect(block).toBeVisible();
        await expect(block).toHaveCSS("opacity", "1");
        expect(await inlineMotion(block)).toEqual({ opacity: "", transform: "" });
      }

      // Section rules are drawn in full instead of wiping in.
      for (const rule of await page.locator("[data-rule]").all()) {
        await expect(rule).toHaveCSS(
          "transform",
          /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/,
        );
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
      await waitForHydration(page);

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

      // Back at the top the bar keeps the furthest progress; watch a few
      // frames so a delayed rewind would be caught too.
      await scrollToFraction(page, 0);
      const widths = await page
        .locator("[data-progress]")
        .evaluate(async (el, frameCount) => {
          const seen: number[] = [];
          for (let i = 0; i < frameCount; i++) {
            await new Promise((resolve) => requestAnimationFrame(resolve));
            seen.push(parseFloat((el as HTMLElement).style.width) || 0);
          }
          return seen;
        }, WATCH_FRAMES);
      expect(Math.min(...widths)).toBeGreaterThanOrEqual(99);

      expect(errors).toEqual([]);
    });
  });
}
