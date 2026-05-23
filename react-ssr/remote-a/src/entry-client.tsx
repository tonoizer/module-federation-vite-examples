const { hydrateRoot } = await import("react-dom/client");
const { default: App } = await import("./App");

hydrateRoot(document.getElementById("root") as HTMLElement, <App />);
