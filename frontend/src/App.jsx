// frontend/src/App.jsx
import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [genre, setGenre] = useState("");
  const [director, setDirector] = useState("");

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
      body: JSON.stringify({ title, description, year: year ? parseInt(year, 10) : null, rating: rating ? parseInt(rating, 10) : null, genre, director }),
    })
      .then((res) => res.json())
      .then((newItem) => {
        setItems((prev) => [...prev, newItem]);
        setTitle("");
        setDescription("");
        setYear("");
        setRating("");
        setGenre("");
        setDirector("");  
      })
      .catch(console.error);
  };

  return (
    <div className="mainbody">
      <div className="header" style={{ fontFamily: "sans-serif"}}>
      <h1>FAREPO</h1>

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
      <div className="main">

      </div>
    </div>
  );
}

export default App;
