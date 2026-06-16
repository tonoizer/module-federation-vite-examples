import { type App, inject, type InjectionKey } from "vue";

export interface Theme {
  primaryColour: string;
  label: string;
}

export const defaultTheme: Theme = {
  primaryColour: "#888888",
  label: "default",
};

export const themeKey: InjectionKey<Theme> = Symbol("theme");

export function provideTheme(app: App, theme: Theme) {
  app.provide(themeKey, theme);
}

export function useTheme(): Theme {
  return inject(themeKey, defaultTheme)!;
}
