import React, { useEffect, useRef, useState } from "react";

export default function UeberMich() {
    // Bilder im /public/images ablegen
    const imageFiles = ["handballimage.jpg", "image-11.jpg", "drake.jpg"];
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
                            Ich bin ein mehr­spra­chig auf­ge­wach­se­ner, mo­ti­vier­ter
                            In­for­ma­ti­ker mit dop­pel­ter Staats­bür­ger­schaft (Ka­na­da &
                            Schweiz). Ne­ben sehr gu­ten Kennt­nis­sen in Eng­lisch, Deutsch und
                            Fran­zö­sisch brin­ge ich In­for­ma­tik-Know-how, ein selbst­be­wuss­tes
                            Auf­tre­ten und ei­nen po­si­ti­ven Cha­rak­ter mit. Ei­ni­ge
                            <strong>Schwä­chen</strong> ha­be ich in der Selbst­re­fle­xi­on – die
                            möch­te ich in ei­nem Prak­ti­kum ge­zielt ver­bes­sern.
                        </p>
                        <p>
                            Ge­bo­ren mit ei­ner or­dent­li­chen Por­ti­on Neu­gier pro­bie­re ich gern
                            neue Tools, Frame­works und Kon­zep­te aus. So fin­de ich schnell
                            her­aus, was in der Pra­xis wirk­lich trägt – und was nur Buzz­word
                            ist.
                        </p>
                        <p>Im Team schät­ze ich kla­re Kom­mu­ni­ka­ti­on, Zu­sam­men­halt,
                            Pro­blem­lö­sung und Spaß.</p>
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
                        Hand­ball ist für mich Tem­po, Team­geist und Ti­ming. Auf dem Feld
                        trai­nie­re ich Fo­kus, Kom­mu­ni­ka­ti­on und An­ti­zi­pa­ti­on – Skills, die
                        auch in Pro­jek­ten wert­voll sind: <em>kla­re Ab­spra­chen, sau­be­re
                        Spiel­zü­ge (Ar­chi­tek­tur) und gu­tes Ti­ming</em>. Ge­star­tet als
                        4-Jäh­ri­ger beim PSG Lyss, heu­te in der 1. Mann­schaft und U19.
                        Mein äl­te­rer Bru­der spielt eben­falls Hand­ball, je­doch bei Ott­mar
                        St. Gal­len in der höchs­ten Li­ga der Schweiz; zu­dem ist er selbst auch
                        ein aus­ge­bil­de­ter In­for­ma­ti­ker.
                    </p>
                    <p>
                        Ich spie­le meist im Rück­raum, ar­bei­te gern an tak­ti­schen Ab­läu­fen
                        und lie­be es, wenn ein Spiel­zug auf­geht wie ge­plant.
                    </p>
                </article>

                <aside className="um-video-wrap um-anim" style={{ "--delay": "220ms" }}>
                    <div className="um-video-card um-portrait">
                        <video
                            className="um-video"
                            src="/videos/handballvideo2.mp4"
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