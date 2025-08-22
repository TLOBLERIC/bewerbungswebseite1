import React, { useEffect, useRef, useState } from "react";

export default function UeberMich() {
    const images = [

        "/src/images/Image (8).jpg",
        "/src/images/Image (11).jpg",
        "/src/images/Drake.jpg"
    ];
    const [frame, setFrame] = useState(0);
    const timerRef = useRef(null);

    // Bildsequenz Hover
    const startSequence = () => {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => {
            setFrame((f) => (f + 1) % images.length);
        }, 900);
    };
    const stopSequence = () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setFrame(0);
    };
    useEffect(() => () => clearInterval(timerRef.current), []);

    // Scroll-In Animation (wie bei Kompetenzen/Noten/Projects)
    useEffect(() => {
        const nodes = Array.from(
            document.querySelectorAll(".uebermich-section .um-anim")
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

        nodes.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <section id="ueber-mich" className="uebermich-section">
            {/* Titel + Line mit Animation */}
            <div className="section-header">
                <h2 className="um-anim" style={{ "--delay": "0ms" }}>Über mich</h2>
                <div className="section-line um-anim" style={{ "--delay": "90ms" }}></div>
            </div>

            {/* Zweispaltiges Layout */}
            <div className="um-row">
                {/* Text links */}
                <div className="um-col um-anim" style={{ "--delay": "160ms" }}>
                    <h1 className="um-intro-title">Hallo, ich bin Loic!</h1>
                    <div className="um-prose">
                        <p className="um-lead">
                           Ich bin ein Mehrsprachig aufgewachsener, motivierender Informatiker, mit einer Doppelten Staatsbürgerschaft in Kanada und der Schweiz.
                           Neben meinen hohen Kenntnissen in der Englischen, Deutscher und Französicher Sprache bringe ich einige Infromatikkenntnisse, die ich gerne Erweitern möchte, ein Selbstbeweusstes auftreten und einen aufregenden Charakter mit.
                            Einige <strong>schwächen</strong> habe ich in der Selbstreflexion, die ich gerne mit einem Praktikum verbessern möchte.
                        </p>
                        <p>
                            Geboren mit einer ordentlichen Portion Neugier, probiere ich gern neue
                            Tools, Frameworks und Konzepte aus. So finde ich schnell heraus, was in
                            der Praxis wirklich trägt – und was nur Buzzword ist.
                        </p>
                        <p>
                           Im Team schätze ich klare Kommunikation, zusammenhalt, problemlösung und Spass.
                        </p>
                    </div>
                </div>

                {/* Bildsequenz rechts */}
                <div
                    className="um-col um-media um-photo hover-tilt um-anim"
                    style={{ "--delay": "260ms" }}
                    onMouseEnter={startSequence}
                    onMouseLeave={stopSequence}
                    aria-label="Bildsequenz – bewegt sich beim Darüberfahren"
                >
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
                        <div className="um-seq-hint"></div>
                    </div>
                </div>
            </div>

            {/* Hobby: Handball */}
            <div className="um-row um-split">
                <div className="um-col um-prose um-anim" style={{ "--delay": "360ms" }}>
                    <h3>Hobby: Handball</h3>
                    <p>
                        Handball ist für mich Tempo, Teamgeist und Timing. Auf dem Feld trainiere ich
                        Fokus, Kommunikation und Antizipation – Skills, die auch in Projekten wertvoll sind:
                        <em> klare Absprachen, saubere Spielzüge (Architektur) und gutes Timing</em>.
                    </p>
                    <p>
                        Ich spiele meist im Rückraum, arbeite gern an taktischen Abläufen und liebe es, wenn
                        ein Spielzug aufgeht wie geplant.
                    </p>
                </div>

                <div className="um-video um-video--landscape">
                    <video
                        src="/src/images/handballvideo.mp4"
                        controls
                        className="um-video-el rotate-left"
                        playsInline
                    />
                    <div className="um-video-badge">Highlights</div>
                </div>

            </div>

        </section>
    );
}
