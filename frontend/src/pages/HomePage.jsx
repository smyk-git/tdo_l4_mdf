// frontend/src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../assets/search.svg";
import logo from "../assets/logo/logo.svg";
import VideoPosterTile from "../VideoPoster"; // plik VideoPoster.jsx

function HomePage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const backend_url = import.meta.env.BACKEND_URL || "http://localhost:8000";

  // 1. Pobierz listę filmów z backendu
  useEffect(() => {
    fetch(`${backend_url}/items`)
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => {
        console.error("Error fetching /items", err);
      });
  }, []);

  // 2. Filtrowanie po tytule (proste, po froncie)
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mainbody">
      {/* HEADER */}
      <div className="header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="logo" />
        </div>
        <div className="search_bar">
          <form
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              id="search-input"
              type="text"
              className="item-input"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="item-button">
              <img src={searchIcon} alt="Search" width="30" height="30"/>
            </button>
          </form>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="main_container">
          <div className="movie_container">
            <VideoPosterTile
                number="+"
                title="Add"
                onClick={() => navigate("/add")}
              />
            {filteredItems.map((item) => (
              <VideoPosterTile
                key={item.id}
                number={item.id}
                title={item.title}
                // po kliknięciu przejdziemy do edycji danego filmu
                onClick={() => navigate(`/edit/${item.id}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <p>
          Credits: Dawid, Michał, Filip
          <br />
          2025
        </p>
      </div>
    </div>
  );
}

export default HomePage;
