/// <reference types="vite/client" />

declare module "remote_b/remote-app" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<{}, {}, any>;
  export default component;
}
