import "@vitejs/plugin-react/preamble";
import { hydrateRoot } from "react-dom/client";
import type { Theme } from "nitro-react-shared";
import { ThemeContext } from "nitro-react-shared";
import { App } from "./app.tsx";

const hostTheme: Theme = { primaryColour: "#3451b2", label: "host" };

hydrateRoot(
  document.querySelector("#app")!,
  <ThemeContext.Provider value={hostTheme}>
    <App />
  </ThemeContext.Provider>
);
