import { expect, test, type APIResponse, type Page } from "@playwright/test";
import {
  APP_STORE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "../lib/site";
import { siteUrlPattern } from "./helpers";

test("site constants are well-formed", () => {
  // The tests below compare against these constants, so pin the constants
  // themselves: a wrong App Store ID would otherwise go unnoticed.
  expect(APP_STORE_URL).toBe(
    "https://apps.apple.com/us/app/reps-lift-tracker/id6799562219",
  );
  expect(SITE_URL).toMatch(/^https?:\/\/[^/]+$/);
});

/** Headers every page shares: no framework banner, served as static HTML. */
function expectStaticPageHeaders(response: APIResponse | null) {
  const headers = response?.headers() ?? {};
  expect(headers["x-powered-by"]).toBeUndefined();
  // A prerendered page is shared-cacheable; a page that silently turned
  // dynamic is sent as private / no-store instead.
  expect(headers["cache-control"]).toMatch(/s-maxage=\d+/);
  expect(headers["cache-control"]).not.toMatch(/private|no-store/);
}

/** The SoftwareApplication JSON-LD is rendered by the root layout. */
async function expectJsonLd(page: Page) {
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
}

test.describe("landing page", () => {
  test("renders with metadata, structured data and the App Store link", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    expectStaticPageHeaders(await page.request.get("/"));

    await expect(page).toHaveTitle(SITE_TITLE);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Track your lifts.");

    const head = page.locator("head");
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      siteUrlPattern("/"),
    );
    await expect(head.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      SITE_DESCRIPTION,
    );
    await expect(head.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow",
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
    await expect(head.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      siteUrlPattern("/"),
    );
    await expect(head.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      siteUrlPattern("/og-badge.png"),
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
    await expect(
      head.locator('meta[name="twitter:description"]'),
    ).toHaveAttribute("content", SITE_DESCRIPTION);
    await expect(head.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      siteUrlPattern("/og-badge.png"),
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

    await expectJsonLd(page);
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
  test("renders with its own metadata", async ({ page }) => {
    const response = await page.goto("/privacy");
    expect(response?.status()).toBe(200);
    expectStaticPageHeaders(await page.request.get("/privacy"));

    await expect(page).toHaveTitle("Privacy policy — Reps");
    await expect(page.locator("h1")).toHaveCount(1);

    const head = page.locator("head");
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      siteUrlPattern("/privacy"),
    );
    await expect(head.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Reps stores everything on your iPhone. No account, no cloud sync, no analytics, no third-party SDKs — nothing is sent anywhere.",
    );
    await expect(head.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow",
    );
    await expect(head.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Privacy policy — Reps",
    );
    await expect(head.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      siteUrlPattern("/privacy"),
    );

    await expectJsonLd(page);
  });
});

test("unknown routes return 404", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
});

// Links fade their text colour on hover. Only colours transition: the focus
// ring must appear at once rather than fade in with the link colour.
for (const path of ["/", "/privacy"]) {
  test(`links on ${path} transition their colours but not the focus ring`, async ({
    page,
  }) => {
    await page.goto(path);
    const transitions = await page.locator("a").evaluateAll((links) =>
      links
        .map((link) => getComputedStyle(link))
        .filter((style) => style.transitionProperty.includes("color"))
        .map((style) => ({
          property: style.transitionProperty,
          duration: style.transitionDuration,
          easing: style.transitionTimingFunction,
        })),
    );

    expect(transitions.length).toBeGreaterThan(0);
    for (const transition of transitions) {
      expect(transition).toEqual({
        property:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
        duration: "0.15s",
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      });
    }
  });
}
