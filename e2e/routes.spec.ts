import { expect, test } from "@playwright/test";
import { SITE_URL } from "../lib/site";

test.describe("/api/health", () => {
  test("reports a live process as JSON", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = (await response.json()) as Record<string, unknown>;
    expect(body).toEqual({
      status: "ok",
      service: "reps-website-levo-studio",
      timestamp: expect.any(String),
    });
    const timestamp = body["timestamp"] as string;
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });

  test("is rendered per request, not cached at build time", async ({
    request,
  }) => {
    const read = async () =>
      ((await (await request.get("/api/health")).json()) as {
        timestamp: string;
      }).timestamp;

    const first = await read();
    await expect.poll(read).not.toBe(first);
  });
});

test("/robots.txt allows crawling and names the host and sitemap", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const lines = (await response.text()).split("\n").map((line) => line.trim());

  expect(lines).toContain("User-Agent: *");
  expect(lines).toContain("Allow: /");
  expect(lines.filter((line) => line.startsWith("Disallow:"))).toEqual([]);
  expect(lines).toContain(`Host: ${SITE_URL}`);
  expect(lines).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
});

test("/sitemap.xml lists the landing and privacy pages", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");

  const body = await response.text();
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs).toEqual([`${SITE_URL}/`, `${SITE_URL}/privacy`]);
});
