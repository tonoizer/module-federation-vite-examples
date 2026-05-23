const { createSSRApp } = await import("vue");
const { default: App } = await import("./App.vue");

createSSRApp(App).mount("#root");
