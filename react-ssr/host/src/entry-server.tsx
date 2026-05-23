const { renderToString } = await import("react-dom/server");

export async function render() {
  const { default: App } = await import("./App");
  return renderToString(<App />);
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
