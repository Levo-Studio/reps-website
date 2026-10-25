import { expect, test } from "@playwright/test";
import {
  APP_STORE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "../lib/site";

// SITE_URL is read from NEXT_PUBLIC_SITE_URL at build time, so these
// assertions assume the tests run with the same environment as `pnpm build`.
const siteOrigin = new URL(SITE_URL).origin;

/** Asserts that an absolute URL points at the given path on the site origin. */
function expectSiteUrl(href: string | null, pathname: string) {
  expect(href, "expected an absolute URL").toBeTruthy();
  const url = new URL(href ?? "");
  expect(url.origin).toBe(siteOrigin);
  expect(url.pathname).toBe(pathname);
}

test("site constants are well-formed", () => {
  // The tests below compare against these constants, so guard the constants
  // themselves against typos.
  expect(APP_STORE_URL).toMatch(
    /^https:\/\/apps\.apple\.com\/[a-z]{2}\/app\/[\w-]+\/id\d+$/,
  );
  expect(SITE_URL).toMatch(/^https?:\/\/[^/]+$/);
});

test.describe("landing page", () => {
  test("renders with metadata, structured data and the App Store link", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(SITE_TITLE);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Track your lifts.");

    const head = page.locator("head");
    expectSiteUrl(
      await head.locator('link[rel="canonical"]').getAttribute("href"),
      "/",
    );
    await expect(head.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      SITE_DESCRIPTION,
    );

    // Open Graph
    await expect(head.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      SITE_TITLE,
    );
    await expect(
      head.locator('meta[property="og:description"]'),
    ).toHaveAttribute("content", SITE_DESCRIPTION);
    await expect(head.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
    expectSiteUrl(
      await head.locator('meta[property="og:url"]').getAttribute("content"),
      "/",
    );
    expectSiteUrl(
      await head.locator('meta[property="og:image"]').getAttribute("content"),
      "/og-badge.png",
    );

    // Twitter card
    await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(head.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      SITE_TITLE,
    );
    expectSiteUrl(
      await head.locator('meta[name="twitter:image"]').getAttribute("content"),
      "/og-badge.png",
    );

    // App Store calls to action: header, hero, download section, footer.
    const ctas = [
      page.getByRole("banner").getByRole("link", { name: "Download" }),
      page
        .getByRole("region", { name: "Hero" })
        .getByRole("link", { name: "Download on the App Store" }),
      page
        .getByRole("region", { name: "Download" })
        .getByRole("link", { name: "Download on the App Store" }),
      page
        .getByRole("contentinfo")
        .getByRole("link", { name: "App Store", exact: true }),
    ];
    for (const cta of ctas) {
      await expect(cta).toHaveAttribute("href", APP_STORE_URL);
    }
    // No stray or outdated App Store links anywhere on the page.
    const appStoreHrefs = await page
      .locator('a[href*="apps.apple.com"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    expect(appStoreHrefs).toEqual(Array(ctas.length).fill(APP_STORE_URL));

    // JSON-LD
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const data = JSON.parse((await jsonLd.textContent()) ?? "") as Record<
      string,
      unknown
    >;
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("SoftwareApplication");
    expect(data["downloadUrl"]).toBe(APP_STORE_URL);
    expect(data["operatingSystem"]).toBe("iOS");
  });

  test("referenced social image and favicon are served", async ({
    request,
  }) => {
    for (const path of ["/og-badge.png", "/favicon.png"]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toBe("image/png");
    }
  });
});

test.describe("privacy page", () => {
  test("renders with its own title and canonical URL", async ({ page }) => {
    const response = await page.goto("/privacy");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle("Privacy policy — Reps");
    await expect(page.locator("h1")).toHaveCount(1);
    expectSiteUrl(
      await page.locator('head link[rel="canonical"]').getAttribute("href"),
      "/privacy",
    );
  });
});

test("unknown routes return 404", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
});
