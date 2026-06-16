import { createSSRApp } from "vue";
import { RouterView, createRouter, createWebHistory } from "vue-router";
import { provideTheme } from "nitro-vue-shared";
import { routes } from "./routes.ts";

const remoteTheme = { primaryColour: "#1f2124", label: "remote" };

async function main() {
  const app = createSSRApp(RouterView);
  provideTheme(app, remoteTheme);
  const router = createRouter({ history: createWebHistory(), routes });
  app.use(router);

  await router.isReady();
  app.mount("#root");
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main();
