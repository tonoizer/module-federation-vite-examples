import { useEffect, useState } from "react";

export function HostCounter() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      style={{
        backgroundColor: "rgb(246, 179, 82)",
        border: "0 solid #e2e8f0",
        borderRadius: 4,
        color: "rgb(24, 24, 24)",
        cursor: "pointer",
        fontWeight: 700,
        marginTop: 10,
        padding: "8px 16px",
      }}
      onClick={() => setCount((c) => c + 1)}
    >
      Host counter: {count}
    </button>
  );
}
