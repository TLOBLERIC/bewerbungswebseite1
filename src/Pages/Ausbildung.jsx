// src/Pages/Ausbildung.jsx
import React, { useEffect } from "react";
import {
    FaSchool,
    FaLaptopCode,
    FaGraduationCap,
    FaUniversity,
    FaChalkboardTeacher
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
            image: "/images/kirchenfeld.jpg"
        },
        {
            year: "2018 – 2020",
            title: "Primarschule II",
            description:
                "2018 wechselte meine ganze Primarschulklasse in ein anderes Schulhaus, das Herrengasse Schulhaus in Lyss.",
            icon: <FaChalkboardTeacher />,
            image: "/images/herrengasse.jpg"
        },
        {
            year: "2020 – 2023",
            title: "Sekundarschule",
            description:
                "Zurück im Kirchenfeld Schulhaus, musste ich mich in einer neuen Klasse zurecht finden, dank meiner offenheit, ging dies einfacher als gedacht.",
            icon: <FaLaptopCode />,
            image: "/images/kirchenfeld.jpg"
        },
        {
            year: "2023 - Heute",
            title: "BWD Bern",
            description:
                "Nach meiner Sekundarstufenzeit, wurde ich auf der BWD Bern als IMS Schüler aufgenommen, auf dieser Schule lernte ich neue Fächer kennen und konnte meine Sprachkenntnisse weiterentwickeln. ",
            icon: <FaUniversity />,
            image: "/images/BWD.jpg"
        },
        {
            year: "2023 - Heute",
            title: "GIBB ",
            description:
                "Neben der BWD, besuche ich die GIBB an der Lorrainestrasse in Bern, auf diesere Schule, durfte ich mein interesse an der Informatik, das erste mal richtig ausleben. ",
            icon: <FaGraduationCap />,
            image: "/images/gibb.webp"
        }
    ];

    // EXAKT wie bei Projects / Über mich: Observer, .in-view, --delay
    useEffect(() => {
        const nodes = Array.from(
            document.querySelectorAll(
                ".ausbildung .ausb-anim, .ausbildung .timeline-item"
            )
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
        <section className="section ausbildung">
            <div className="projects-hero ausb-anim" style={{ "--delay": "0ms" }}>
                <h1 className="projects-title">Meine Ausbildung</h1>
                <div className="section-line section-line-tight"></div>
            </div>

            <div className="timeline">
                {timeline.map((item, index) => (
                    <div
                        key={index}
                        className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
                        style={{ "--delay": `${(index + 1) * 120}ms` }}
                    >
                        <div className="timeline-icon">{item.icon}</div>
                        <div className="timeline-content">
                            <span className="timeline-year">{item.year}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <img src={item.image} alt={item.title} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
