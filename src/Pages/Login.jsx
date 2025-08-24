// src/Pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../lib/apiBase"; // export const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dokumente";

    const token = localStorage.getItem("token");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                console.error("Login fehlgeschlagen:", txt);
                alert("❌ Falsche Login-Daten");
                return;
            }

            const data = await res.json();
            if (!data?.token) {
                alert("⚠️ Unerwartete Antwort vom Server.");
                return;
            }

            localStorage.setItem("token", data.token);
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Login-Fehler:", err);
            alert("⚠️ Backend nicht erreichbar?");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUsername("");
        setPassword("");
        navigate("/login", { replace: true });
    };

    return (
        <main className="fullpage">
            <div className="card">
                <h2>{token ? "Willkommen" : "Login"}</h2>

                {token ? (
                    <>
                        <p>✅ Du bist eingeloggt.</p>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Benutzername"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                        <input
                            type="password"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Einloggen</button>
                    </form>
                )}
            </div>
        </main>
    );
}

