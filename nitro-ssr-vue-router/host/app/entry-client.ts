import { createSSRApp } from "vue";
import { RouterView, createRouter, createWebHistory } from "vue-router";
import { provideTheme } from "nitro-vue-shared";
import { routes } from "./routes.ts";
import { ensureHostMfReady } from "./mf-init.ts";

const hostTheme = { primaryColour: "#3451b2", label: "host" };

async function main() {
  await ensureHostMfReady();

  const app = createSSRApp(RouterView);
  provideTheme(app, hostTheme);
  const router = createRouter({ history: createWebHistory(), routes });
  app.use(router);

  await router.isReady();
  app.mount("#root");
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main();
