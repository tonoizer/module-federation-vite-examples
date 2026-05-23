const { createSSRApp } = await import("vue");
const { renderToString } = await import("@vue/server-renderer");
const { default: App } = await import("./App.vue");

export async function render() {
  const app = createSSRApp(App);
  return await renderToString(app);
}
