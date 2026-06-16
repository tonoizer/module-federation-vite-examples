import "./styles.css";
import { renderToReadableStream } from "react-dom/server.edge";
import type { Theme } from "nitro-react-shared";
import { ThemeContext } from "nitro-react-shared";
import { App } from "./app.tsx";

import clientAssets from "./entry-client?assets=client";
import serverAssets from "./entry-server?assets=ssr";

const hostTheme: Theme = { primaryColour: "#3451b2", label: "host" };

export default {
  async fetch(_req: Request) {
    await Promise.all([import("remote/Widget"), import("remote/Counter")]);

    const assets = clientAssets.merge(serverAssets);
    return new Response(
      await renderToReadableStream(
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Nitro + React + Module Federation SSR</title>
            {assets.css.map((attr: any) => (
              <link key={attr.href} rel="stylesheet" {...attr} />
            ))}
            {assets.js.map((attr: any) => (
              <link key={attr.href} type="modulepreload" {...attr} />
            ))}
            <script type="module" src={assets.entry} />
          </head>
          <body id="app">
            <ThemeContext.Provider value={hostTheme}>
              <App />
            </ThemeContext.Provider>
          </body>
        </html>
      ),
      { headers: { "Content-Type": "text/html;charset=utf-8" } }
    );
  },
};
