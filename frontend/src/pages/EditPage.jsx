// frontend/src/pages/EditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import logo from "../assets/logo/logo.svg";
import VideoPosterTile from "../VideoPoster";

function EditPage() {
  const { id } = useParams(); // id z /edit/:id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [director, setDirector] = useState("");
  const [rating, setRating] = useState("");
  const backend_url = import.meta.env.BACKEND_URL || "http://localhost:8000";

  // 1. Pobierz item z backendu (na razie przez /items i find)  
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${backend_url}/items/`)
      .then((res) => res.json())
      .then((items) => {
        const found = items.find((it) => String(it.id) === String(id));
        if (found) {
          setItem(found);
          setTitle(found.title || "");
          setDescription(found.description || "");
          setYear(found.year != null ? String(found.year) : "");
          setRating(found.rating != null ? String(found.rating) : "");
          setGenre(found.genre || "");
          setDirector(found.director || "");
        }
      })
      .finally(() => setLoading(false));
  }, [id, backend_url]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      year: year ? parseInt(year, 10) : null,
      rating: rating ? parseInt(rating, 10) : null,
      genre,
      director,
    };
    try {
      const response = await fetch(`${backend_url}/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      console.log("Response status:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedItem = await response.json();
      setItem(updatedItem);
      console.log("Updated movie:", updatedItem);
      navigate("/"); // po edycji wracamy na Home
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update the movie. Please try again.");
    }

  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${backend_url}/items/${id}`, {
        method: "DELETE",
      });       
      console.log("Delete response status:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Deleted movie with id:", id);
      navigate("/"); // po usunięciu wracamy na Home
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete the movie. Please try again.");
    } 
  
  };

  if (loading) {
    return (
      <div className="mainbody">
        <div className="header">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" />
          </div>
        </div>
        <div className="main">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mainbody">
        <div className="header">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" />
          </div>
        </div>
        <div className="main">
          <p>Movie with id {id} not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mainbody">
      {/* HEADER */}
      <div className="header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="logo" />
        </div>
      </div>

      {/* MAIN – ten sam layout editor, tylko z innymi labelami */}
      <div className="main">
        <div className="editor">
          <div className="editor-left">
            <VideoPosterTile number={item.id} title={title || item.title} />
            <div className="editor-left-photo">
            </div>
          </div>

          <div className="editor-right">
            <h2>Edit data for movie:</h2>

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
              <button type="button" onClick={() => navigate("/")}>
                <p>CANCEL</p>
              </button>
              <button type="button" onClick={handleDelete}>   
                <p>DELETE MOVIE</p>
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

export default EditPage;
