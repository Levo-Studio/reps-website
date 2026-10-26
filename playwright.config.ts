import { defineConfig, devices } from "@playwright/test";
import { SITE_URL } from "./lib/site";

// Pin the canonical origin for the server build and the test process alike,
// so a local .env file cannot make them disagree (Next.js gives process
// environment variables precedence over .env files).
process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;

// A dedicated port that is never reused: every run builds the current source
// and serves it the way the production image does (see `e2e:serve`).
const PORT = 6044;
const baseURL = `http://127.0.0.1:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm e2e:serve",
    url: `${baseURL}/api/health`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_SITE_URL: SITE_URL,
      NEXT_TELEMETRY_DISABLED: "1",
      PORT: String(PORT),
      HOSTNAME: "127.0.0.1",
    },
  },
});
