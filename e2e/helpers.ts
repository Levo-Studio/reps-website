import { expect, type Page } from "@playwright/test";
import { SITE_URL } from "../lib/site";

/** Matches an absolute URL for `pathname` on the site origin. */
export function siteUrlPattern(pathname: string): RegExp {
  const escaped = `${SITE_URL}${pathname}`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Next.js renders the root canonical without a trailing slash; accept both.
  return new RegExp(`^${escaped}${pathname === "/" ? "?" : ""}$`);
}

/**
 * Collects console errors, uncaught page errors, failed requests and error
 * responses for the lifetime of the page.
 */
export function trackErrors(page: Page): string[] {
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

/**
 * Waits until React has hydrated the page and its effects (which set up all
 * motion) have run. React tags each DOM node it hydrates with an internal
 * fiber key; the JSON-LD script is the last element the root layout renders.
 * An idle callback then lets the hydration commit and its effects finish.
 */
export async function waitForHydration(page: Page): Promise<void> {
  await expect
    .poll(() =>
      page
        .locator('script[type="application/ld+json"]')
        .evaluate((el) =>
          Object.keys(el).some((key) => key.startsWith("__reactFiber$")),
        ),
    )
    .toBe(true);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestIdleCallback(() => resolve(), { timeout: 1000 }),
      ),
  );
}

/** Jumps to a fraction of the scrollable height and waits until it lands. */
export async function scrollToFraction(
  page: Page,
  fraction: number,
): Promise<void> {
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

/** Scrolls from top to bottom in half-viewport steps, firing scroll triggers. */
export async function scrollThroughPage(page: Page): Promise<void> {
  const steps = await page.evaluate(() =>
    Math.max(
      1,
      Math.ceil(
        (document.documentElement.scrollHeight - window.innerHeight) /
          (window.innerHeight / 2),
      ),
    ),
  );
  for (let step = 1; step <= steps; step++) {
    await scrollToFraction(page, step / steps);
  }
}
