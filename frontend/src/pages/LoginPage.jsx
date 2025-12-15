import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.svg";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const backend_url = import.meta.env.BACKEND_URL || "http://localhost:8000";

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        fetch(`${backend_url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username,
                password,
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Invalid login or password");
                }
                return res.json();
            })
            .then((data) => {
                localStorage.setItem("token", data.access_token);
                navigate("/");
            })
            .catch((err) => {
                setError(err.message);
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

            {/* MAIN */}
            <div className="main">
                <div className="editor" style={{ justifyContent: "center" }}>
                    <div className="editor-right" style={{ maxWidth: "500px" }}>
                        <h2>Login</h2>

                        <form onSubmit={handleSubmit}>
                            <div>
                                <p style={{ fontSize: "2em", fontWeight: "bold" }}>Username</p>
                                <input
                                    type="text"
                                    placeholder="USERNAME"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <p style={{ fontSize: "2em", fontWeight: "bold" }}>Password</p>
                                <input
                                    type="password"
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                            )}

                            <button type="submit">
                                <p>LOGIN</p>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="footer">
                <p>
                    Credits: Dawid, Micha³, Filip
                    <br />
                    2025
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
