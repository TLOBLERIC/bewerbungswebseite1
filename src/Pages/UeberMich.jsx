import React, { useEffect, useRef, useState } from "react";

export default function UeberMich() {

    const imageFiles = ["image-13.jpg","image-11.jpg","drake.jpg"];
    const images = imageFiles.map(f => `/images/${f}`);


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
                            Ich bin ein mehrsprachig aufgewachsener, motivierter Informatiker mit
                            doppelter Staatsbürgerschaft (Kanada & Schweiz). Neben sehr guten
                            Kenntnissen in Englisch, Deutsch und Französisch bringe ich
                            Informatik-Know-how, ein selbstbewusstes Auftreten und einen
                            positiven Charakter mit. Einige <strong>Schwächen</strong> habe ich in der
                            Selbstreflexion – die möchte ich in einem Praktikum gezielt verbessern.
                        </p>
                        <p>
                            Geboren mit einer ordentlichen Portion Neugier probiere ich gern neue
                            Tools, Frameworks und Konzepte aus. So finde ich schnell heraus, was in
                            der Praxis wirklich trägt – und was nur Buzzword ist.
                        </p>
                        <p>
                            Im Team schätze ich klare Kommunikation, Zusammenhalt, Problemlösung
                            und Spaß.
                        </p>
                    </div>
                </div>

                {/* Bildsequenz rechts */}
                <div
                    className="um-col um-media um-photo hover-tilt um-anim"
                    style={{ "--delay": "260ms" }}
                    onMouseEnter={startSequence}
                    onMouseLeave={stopSequence}
                    onTouchStart={startSequence}
                    onTouchEnd={stopSequence}
                    aria-label="Bildsequenz – bewegt sich beim Darüberfahren/Antippen"
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
                        Gestartet als 4 Jähriger beim PSG Lyss bei den Minis, bis jetzt als 17 Jähriger in der 1. Mannschaft und in der u 19, weiterhin beim PSG Lyss.
                        Zum Handball spielen kam ich durch meine Familie, schon mein Grossvater, spielte damals Handball(Feldhandball). Mein Vater und mein Bruder machten es ihm gleich nach, zurzeit spielt mein Bruder bei Ottmar St.Gallen in der höchsten Liga der Schweiz.
                    </p>
                    <p>
                        Ich spiele meist im Rückraum, arbeite gern an taktischen Abläufen und liebe es, wenn
                        ein Spielzug aufgeht wie geplant.
                    </p>
                </div>

                <div className="um-video um-video--landscape um-anim" style={{ "--delay": "420ms" }}>
                    {/* Lege die Datei in public/videos/handballvideo.mp4 */}
                    <video
                        src="/videos/handballvideo.mp4"
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
