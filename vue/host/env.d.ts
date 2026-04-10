/// <reference types="vite/client" />

declare module "remote/remote-app" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "remote/format-utils" {
  export function formatPrice(price: number, currency?: string): string;
}
