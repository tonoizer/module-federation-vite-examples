import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  page.on("console", (message) => {
    if (message.type() === "error") {
      testInfo.attach("page-console-error", {
        contentType: "text/plain",
        body: `[${message.type()}] ${message.text()}`,
      });
    }
  });

  page.on("pageerror", (error) => {
    testInfo.attach("page-error", {
      contentType: "text/plain",
      body: `${error.name}: ${error.message}\n${error.stack}`,
    });
  });
});

const isSharedState =
  process.env.PLAYWRIGHT_TEST_COMMAND?.includes("vue") ||
  process.env.PLAYWRIGHT_TEST_COMMAND?.includes("nuxt");

const btn = (page: any, name: RegExp) => page.getByRole("button", { name }).first();

test("host app and remote component should load and counters should work", async ({ page }) => {
  await page.goto("/");

  // Verify the Host and Remote apps loaded
  await expect(page.getByText("I'm the host app")).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByText("I'm the remote app").first()).toBeVisible({
    timeout: 10000,
  });

  // Verify counters start at 0
  await expect(btn(page, /Host counter: 0/)).toBeVisible({ timeout: 10000 });
  await expect(btn(page, /Remote counter: 0/)).toBeVisible({ timeout: 10000 });

  // Click host counter and verify it increments
  await btn(page, /Host counter: 0/).click();
  await expect(btn(page, /Host counter: 1/)).toBeVisible();

  if (isSharedState) {
    // Vue/Nuxt shares state via Pinia - remote should also be 1
    await expect(btn(page, /Remote counter: 1/)).toBeVisible();
  }

  // Click remote counter
  await btn(page, isSharedState ? /Remote counter: 1/ : /Remote counter: 0/).click();
  await expect(btn(page, isSharedState ? /Remote counter: 2/ : /Remote counter: 1/)).toBeVisible();

  if (isSharedState) {
    // Vue/Nuxt shared state - host should also be 2
    await expect(btn(page, /Host counter: 2/)).toBeVisible();
  }

  // Click host counter again
  await btn(page, isSharedState ? /Host counter: 2/ : /Host counter: 1/).click();
  await expect(btn(page, isSharedState ? /Host counter: 3/ : /Host counter: 2/)).toBeVisible();

  if (isSharedState) {
    // Vue/Nuxt shared state - remote should also be 3
    await expect(btn(page, /Remote counter: 3/)).toBeVisible();
  } else {
    // Independent state - remote should still be 1
    await expect(btn(page, /Remote counter: 1/)).toBeVisible();

    // Click remote again and verify independent increment
    await btn(page, /Remote counter: 1/).click();
    await expect(btn(page, /Remote counter: 2/)).toBeVisible();

    // Host still at 2
    await expect(btn(page, /Host counter: 2/)).toBeVisible();
  }
});
