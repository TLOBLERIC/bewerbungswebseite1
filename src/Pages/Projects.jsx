import React, { useEffect } from "react";

/**
 * Hinweise:
 * 1) Lege alle Bilder in /public/images/ ab (z.B. pacman.jpg).
 * 2) Links sind optional; ohne link wird nur die Card gezeigt.
 */
export default function Projects() {
    const projects = [
        {
            title: "Pacman Game",
            img: "/images/pacman.jpg",
            desc:
                "Mein eigenes Pacman Game für die Schule (.NET/C#). Erste Erfahrungen mit Game-Loop, Kollisionen & Sprites.",
        },
        {
            title: "StundenplanApp",
            img: "/images/stundenplan.png",
            desc:
                ".NET MAUI (Frontend) + SQLite (Backend). Stundenpläne, Fächer & Räume – mobil und offline.",
            link: "https://github.com/TLOBLERIC/gibbstundenplan",
            cta: "GitHub"
        },
        {
            title: "Haushaltsplanungsapp",
            img: "/images/household.jpg", // ersetze durch eigenes Bild in /public/images
            desc:
                "Gruppenprojekt: Aufgaben, Wochenansicht & Benachrichtigungen – damit Teams/Haushalte den Überblick behalten."
        },
        {
            title: "Webseite für meinen Handball Verein",
            img: "/images/handballseite.png",
            desc:
                "Eigenes HTML/CSS-Projekt. Fokus: Struktur, Typografie & Performance.",
            link: "https://inf-293-23f-m293user18.iet-gibb.net/Teil2/index.html",
            cta: "Website"
        },
        {
            title: "Bewerbungswebsite – Grundidee",
            img: "/images/bewerbungswebseite.png",
            desc:
                "Mini-Landingpage in reinem HTML/CSS als erste Vision meiner heutigen Seite.",
            link: "https://inf-293-23f-m293user18.iet-gibb.net/Teil3/index.html#",
            cta: "Demo"
        }
    ];

    // Scroll-Reveal (einfach & performant)
    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll(".reveal"));
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("in-view");
                        io.unobserve(e.target);
                    }
                });
            },
            { root: null, threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );
        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, []);

    return (
        <section id="projects" className="projects-section">
            {/* Hero */}
            <div className="projects-hero reveal" style={{ "--delay": "0ms" }}>
                <span className="badge">Portfolio</span>
                <h2 className="headline">Projects</h2>
                <p className="subline">
                    Eine Auswahl aktueller Arbeiten. Hover/Tap für Details – alles
                    responsiv & performant.
                </p>
                <div className="shine" aria-hidden="true" />
            </div>

            {/* Grid */}
            <div className="proj-grid">
                {projects.map((p, i) => (
                    <article
                        key={p.title}
                        className="proj-card reveal"
                        style={{ "--delay": `${120 * (i + 1)}ms` }}
                    >
                        <div className="media">
                            <img
                                src={p.img}
                                alt={p.title}
                                loading="lazy"
                                className="media-img"
                            />
                            <div className="media-glow" />
                        </div>

                        <div className="content">
                            <h3 className="proj-title">{p.title}</h3>
                            <p className="proj-desc">{p.desc}</p>

                            <div className="proj-actions">
                                {p.link ? (
                                    <a
                                        className="btn primary"
                                        href={p.link}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        {p.cta || "Ansehen"}
                                        <span className="i i-arrow" aria-hidden="true">↗</span>
                                    </a>
                                ) : (
                                    <span className="badge subtle">Kein Link</span>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

