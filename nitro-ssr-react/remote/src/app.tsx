import Counter from "./components/Counter.tsx";
import Widget from "./components/Widget.tsx";

export function App() {
  return (
    <main style={{ display: "flex", flexWrap: "wrap" }}>
      <Widget />
      <Counter />
    </main>
  );
}
