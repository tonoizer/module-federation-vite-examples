import { renderToString } from "react-dom/server";
import App from "./App";

export async function render() {
  return renderToString(<App />);
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
