const { createSSRApp } = await import("vue");
const { default: App } = await import("./App.vue");

await createSSRApp(App).mount("#root");
