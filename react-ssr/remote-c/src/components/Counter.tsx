import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      type="button"
      style={{
        border: "0 solid #e2e8f0",
        marginTop: "10px",
        backgroundColor: "rgb(246, 179, 82)",
        borderRadius: ".25rem",
        fontWeight: "700",
        padding: ".5rem 1rem",
        color: "rgb(24, 24, 24)",
        cursor: "pointer",
      }}
      onClick={() => setCount(count + 1)}
    >
      Remote counter: {count}
    </button>
  );
}
