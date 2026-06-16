import { defineConfig, devices } from "@playwright/test";

const cmd = process.env.PLAYWRIGHT_TEST_COMMAND;
const baseURL =
  cmd?.includes("vue-ssr") || cmd?.includes("react-ssr")
    ? "http://localhost:5173"
    : "http://localhost:4173";
// Wait for remotes (mf-manifest or remoteEntry) before the host page is usable.
const webServerUrl =
  cmd?.includes("tanstack") || cmd?.includes("svelte") || cmd?.includes("nuxt")
    ? "http://localhost:4174"
    : baseURL;

const reportDir = process.env.PLAYWRIGHT_REPORT_DIR || "playwright-report";
const testResultsDir = process.env.PLAYWRIGHT_TEST_RESULTS_DIR || "test-results";

export default defineConfig({
  testDir: "./e2e",
  outputDir: testResultsDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { outputFolder: reportDir }]],
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
    command: cmd || "pnpm react:preview",
    url: webServerUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  },
});
