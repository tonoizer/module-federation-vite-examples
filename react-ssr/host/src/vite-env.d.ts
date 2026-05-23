/// <reference types="vite/client" />

declare module "remote_a/Feature" {
  import type { ComponentType, ReactNode } from "react";

  export type FeatureProps = {
    Pill?: ComponentType<{ label: string; children?: ReactNode }>;
  };

  const Feature: ComponentType<FeatureProps>;
  export default Feature;
}

declare module "remote_a/remote-app" {
  import type { ComponentType } from "react";

  const RemoteApp: ComponentType;
  export default RemoteApp;
}

declare module "remote_c/remote-app" {
  import type { ComponentType } from "react";

  const RemoteApp: ComponentType;
  export default RemoteApp;
}

declare module "remote_b/remote-app" {
  import type { ComponentType } from "react";

  const RemoteApp: ComponentType;
  export default RemoteApp;
}

declare module "remote_c/Aside" {
  import type { ComponentType } from "react";

  const Aside: ComponentType;
  export default Aside;
}

declare module "remote_b/Pill" {
  import type { ComponentType, ReactNode } from "react";

  export type PillProps = { label: string; children?: ReactNode };

  const Pill: ComponentType<PillProps>;
  export default Pill;
}
