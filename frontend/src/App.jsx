// frontend/src/App.jsx
import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/items")
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    fetch("http://localhost:8000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((newItem) => {
        setItems((prev) => [...prev, newItem]);
        setTitle("");
      })
      .catch(console.error);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>FastAPI + React + Postgres</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Nowy item..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "0.5rem", width: "70%", marginRight: "0.5rem" }}
        />
        <button type="submit">Dodaj</button>
      </form>

      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
