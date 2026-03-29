import Alpine from "alpinejs";
import "./style.css";
import { remoteApp } from "./remote-app.ts";

declare global {
  interface Window {
    Alpine: typeof Alpine;
    remoteApp: typeof remoteApp;
  }
}

window.Alpine = Alpine;
window.remoteApp = remoteApp;

Alpine.start();
