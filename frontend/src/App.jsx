// frontend/src/App.jsx
import { useEffect, useState } from "react";
import searchIcon from './assets/search.svg';
import logo from './assets/logo/logo.svg';
import VideoPosterTile from "./VideoPoster";

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const movieTiles = [
    { number: 0, title: "ADD NEW MOVIE", page: "add" },
    { number: 1, title: "The Fast and The Furious: Tokyo Drift", page: "edit" },
    { number: 2, title: "Matrix", page: "edit" },
    { number: 3, title: "Se7en", page: "edit" },
    { number: 4, title: "Indiana Jones and Raiders of the Lost Ark", page: "edit" },
    { number: 5, title: "Beverly Hills Cop II", page: "edit" },
    { number: 6, title: "Pulp Fiction", page: "edit" },
    { number: 7, title: "Minecraft Movie", page: "edit" },
    { number: 8, title: "Kiler", page: "edit" },
    { number: 9, title: "Znachor", page: "edit" },
    { number: 10, title: "The Pianist", page: "edit" },
  ];


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
          <div className="header" style={{ fontFamily: "sans-serif" }}>
            <div className="logo"><img src={logo} alt="logo" /></div>
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
                {movieTiles.map(({ number, title, page: targetPage }) => (<VideoPosterTile key={number} number={number} title={title} onClick={() => {
                  setSelectedMovie({ number, title, page: targetPage }); setPage(targetPage);
                }} />))}
              </div>
            </div>
          </div>
          <div className="footer">
            <p>Credits: Dawid, Michał, Filip<br />2025</p>
          </div>
        </>
      )}

      {page === "edit" && selectedMovie && (
        <>
          <div className="header" style={{ fontFamily: "sans-serif" }}>
            <div className="logo" onClick={() => setPage("home")}><img src={logo} alt="logo" /></div>
          </div>
          <div className="main">
            <div className="editor">
              <div className="editor-left">
                <VideoPosterTile key={selectedMovie.number} number={selectedMovie.number} title={selectedMovie.title}/>
              </div>
              <div className="editor-right">
                <h2>Edit data for movie:</h2>
                <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Title</p>
                    <p>Title of the movie</p>
                    <input type="text" placeholder="TITLE" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Year</p>
                    <p>Year of movie premiere</p>
                    <input type="text" placeholder="YEAR" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Genre</p>
                    <p>Movie category or type (e.g. Action, Drama)</p>
                    <input type="text" placeholder="GENRE" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Description</p>
                    <p>Short summary of the movie plot</p>
                    <input type="text" placeholder="DESCRIPTION" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Director</p>
                    <p>Name of the movie director</p>
                    <input type="text" placeholder="DIRECTOR" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Review</p>
                    <p>Social opinion or rating of the movie</p>
                    <input type="text" placeholder="REVIEW" />
                  </div>

                  <button type="submit">
                    <img src={searchIcon} alt="Search" width="40" height="40" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
      {page === "add" && selectedMovie && (
        <>
          <div className="header" style={{ fontFamily: "sans-serif" }}>
            <div className="logo" onClick={() => setPage("home")}><img src={logo} alt="logo" /></div>
          </div>
          <div className="main">
            <div className="editor">
              <div className="editor-left">
                <VideoPosterTile key={selectedMovie.number} number={selectedMovie.number} title={selectedMovie.title}/>
              </div>
              <div className="editor-right">
                <h2>Add data for movie:</h2>
                <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Title</p>
                    <p>Title of the movie</p>
                    <input type="text" placeholder="TITLE" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Year</p>
                    <p>Year of movie premiere</p>
                    <input type="text" placeholder="YEAR" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Genre</p>
                    <p>Movie category or type (e.g. Action, Drama)</p>
                    <input type="text" placeholder="GENRE" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Description</p>
                    <p>Short summary of the movie plot</p>
                    <input type="text" placeholder="DESCRIPTION" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Director</p>
                    <p>Name of the movie director</p>
                    <input type="text" placeholder="DIRECTOR" />
                  </div>

                  <div>
                    <p style={{ fontSize: "2em",fontWeight: "bold" }}>Review</p>
                    <p>Social opinion or rating of the movie</p>
                    <input type="text" placeholder="REVIEW" />
                  </div>
                  <button type="submit"></button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

}

export default App;
