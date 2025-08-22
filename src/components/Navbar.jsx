// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const closeMobile = () => setOpen(false);

    return (
        <nav className="navbar">
            <div className="container inner nav-inner">
                {/* Logo -> Home */}
                <h1 className="logo">
                    <a href="/#ueber-mich" onClick={closeMobile}>Loïc Tobler</a>
                </h1>

                {/* Burger */}
                <button
                    className={`nav-burger ${open ? "is-open" : ""}`}
                    onClick={() => setOpen(v => !v)}
                    aria-label="Menü umschalten"
                    aria-expanded={open}
                    aria-controls="nav-links"
                    type="button"
                >
                    <span />
                    <span />
                    <span />
                </button>

                {/* Links */}
                <ul id="nav-links" className={`nav-links ${open ? "open" : ""}`}>
                    {/* Startseite-Sektionen als native Anker */}
                    <li><a className="nav-box" href="/#ueber-mich" onClick={closeMobile}>Über mich</a></li>
                    <li><a className="nav-box" href="/#projects" onClick={closeMobile}>Projects</a></li>
                    <li><a className="nav-box" href="/#kompetenzen" onClick={closeMobile}>Informatikkompetenzen</a></li>
                    <li><a className="nav-box" href="/#noten" onClick={closeMobile}>Noten</a></li>

                    {/* Unterseite als echte Route -> Link verwenden */}
                    <li>
                        <Link className="nav-box" to="/dokumente" onClick={closeMobile}>
                            Dokumente
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
