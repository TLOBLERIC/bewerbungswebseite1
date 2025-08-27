import React, { useEffect, useRef, useState } from "react";

export default function UeberMich() {
    // Bilder im /public/images ablegen
    const imageFiles = ["image-13.jpg", "image-11.jpg", "drake.jpg"];
    const images = imageFiles.map((f) => `/images/${f}`);

    const [frame, setFrame] = useState(0);
    const timerRef = useRef(null);

    // Bildsequenz Hover/Touch
    const startSequence = () => {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => {
            setFrame((f) => (f + 1) % images.length);
        }, 900);
    };

    const stopSequence = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setFrame(0);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Scroll-Reveal (wie bei dir)
    useEffect(() => {
        const nodes = Array.from(
            document.querySelectorAll(".uebermich-section .um-anim")
        );
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("in-view");
                        io.unobserve(e.target);
                    }
                });
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
        );
        nodes.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <section id="ueber-mich" className="uebermich-section section">
            {/* Section Intro */}
            <header className="um-header um-anim" style={{ "--delay": "0ms" }}>
                <p className="um-kicker">Kurz vorgestellt</p>
                <h2 className="um-title">
                    Über <span>mich</span>
                </h2>
                <div className="um-divider" />
                <p className="um-sub">
                    Wer ich bin, wie ich arbeite – und was mich antreibt.
                </p>
            </header>

            {/* Grid */}
            <div className="um-grid">
                {/* Text */}
                <article className="um-col um-anim" style={{ "--delay": "120ms" }}>
                    <h3 className="um-intro">Hallo, ich bin Loïc!</h3>
                    <div className="um-prose">
                        <p className="um-lead">
                            Ich bin ein mehrsprachig aufgewachsener, motivierter
                            Informatiker mit doppelter Staatsbürgerschaft (Kanada &amp;
                            Schweiz). Neben sehr guten Kenntnissen in Englisch, Deutsch und
                            Französisch bringe ich Informatik-Know-how, ein selbstbewusstes
                            Auftreten und einen positiven Charakter mit. Einige{" "}
                            <strong>Schwächen</strong> habe ich in der Selbstreflexion – die
                            möchte ich in einem Praktikum gezielt verbessern.
                        </p>
                        <p>
                            Geboren mit einer ordentlichen Portion Neugier probiere ich gern
                            neue Tools, Frameworks und Konzepte aus. So finde ich schnell
                            heraus, was in der Praxis wirklich trägt – und was nur Buzzword
                            ist.
                        </p>
                        <p>Im Team schätze ich klare Kommunikation, Zusammenhalt,
                            Problemlösung und Spaß.</p>
                    </div>

                    {/* kleine Badges */}
                    <ul className="um-badges um-anim" style={{ "--delay": "220ms" }}>
                        <li>DE/EN/FR</li>
                        <li>Frontend&nbsp;&amp;&nbsp;.NET Basics</li>
                        <li>Teamfirst</li>
                    </ul>
                </article>

                {/* Bild / Sequenz */}
                <figure
                    className="um-media um-anim"
                    style={{ "--delay": "220ms" }}
                    onMouseEnter={startSequence}
                    onMouseLeave={stopSequence}
                    onTouchStart={startSequence}
                    onTouchEnd={stopSequence}
                    aria-label="Bildsequenz – bewegt sich beim Hover/Touch"
                >
                    <div className="um-frame um-portrait">
                        <div className="um-sequence">
                            {images.map((src, i) => (
                                <img
                                    key={src}
                                    src={src}
                                    alt={`Sequenzbild ${i + 1}`}
                                    className={`um-seq-img ${i === frame ? "is-active" : ""}`}
                                    draggable="false"
                                />
                            ))}
                        </div>
                    </div>
                    <figcaption className="um-hint">hover / tap</figcaption>
                </figure>
            </div>

            {/* Handball */}
            <div className="um-grid um-split">
                <article className="um-col um-anim" style={{ "--delay": "140ms" }}>
                    <h3 className="um-section-h3">Hobby: Handball</h3>
                    <p>
                        Handball ist für mich Tempo, Teamgeist und Timing. Auf dem Feld
                        trainiere ich Fokus, Kommunikation und Antizipation – Skills, die
                        auch in Projekten wertvoll sind: <em>klare Absprachen, saubere
                        Spielzüge (Architektur) und gutes Timing</em>. Gestartet als
                        4-Jähriger beim PSG Lyss, heute in der 1. Mannschaft und U19.
                    </p>
                    <p>
                        Ich spiele meist im Rückraum, arbeite gern an taktischen Abläufen
                        und liebe es, wenn ein Spielzug aufgeht wie geplant.
                    </p>
                </article>

                <aside className="um-video-wrap um-anim" style={{ "--delay": "220ms" }}>
                    <div className="um-video-card um-portrait">
                        <video
                            className="um-video"
                            src="/videos/handballvideo.mp4"
                            controls
                            playsInline
                            preload="metadata"
                            poster="/images/handball-poster.jpg"
                        />
                        <span className="um-badge-float">Highlights</span>
                    </div>
                </aside>
            </div>
        </section>
    );
}
