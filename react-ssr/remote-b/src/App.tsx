import { useEffect } from "react";
import RemoteCard from "./components/RemoteCard";

export default function RemoteApp() {
  useEffect(() => {
    console.log("Remote useEffect (remote_b)");
  }, []);

  return <RemoteCard title="I'm the remote app (remote_b)" />;
}
