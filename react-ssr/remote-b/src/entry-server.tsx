import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";

function renderToHtml(element: any) {
  return new Promise<string>((resolve, reject) => {
    let settled = false;
    let started = false;
    let abortRender = () => {};
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    };
    const timeout = setTimeout(() => {
      abortRender();
      fail(new Error("React SSR render timed out"));
    }, 10000);

    const { pipe, abort } = renderToPipeableStream(element, {
      onAllReady() {
        if (started) return;
        started = true;
        const stream = new PassThrough();
        let html = "";
        stream.on("data", (chunk) => {
          html += chunk.toString();
        });
        stream.on("end", () => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          resolve(html);
        });
        stream.on("error", fail);
        pipe(stream);
      },
      onShellError: fail,
      onError(error) {
        console.error(error);
      },
    });
    abortRender = abort;
  });
}

export async function render() {
  return renderToHtml(<App />);
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
