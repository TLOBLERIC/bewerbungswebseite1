import React from "react";
import { Link } from "react-router-dom";          // ✅ neu
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import "./App.css";

export default function Hero({
                                 bg = "/images/hero.jpg",
                                 title = "Loïc Tobler",
                                 subtitle = "IT is it.",
                                 heroImage = "/images/image-6.jpg",
                             }) {
    return (
        <header className="hero" style={{ backgroundImage: `url(${bg})` }}>
            <div className="hero__overlay-gradient" />

            <div className="hero__inner container">
                {/* Textbereich */}
                <div className="hero__textblock">
                    <h1 className="hero__title">
                        <span className="highlight">{title.split(" ")[0]}</span>{" "}
                        {title.split(" ")[1]}
                    </h1>
                    <p className="hero__subtitle">{subtitle}</p>

                    {/* Elevator Pitch */}
                    <p className="hero__tagline">
                        Frontend Developer • Tech-Enthusiast • Teamplayer
                    </p>

                    <div className="hero__buttons">
                        <a href="#projects" className="btn btn-primary">
                            Projekte ansehen →
                        </a>

                        {/* ✅ Dokumente: echte Route statt Hash-Link */}
                        <Link to="/dokumente" className="btn btn-primary">
                            Dokumente
                        </Link>
                    </div>

                    {/* Social Links */}
                    <div className="hero__socials">
                        <a href="https://github.com/" target="_blank" rel="noreferrer">
                            <FaGithub />
                        </a>
                        <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
                            <FaLinkedin />
                        </a>
                        <a href="mailto:mail@domain.com">
                            <FaEnvelope />
                        </a>
                    </div>

                    {/* Quick Facts */}
                    <div className="hero__facts">
                        <div className="fact">
                            <span className="fact-num">5+</span>
                            <span className="fact-label">Projekte</span>
                        </div>
                        <div className="fact">
                            <span className="fact-num">DE/EN/FR</span>
                            <span className="fact-label">Sprachen</span>
                        </div>
                        <div className="fact">
                            <span className="fact-num">100%</span>
                            <span className="fact-label">Motivation</span>
                        </div>
                    </div>
                </div>

                {/* Profilbild */}
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

