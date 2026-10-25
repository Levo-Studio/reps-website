import { defineConfig, devices } from "@playwright/test";

// The suite runs against the production server, so `pnpm build` must have run
// first. Port matches the `start` script in package.json.
const PORT = 6043;
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
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm start",
    url: `${baseURL}/api/health`,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
