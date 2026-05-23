import { useEffect } from "react";
import RemoteB from "remote_b/remote-app";
import RemoteCard from "./components/RemoteCard";

export default function RemoteApp() {
  useEffect(() => {
    console.log("Remote useEffect (remote_a)");
  }, []);

  return (
    <RemoteCard title="I'm the remote app">
      <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
        <RemoteB />
      </div>
    </RemoteCard>
  );
}
