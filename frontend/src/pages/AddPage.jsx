// frontend/src/pages/AddPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.svg";
import VideoPosterTile from "../VideoPoster";

function AddPage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [director, setDirector] = useState("");
  const [rating, setRating] = useState("");

  const navigate = useNavigate();
  const backend_url = import.meta.env.BACKEND_URL || "http://localhost:8000";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const token = localStorage.getItem("token");
    fetch(`${backend_url}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title,
        description,
        year: year ? parseInt(year, 10) : null,
        rating: rating ? parseInt(rating, 10) : null,
        genre,
        director,
      }),
    })
      .then((res) => res.json())
      .then((newItem) => {
        console.log("Created movie:", newItem);
        navigate("/"); // po dodaniu wracamy na Home
      })
      .catch((err) => {
        console.error("Error creating item:", err);
      });
  };

  return (
    <div className="mainbody">
      {/* HEADER */}
      <div className="header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="logo" />
        </div>
      </div>

      {/* MAIN – layout jak w Twoim starym App.jsx */}
      <div className="main">
        <div className="editor">
          <div className="editor-left">
            {/* Podgląd plakatu – na razie placeholder */}
            <VideoPosterTile number={"NEW"} title={title || "New movie"} />
            <div className="editor-left-photo">
              <button type="button">
                <p>CHANGE PHOTO</p>
              </button>
              <button type="button">
                <p>DELETE PHOTO</p>
              </button>
            </div>
          </div>

          <div className="editor-right">
            <h2>Add data for new movie:</h2>

            <form onSubmit={handleSubmit}>
              <div>
                <p style={{ fontSize: "2em", fontWeight: "bold" }}>Title</p>
                <p>Title of the movie</p>
                <input
                  type="text"
                  placeholder="TITLE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <p style={{ fontSize: "2em", fontWeight: "bold" }}>Year</p>
                <p>Year of movie premiere</p>
                <input
                  type="text"
                  placeholder="YEAR"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div>
                <p style={{ fontSize: "2em", fontWeight: "bold" }}>Genre</p>
                <p>Movie category or type (e.g. Action, Drama)</p>
                <input
                  type="text"
                  placeholder="GENRE"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>

              <div>
                <p style={{ fontSize: "2em", fontWeight: "bold" }}>Description</p>
                <p>Short summary of the movie plot</p>
                <input
                  type="text"
                  placeholder="DESCRIPTION"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <p style={{ fontSize: "2em", fontWeight: "bold" }}>Director</p>
                <p>Name of the movie director</p>
                <input
                  type="text"
                  placeholder="DIRECTOR"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                />
              </div>

              <div>
                <p style={{ fontSize: "2em", fontWeight: "bold" }}>Review</p>
                <p>Social opinion or rating of the movie</p>
                <input
                  type="text"
                  placeholder="REVIEW (1–10)"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </div>

              <button type="submit">
                <p>CONFIRM</p>
              </button>
              <button type="reset" onClick={() => {
                setTitle("");
                setYear("");
                setGenre("");
                setDescription("");
                setDirector("");
                setRating("");
              }}>
                <p>RESET</p>
              </button>
            </form>
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

export default AddPage;
