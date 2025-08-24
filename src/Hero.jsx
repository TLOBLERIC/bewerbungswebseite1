import React from "react";
import "./App.css";

export default function Hero({
                                 bg = "/public/image/hero.jpg",
                                 title = "Loïc Tobler",
                                 heroImage = "/public/images/image-6.jpg", // <— dein Bild hier
                             }) {
    return (
        <header className="hero" style={{ backgroundImage: `url(${bg})` }}>
            {/* Hintergrund-Overlay (liegt hinter allem im Vordergrund) */}
            <div className="hero__overlay" />

            {/* Vordergrund-Inhalt */}
            <div className="hero__inner container">
                {/* Bild-Box im Vordergrund */}
                <div className="hero__profile-box">
                    <img
                        src={heroImage}
                        alt="Portrait von Loïc Tobler"
                        className="hero__profile-img"
                    />
                </div>

                {/* Text im Vordergrund */}
                <div className="hero__content">
                    <h1 className="hero__title">{title}</h1>

                </div>
            </div>

            <a className="hero__scroll" href="#ueber-mich" aria-label="Scroll down">
                <span>▾</span>
            </a>
        </header>
    );
}

