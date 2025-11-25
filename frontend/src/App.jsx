// frontend/src/App.jsx
import { useEffect, useState } from "react";
import searchIcon from './assets/search.svg';
import VideoPosterTile from "./VideoPoster";

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState("home");

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
  <div className="mainbody">
    {page === "home" && (
      <>
        <div className="header" style={{ fontFamily: "sans-serif"}}>
          <div className="search_bar">
            <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
              <input
                type="text"
                placeholder="Search..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button type="submit">
                <img src={searchIcon} alt="Search" width="40" height="40" />
              </button>
            </form>
          </div>
        </div>

        <div className="main">
          <div className="main_container">
            <div className="movie_container">
              <VideoPosterTile number={0} title="ADD NEW MOVIE" onClick={() => setPage("add")} />
              <VideoPosterTile number={1} title="The Fast and The Furious: Tokyo Drift" onClick={() => setPage("edit")} />
              <VideoPosterTile number={2} title="Matrix" onClick={() => setPage("edit")} />
              <VideoPosterTile number={3} title="Se7en" onClick={() => setPage("edit")} />
              <VideoPosterTile number={4} title="Indiana Jones" onClick={() => setPage("edit")} />
              <VideoPosterTile number={5} title="Beverly Hills Cop II" onClick={() => setPage("edit")} />
            </div>
          </div>
        </div>
      </>
    )}

    {page === "edit" && <h1>MOVIE EDITOR</h1>}
    {page === "add" && <h1>ADD MOVIE</h1>}
  </div>
);

}

export default App;
