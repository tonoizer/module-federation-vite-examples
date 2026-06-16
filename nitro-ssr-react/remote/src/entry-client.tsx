import "@vitejs/plugin-react/preamble";
import { hydrateRoot } from "react-dom/client";
import type { Theme } from "nitro-react-shared";
import { ThemeContext } from "nitro-react-shared";
import { App } from "./app.tsx";

const remoteTheme: Theme = { primaryColour: "#1f2124", label: "remote" };

hydrateRoot(
  document.querySelector("#app")!,
  <ThemeContext.Provider value={remoteTheme}>
    <App />
  </ThemeContext.Provider>
);
