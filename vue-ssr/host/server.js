import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import http from "node:http";
import express from "express";

const port = Number(process.env.PORT) || 5173;
const cors = process.env.SSR_CORS === "1";
const isProduction = process.env.NODE_ENV === "production";
const entryServer =
  process.env.SSR_ENTRY_SERVER ??
  (existsSync("./src/entry-server.tsx") ? "/src/entry-server.tsx" : "/src/entry-server.ts");

const app = express();
const httpServer = http.createServer(app);

if (cors) {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });
}

let vite;
let templateHtml = "";
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true, hmr: { server: httpServer } },
    appType: "custom",
  });
  app.use(vite.middlewares);
} else {
  const { default: compression } = await import("compression");
  const { default: sirv } = await import("sirv");
  app.use(compression());
  if (existsSync("./dist/server")) {
    app.use("/__mf_ssr__", sirv("./dist/server", { extensions: [] }));
  }
  app.use(sirv("./dist/client", { extensions: [] }));
  templateHtml = await fs.readFile("./dist/client/index.html", "utf-8");
}

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.get(["/", "/index.html"], async (req, res) => {
  try {
    let template;
    let render;
    if (isProduction) {
      template = templateHtml;
      ({ render } = await import("./dist/server/entry-server.js"));
    } else {
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(req.originalUrl, template);
      ({ render } = await vite.ssrLoadModule(entryServer));
    }
    const appHtml = await render();
    const html = template.replace("<!--ssr-outlet-->", appHtml);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (error) {
    vite?.ssrFixStacktrace(error);
    console.error(error);
    res.status(500).end(error?.stack ?? String(error));
  }
});

httpServer.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
