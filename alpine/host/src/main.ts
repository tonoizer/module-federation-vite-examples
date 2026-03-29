import Alpine from "alpinejs";
import "./style.css";

type HostAppState = {
  hostCount: number;
  remoteLoaded: boolean;
  remoteError: string | null;
  init: () => Promise<void>;
};

declare global {
  interface Window {
    Alpine: typeof Alpine;
    hostApp: () => HostAppState;
  }
}

window.Alpine = Alpine;
window.hostApp = () => ({
  hostCount: 0,
  remoteLoaded: false,
  remoteError: null,
  async init() {
    try {
      // @ts-ignore
      const { mountRemoteApp } = await import("remote/remote-app");
      const container = document.getElementById("remote-slot");

      if (!container) {
        this.remoteError = "Remote slot missing";
        return;
      }

      mountRemoteApp(container);
      this.remoteLoaded = true;
    } catch (error) {
      this.remoteError = error instanceof Error ? error.message : "Remote failed to load";
    }
  },
});

Alpine.start();
