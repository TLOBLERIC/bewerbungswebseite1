// src/Pages/Ausbildung.jsx
import React, { useEffect, useMemo } from "react";
import {
    FaSchool,
    FaLaptopCode,
    FaGraduationCap,
    FaUniversity,
    FaChalkboardTeacher,
} from "react-icons/fa";
import "../App.css";

export default function Ausbildung() {

    const timeline = [
        {
            year: "2014 – 2018",
            title: "Primarschule I",
            description:
                "2014 wurde ich in die Kirchenfeld Schule am Lyssbach eingeschult.",
            icon: <FaSchool />,
            image: "/images/kirchenfeld.jpg",
        },
        {
            year: "2018 – 2020",
            title: "Primarschule II",
            description:
                "2018 wechselte meine ganze Primarschulklasse in ein anderes Schulhaus, das Herrengasse Schulhaus in Lyss.",
            icon: <FaChalkboardTeacher />,
            image: "/images/herrengasse.jpg",
        },
        {
            year: "2020 – 2023",
            title: "Sekundarschule",
            description:
                "Umzug in eine neue Klasse. Ich musste mich mit neuen Schulkameraden zurechtfinden, dank meiner Offenheit ging dies einfacher als gedacht.",
            icon: <FaLaptopCode />,
            image: "/images/kirchenfeld.jpg",
        },
        {
            year: "2023 – Heute",
            title: "BWD Bern",
            description:
                "Nach meiner Sekundarstufenzeit wurde ich an der BWD Bern als IMS-Schüler aufgenommen. Dort lernte ich neue Fächer kennen und konnte meine Sprachkenntnisse weiterentwickeln.",
            icon: <FaUniversity />,
            image: "/images/BWD.jpg",
            current: true, // ✅ aktuell
        },
        {
            year: "2023 – Heute",
            title: "GIBB",
            description:
                "Neben der BWD besuche ich die GIBB an der Lorrainestrasse in Bern. Hier konnte ich mein Interesse an der Informatik zum ersten Mal richtig ausleben.",
            icon: <FaGraduationCap />,
            image: "/images/gibb.webp",
            current: true, // ✅ aktuell
        },
    ];

    // Neu: aktuell(e) Station(en) zuerst
    const items = useMemo(() => {
        const cur = timeline.filter((t) => t.current);
        const past = timeline.filter((t) => !t.current).reverse(); // neueste zuerst
        return [...cur, ...past];
    }, [timeline]);

    // Scroll-Reveal (staggered)
    useEffect(() => {
        const nodes = Array.from(
            document.querySelectorAll(".edu .tl-anim, .edu .tl-item")
        );
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

        nodes.forEach((el, i) => {
            el.style.setProperty("--delay", `${i * 120}ms`);
            io.observe(el);
        });

        return () => io.disconnect();
    }, []);

    return (
        <section className="section edu">
            {/* Hero / Heading */}
            <div className="edu-hero tl-anim" style={{ "--delay": "0ms" }}>
                <h1 className="edu-title">Meine Ausbildung</h1>
                <p className="edu-sub">
                    Von heute zurück in die Vergangenheit – Stationen, die mich geprägt
                    haben.
                </p>
                <div className="edu-line" aria-hidden />
            </div>

            {/* Timeline */}
            <div className="tl">
                <div className="tl-line" aria-hidden />
                {items.map((item, i) => (
                    <article
                        key={`${item.title}-${i}`}
                        className={`tl-item tl-anim ${item.current ? "is-current" : ""} ${
                            i % 2 ? "right" : "left"
                        }`}
                        style={{ "--delay": `${(i + 1) * 120}ms` }}
                    >
                        {/* Node */}
                        <div className="tl-node" aria-hidden>
                            <span className="tl-node-inner">{item.icon}</span>
                        </div>

                        {/* Card */}
                        <div className="tl-card">
                            <header className="tl-meta">
                                <span className="tl-year">{item.year}</span>
                                {item.current && <span className="tl-badge">Aktuell</span>}
                            </header>

                            <h3 className="tl-title">{item.title}</h3>
                            <p className="tl-desc">{item.description}</p>

                            {item.image && (
                                <div className="tl-media hover-tilt">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

