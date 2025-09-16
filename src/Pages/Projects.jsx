import React, { useEffect } from "react";

export default function Projects() {
    const projects = [
        { title: "Pacman Game", img: "/images/pacman.jpg",
            desc: "Mein eigenes Pacman Game für die Schule (.NET/C#). Erste Erfahrungen mit Game-Loop, Kollisionen & Sprites." },
        { title: "StundenplanApp", img: "/images/stundenplan.png",
            desc: ".NET MAUI (Frontend) + SQLite (Backend).",
            link: "https://github.com/TLOBLERIC/gibbstundenplan", cta: "GitHub" },
        { title: "Haushaltsplanungsapp", img: "/images/haushaalt.png",
            desc: "Gruppenprojekt: Aufgaben, Wochenansicht & Benachrichtigungen.",
            link: "https://github.com/TLOBLERIC/Haushaltsplaner", cta: "GitHub"},

        { title: "Webseite für meinen Handball Verein", img: "/images/handballseite.png",
            desc: "Eigenes HTML/CSS-Projekt.", link: "https://inf-293-23f-m293user18.iet-gibb.net/Teil2/index.html", cta: "Website" },
        { title: "Bewerbungswebsite – Grundidee", img: "/images/bewerbungswebseite.png",
            desc: "Mini-Landingpage in HTML/CSS.", link: "https://inf-293-23f-m293user18.iet-gibb.net/Teil3/index.html#", cta: "Demo" },
    ];

    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll(".prj-reveal"));
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("in-view");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, []);

    return (
        <section id="projects" className="prj-section">
            <div className="prj-hero prj-reveal" style={{ "--delay": "0ms" }}>
                <span className="prj-badge">Portfolio</span>
                <h2 className="prj-headline">Projects</h2>
                <p className="prj-subline">Vergangene Projekte.</p>
                <div className="prj-shine" aria-hidden="true" />
            </div>

            <div className="prj-grid">
                {projects.map((p, i) => (
                    <article key={p.title} className="prj-card prj-reveal" style={{ "--delay": `${120 * (i + 1)}ms` }}>
                        <div className="prj-media">
                            <img src={p.img} alt={p.title} loading="lazy" className="prj-media-img" />
                            <div className="prj-media-glow" />
                        </div>

                        <div className="prj-content">
                            <h3 className="prj-title">{p.title}</h3>
                            <p className="prj-desc">{p.desc}</p>
                            <div className="prj-actions">
                                {p.link ? (
                                    <a className="prj-btn prj-btn--primary" href={p.link} target="_blank" rel="noreferrer noopener">
                                        {p.cta || "Ansehen"} <span className="prj-i prj-i--arrow" aria-hidden="true">↗</span>
                                    </a>
                                ) : (
                                    <span className="prj-badge prj-badge--subtle">Kein Link</span>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
