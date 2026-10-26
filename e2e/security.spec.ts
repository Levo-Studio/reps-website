import { expect, test, type APIResponse } from "@playwright/test";
import { scrollThroughPage, waitForHydration } from "./helpers";

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const PERMISSIONS_POLICY = [
  "accelerometer",
  "autoplay",
  "camera",
  "display-capture",
  "encrypted-media",
  "fullscreen",
  "geolocation",
  "gyroscope",
  "magnetometer",
  "microphone",
  "midi",
  "payment",
  "picture-in-picture",
  "publickey-credentials-get",
  "screen-wake-lock",
  "serial",
  "usb",
  "xr-spatial-tracking",
]
  .map((feature) => `${feature}=()`)
  .join(", ");

/** Every route, pages and API alike, carries the same static headers. */
function expectSecurityHeaders(response: APIResponse | null) {
  const headers = response?.headers() ?? {};
  expect(headers["content-security-policy"]).toBe(CONTENT_SECURITY_POLICY);
  expect(headers["strict-transport-security"]).toBe(
    "max-age=63072000; includeSubDomains",
  );
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  expect(headers["permissions-policy"]).toBe(PERMISSIONS_POLICY);
}

for (const path of ["/", "/privacy", "/api/health"]) {
  test(`${path} sends the security headers`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expectSecurityHeaders(response);
  });
}

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test.describe(`prefers-reduced-motion: ${reducedMotion}`, () => {
    test.use({ reducedMotion });

    for (const path of ["/", "/privacy"]) {
      test(`${path} runs under the policy without violations`, async ({
        page,
      }) => {
        const violations: string[] = [];
        page.on("console", (msg) => {
          if (msg.text().includes("Content Security Policy")) {
            violations.push(`console: ${msg.text()}`);
          }
        });
        await page.exposeFunction("__reportCspViolation", (v: string) => {
          violations.push(`event: ${v}`);
        });
        await page.addInitScript(() => {
          document.addEventListener("securitypolicyviolation", (e) => {
            const report = (
              window as unknown as { __reportCspViolation: (v: string) => void }
            ).__reportCspViolation;
            report(`${e.violatedDirective} blocked ${e.blockedURI}`);
          });
        });

        const response = await page.goto(path);
        // The policy must actually be in force for "no violations" to mean
        // anything.
        expect(response?.headers()["content-security-policy"]).toBe(
          CONTENT_SECURITY_POLICY,
        );
        await waitForHydration(page);
        await scrollThroughPage(page);
        await page.evaluate(
          () => new Promise((resolve) => requestAnimationFrame(resolve)),
        );

        expect(violations).toEqual([]);
      });
    }
  });
}
