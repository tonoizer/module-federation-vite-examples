import { lazy, Suspense, useEffect } from "react";
import RemoteCard from "./components/RemoteCard";

const RemoteB = lazy(() => import("remote_b/remote-app"));

export default function RemoteApp() {
  useEffect(() => {
    console.log("Remote useEffect (remote_a)");
  }, []);

  return (
    <RemoteCard title="I'm the remote app">
      <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
        <Suspense fallback={null}>
          <RemoteB />
        </Suspense>
      </div>
    </RemoteCard>
  );
}
