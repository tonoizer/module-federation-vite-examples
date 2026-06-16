import { useEffect, useState } from "react";

export function HostSsrComponent() {
  const [hydrated, setHydrated] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
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
      <div style={{ marginTop: 10, fontSize: 21 }}>Host SSR component</div>
      <p
        style={{
          margin: "10px 0 16px",
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.82)",
        }}
      >
        Rendered by host before client hydration.
      </p>
      {hydrated && (
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            backgroundColor: "rgb(246, 179, 82)",
            border: "0 solid #e2e8f0",
            borderRadius: 4,
            color: "rgb(24, 24, 24)",
            cursor: "pointer",
            display: "block",
            fontWeight: 700,
            margin: "0 auto 12px",
            padding: "8px 16px",
          }}
        >
          SSR counter: {count}
        </button>
      )}
      <span
        style={{
          alignItems: "center",
          background: hydrated
            ? "linear-gradient(135deg, rgba(156, 224, 170, 0.2), rgba(246, 179, 82, 0.12))"
            : "rgba(255, 255, 255, 0.14)",
          borderRadius: 999,
          boxShadow: hydrated ? "inset 0 0 0 1px rgba(156, 224, 170, 0.18)" : "none",
          color: hydrated ? "#9ce0aa" : "rgba(255, 255, 255, 0.8)",
          display: "inline-flex",
          fontSize: 12,
          fontWeight: 700,
          gap: 7,
          letterSpacing: 0,
          lineHeight: 1,
          padding: "7px 11px",
        }}
      >
        <span
          style={{
            background: hydrated ? "#9ce0aa" : "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            boxShadow: hydrated ? "0 0 8px rgba(156, 224, 170, 0.75)" : "none",
            display: "inline-block",
            height: 7,
            width: 7,
          }}
        />
        {hydrated ? "Hydrated" : "SSR"}
      </span>
    </div>
  );
}
