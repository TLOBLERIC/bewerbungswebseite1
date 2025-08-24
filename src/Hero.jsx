import React from "react";
import "./App.css";

export default function Hero({
                                 bg = "/images/hero.jpg",   // Hintergrundbild (z. B. Stadt, Tech-Muster)
                                 title = "Loïc Tobler",
                                 subtitle = "IT is it.",
                                 heroImage = "/images/image-6.jpg", // dein freigestelltes Bild
                             }) {
    return (
        <header
            className="hero"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* Overlay mit Gradient */}
            <div className="hero__overlay-gradient" />

            <div className="hero__inner container">
                {/* Textbereich */}
                <div className="hero__textblock">
                    <h1 className="hero__title">
                        <span className="highlight">{title.split(" ")[0]}</span>{" "}
                        {title.split(" ")[1]}
                    </h1>
                    <p className="hero__subtitle">{subtitle}</p>

                    <div className="hero__buttons">
                        <a href="#projects" className="btn btn-primary">
                            Projekte ansehen →
                        </a>
                        <a href="#dokumente" className="btn btn-primary">
                            Dokumente
                        </a>
                    </div>
                </div>

                {/* Profilbild im Vordergrund */}
                <div className="hero__profile-box">
                    <img
                        src={heroImage}
                        alt="Portrait von Loïc Tobler"
                        className="hero__profile-img"
                    />
                </div>
            </div>

            {/* Scroll-Pfeil */}
            <a className="hero__scroll" href="#ueber-mich" aria-label="Scroll down">
                <span>▾</span>
            </a>
        </header>
    );
}
