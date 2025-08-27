import React, { useEffect } from "react";

export default function Projects() {
    const projectList = [
        {
            title: "Pacman Game",
            img: "/images/pacman.jpg",
            desc:
                "Mein eigenes Pacman Game, das ich für die Schule mit .Net erstellt habe. Hier habe ich meine ersten Erfahrungen mit C# und .Net gesammelt."
        },
        {
            title: "StundenplanApp",
            img: "/images/stundenplan.png",
            desc:
                "Bei einem Projekt für die Gibb durften wir eine eigene App erstellen. Ich habe mich für eine Stundenplan-App für eine imaginäre Schule entschieden. Das Projekt habe ich mit .NET MAUI (Frontend) und SQLite (Backend) umgesetzt.",
            link: "https://github.com/TLOBLERIC/gibbstundenplan" // <- Ziel-URL
        },
        {
            title: "Haushaltsplanungsapp",
            img: "https://via.placeholder.com/300x200",
            desc:
                "In einem Gruppenprojekt habe ich eine Haushaltsplanungs-App erstellt, damit Familien, WGs oder Einzelhaushalte den Haushalt einfacher planen können."
        },
        {
            title: "Webseite für meinen Handball Verein",
            img: "/images/handballseite.png",
            desc:
                "Auch wenn es nicht zur offiziellen Website meines Handballvereins ausgewählt wurde, konnte ich dadurch einige Erfahrungen mit HTML, CSS und Templates sammeln.",
            link: "https://inf-293-23f-m293user18.iet-gibb.net/Teil2/index.html"
        },
        {
            title: "Bewerbungswebsite Grundidee",
            img:"/images/bewerbungswebseite.png",
            desc:
            "Eine weitere Webseite, die ich für ein GIBB Projekt erstellt habe, hierbei habe ich mich für eine Grundidee meiner Bewerbungswebseite entschieden. Das ganze Projekt wurde mit HTML und CSS erstellt.",
            link: "https://inf-293-23f-m293user18.iet-gibb.net/Teil3/index.html#"
        }
    ];

    // Scroll-in Animation
    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll(".projects .proj-anim"));

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        io.unobserve(entry.target);
                    }
                });
            },
            { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
        );

        nodes.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <section id="projects" className="section projects">
            <div className="projects-hero">
                <h1 className="projects-title proj-anim" style={{ "--delay": "0ms" }}>
                    Projects
                </h1>
                <div
                    className="section-line section-line-tight proj-anim"
                    style={{ "--delay": "90ms" }}
                />
            </div>

            <div className="portfolio-grid">
                {projectList.map((project, index) => {
                    const cardContent = (
                        <>
                            {project.img ? (
                                <img src={project.img} alt={project.title} />
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 200,
                                        display: "grid",
                                        placeItems: "center",
                                        background: "rgba(0,0,0,.05)"
                                    }}
                                >
                                    <span>Kein Bild</span>
                                </div>
                            )}
                            <div className="portfolio-info">
                                <h3>{project.title}</h3>
                                <p>{project.desc}</p>
                            </div>
                        </>
                    );

                    return project.link ? (
                        <a
                            key={index}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-card proj-anim"
                            style={{ "--delay": `${(index + 2) * 120}ms` }}
                        >
                            {cardContent}
                        </a>
                    ) : (
                        <div
                            key={index}
                            className="portfolio-card proj-anim"
                            style={{ "--delay": `${(index + 2) * 120}ms` }}
                        >
                            {cardContent}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

