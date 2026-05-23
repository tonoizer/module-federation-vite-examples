const { renderToString } = await import("react-dom/server");
const { default: App } = await import("./App");

export async function render() {
  return renderToString(<App />);
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
