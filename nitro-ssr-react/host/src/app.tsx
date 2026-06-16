import type { ReactNode } from "react";
import { Component, lazy, Suspense, useEffect, useState } from "react";
import { HostCounter } from "./components/HostCounter.tsx";
import { HostSsrComponent } from "./components/HostSsrComponent.tsx";

const RemoteWidget = lazy(() => import("remote/Widget"));
const RemoteCounter = lazy(() => import("remote/Counter"));

class RemoteErrorBoundary extends Component<
  { name: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            background: "#2a1f21",
            border: "1px solid #8f3a3a",
            borderRadius: 5,
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.25)",
            color: "white",
            margin: 20,
            padding: 20,
            width: 250,
          }}
        >
          <strong style={{ color: "#ffb4b4" }}>{this.props.name} failed to load</strong>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#f0caca" }}>
            {(this.state.error as Error).message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <main>
      <div style={{ float: "left" }}>
        <div
          style={{
            background: "#3178c6",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
            borderRadius: 5,
            color: "white",
            margin: 20,
            padding: 20,
            textAlign: "center",
            width: 250,
          }}
        >
          <div className="icon">
            <svg
              enableBackground="new 0 0 512 512"
              height="100px"
              id="Layer_1"
              version="1.1"
              viewBox="0 0 512 512"
              width="100px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M316.01,199.02L256.134,14.817L196.239,199.02H1.134l158.102,113.324L98.53,496.487l157.604-114.232  l157.585,114.232l-60.687-184.143L511.134,199.02H316.01z M335.084,318.257l42.407,128.63L267.22,366.963l-11.086-8.033  l-11.086,8.033l-110.291,79.923l42.408-128.63l4.353-13.18l-11.289-8.08L59.903,217.909h136.336h13.724l4.242-13.051l41.929-128.957  l41.91,128.957l4.242,13.051h13.724h136.336l-110.327,79.088l-11.27,8.08L335.084,318.257z"
                fill="#f6b352"
              />
            </svg>
          </div>
          <div style={{ margin: "25px 0", fontSize: 21 }}>I'm the host app</div>
          <HostCounter />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <HostSsrComponent />

        <RemoteErrorBoundary name="Widget">
          <Suspense fallback={<div>Loading remote widget...</div>}>
            <RemoteWidget />
          </Suspense>
        </RemoteErrorBoundary>

        <RemoteErrorBoundary name="Counter">
          <Suspense fallback={<div>Loading remote counter...</div>}>
            <RemoteCounter />
          </Suspense>
        </RemoteErrorBoundary>
      </div>
    </main>
  );
}
