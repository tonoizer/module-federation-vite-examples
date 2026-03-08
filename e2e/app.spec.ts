import { expect, test } from "@playwright/test";

test("react host app and remote component should load and be visible", async ({
  page,
}) => {
  // Go to the React Host application
  await page.goto("/");

  // Verify the Host app loaded successfully (with a longer timeout for Vite cold start)
  await expect(page.getByText("I'm the host app")).toBeVisible({
    timeout: 10000,
  });

  // Verify the Remote app loaded successfully via Module Federation
  await expect(page.getByText("I'm the remote app")).toBeVisible({
    timeout: 10000,
  });
});

test("remoteEntry.js should be accessible at the correct path", async ({
  request,
}) => {
  const isNuxt = process.env.PLAYWRIGHT_TEST_COMMAND?.includes("nuxt");
  test.skip(!isNuxt, "only applies to nuxt");
  // In production/preview, remoteEntry.js should be served at the root (no /_nuxt prefix)
  const response = await request.get("http://localhost:4174/remoteEntry.js");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("javascript");
});
