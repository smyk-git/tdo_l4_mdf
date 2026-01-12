import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.svg";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const backend_url = import.meta.env.BACKEND_URL || "http://localhost:8000"; const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) { setError("Passwords do not match"); return; }
        fetch(`${backend_url}/register`, {
            method: "POST", headers:
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        }).then(async (res) => { if (!res.ok) throw new Error("Registration failed"); return res.json(); }).then(() => { navigate("/login"); }).catch((err) => setError(err.message));
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
                        <h2>Register</h2>

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

                            <div>
                                <p style={{ fontSize: "2em", fontWeight: "bold" }}>Repeat Password</p>
                                <input
                                    type="password"
                                    placeholder="REPEAT PASSWORD"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                            )}

                            <button type="submit">
                                <p>REGISTER</p>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="footer">
                <p>
                    Credits: Dawid, Micha�, Filip
                    <br />
                    2025
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
