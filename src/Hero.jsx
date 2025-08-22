import React from "react";
import "./App.css";

export default function Hero({
                                 bg = "/src/image/hero.jpg",
                                 title = "Loïc Tobler",

                             }) {
    return (
        <header className="hero" style={{ backgroundImage: `url(${bg})` }}>
            <div className="hero__overlay" />
            <div className="hero__inner container">
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
