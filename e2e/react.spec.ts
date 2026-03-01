import { expect, test } from "@playwright/test";

test("react host app and remote component should load and be visible", async ({
  page,
}) => {
  // Go to the React Host application
  await page.goto("/");

  // Verify the Host app loaded successfully (with a longer timeout for Vite cold start)
  await expect(page.getByText("I'm the host app")).toBeVisible({
    timeout: 5000,
  });

  // Verify the Remote app loaded successfully via Module Federation
  await expect(page.getByText("I'm the remote app")).toBeVisible({
    timeout: 5000,
  });
});
