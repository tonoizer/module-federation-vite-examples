declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "remote/Widget" {
  import type { DefineComponent } from "vue";
  const Widget: DefineComponent;
  export default Widget;
}

declare module "remote/Counter" {
  import type { DefineComponent } from "vue";
  const Counter: DefineComponent;
  export default Counter;
}

declare module "virtual:mf:__mfe_internal__host__H_A_I__hostAutoInit__H_A_I__.js" {
  export function initHost(): Promise<unknown>;
  export const hostInitPromise: Promise<unknown>;
}
