import { useState } from "react";

function VideoPosterTile({ number, title, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const posterPath = `src/assets/movie_posters/${number}.png`;

  return (
    <div
      style={styles.wrapper}
      className="poster"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        style={{
          ...styles.gradient,
          transform: isHovered
            ? "translate(-50%, -50%) scale(1.25)"
            : "translate(-50%, -50%) scale(0.40)",
          opacity: isHovered ? 0.9 : 0,
        }}
        aria-hidden="true"
      />
      <div
        style={{
          ...styles.poster,
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0)), url(${posterPath})`,
        }}
      />
      <h3 style={styles.title}>{title}</h3>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    width: "11em",
    margin: "0.5em",
    textAlign: "center",
    transition: "transform 0.6s ease",
    overflow: "visible",
  },
  gradient: {
    position: "absolute",
    top: "42%",
    left: "50%",
    width: "20em",
    height: "20em",
    transform: "translate(-50%, 0) scale(0.95)",
    background: "radial-gradient(circle, rgba(255,255,255,0.45), transparent 70%)",
    transition: "transform 0.5s ease, opacity 0.5s ease",
    zIndex: 0,
    pointerEvents: "none",
    filter: "blur(10px)", 
  },
  poster: {
    position: "relative",
    width: "100%",
    height: "16em",
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid",
    borderImageSource: "linear-gradient(to bottom, white, transparent)",
    borderImageSlice: "1",
    cursor: "pointer",
    zIndex: 1,
  },
  title: {
    marginTop: "1em",
    fontSize: "1.4em",
    color: "white",
    position: "relative",
    zIndex: 1,
  },
};

export default VideoPosterTile;
