import React, { useEffect, useRef, useState } from "react";
import "../App.css";

export default function Footer() {
    const [open, setOpen] = useState(false);
    const dialogRef = useRef(null);

    // Body-Scroll sperren + ESC schließen + Fokus setzen
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        if (open) {
            document.body.style.overflow = "hidden";
            dialogRef.current?.focus();
            window.addEventListener("keydown", onKey);
        }
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const ORG = {
        name: "Loic Tobler",
        street: "—",
        zipCity: "—",
        email: "tobler.loic@tutamail.com",
        phone: "+41 76 539 31 57",
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Linke Spalte – Kontaktdaten & Social */}
                <div className="footer-left">
                    <h3>Kontakt</h3>
                    <p>{ORG.name}</p>
                    <p>
                        Email: <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
                    </p>
                    <p>
                        Tel: <a href={`tel:${ORG.phone.replace(/\s+/g, "")}`}>{ORG.phone}</a>
                    </p>

                    <div className="footer-social">
                        <a href="https://github.com/TLOBLERIC" target="_blank" rel="noreferrer" aria-label="GitHub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--mid)" viewBox="0 0 24 24">
                                <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.29 3.438 9.77 8.207 11.36.6.11.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.774.418-1.305.762-1.604-2.665-.304-5.466-1.332-5.466-5.932 0-1.31.47-2.382 1.236-3.222-.124-.303-.536-1.523.118-3.176 0 0 1.008-.323 3.3 1.23a11.51 11.51 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.553 3.297-1.23 3.297-1.23.656 1.653.244 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.805 5.625-5.476 5.922.43.37.823 1.102.823 2.222 0 1.604-.014 2.898-.014 3.293 0 .32.19.694.8.576C20.565 22.267 24 17.79 24 12.5 24 5.87 18.627.5 12 .5z"/>
                            </svg>
                        </a>
                        <a href="https://linkedin.com/in/deinusername" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--mid)" viewBox="0 0 24 24">
                                <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zm-11 20H5V9h3v11zM6.5 7.5C5.1 7.5 4 6.4 4 5s1.1-2.5 2.5-2.5S9 3.6 9 5s-1.1 2.5-2.5 2.5zM20 20h-3v-5.5c0-1.3-.5-2.2-1.8-2.2-1 0-1.6.7-1.9 1.4-.1.2-.1.5-.1.8V20h-3s.1-9 0-11h3v1.6c.4-.6 1.2-1.5 3-1.5 2.2 0 3.8 1.4 3.8 4.3V20z"/>
                            </svg>
                        </a>
                        <a href="https://instagram.com/loic_tob" target="_blank" rel="noreferrer" aria-label="Instagram"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--mid)" viewBox="0 0 24 24"> <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .2 2.5.4.6.2 1 .4 1.5.9.5.5.7.9.9 1.5.2.5.3 1.3.4 2.5.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 2-.4 2.5-.2.6-.4 1-.9 1.5-.5.5-.9.7-1.5.9-.5.2-1.3.3-2.5.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.2-2.5-.4-.6-.2-1-.4-1.5-.9-.5-.5-.7-.9-.9-1.5-.2-.5-.3-1.3-.4-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-2 .4-2.5.2-.6.4-1 .9-1.5.5-.5.9-.7 1.5-.9.5-.2 1.3-.3 2.5-.4C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7.1.1 5.8.2 4.9.4 4.2.6c-.8.3-1.5.7-2.1 1.3-.6.6-1 1.3-1.3 2.1-.2.7-.4 1.6-.5 2.9C.1 8.3 0 8.7 0 12s.1 3.7.2 4.9c.1 1.3.3 2.2.5 2.9.3.8.7 1.5 1.3 2.1.6.6 1.3 1 2.1 1.3.7.2 1.6.4 2.9.5 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.2-.3 2.9-.5.8-.3 1.5-.7 2.1-1.3.6-.6 1-1.3 1.3-2.1.2-.7.4-1.6.5-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.2-.5-2.9-.3-.8-.7-1.5-1.3-2.1-.6-.6-1.3-1-2.1-1.3-.7-.2-1.6-.4-2.9-.5C15.7.1 15.3 0 12 0z"/> <path d="M12 5.8A6.2 6.2 0 1 0 12 18.2 6.2 6.2 0 1 0 12 5.8zm0 10.2A4 4 0 1 1 12 8a4 4 0 0 1 0 8zM18.4 4.6a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 1 0 0-2.88z"/> </svg> </a>
                    </div>
                </div>

                {/* Rechte Spalte – Impressum */}
                <div className="footer-right">
                    <button className="impressum-btn" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
                        Impressum
                    </button>
                </div>
            </div>

            {/* Modal */}
            {open && (
                <div
                    className="imp-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="imp-title"
                    onClick={(e) => e.target.classList.contains("imp-overlay") && setOpen(false)}
                >
                    <div className="imp-dialog" tabIndex={-1} ref={dialogRef}>
                        <button className="imp-close" onClick={() => setOpen(false)} aria-label="Impressum schließen">×</button>

                        <h2 id="imp-title">Impressum</h2>

                        <section className="imp-section">
                            <h3>Anbieter</h3>
                            <p>
                                {ORG.name}<br />
                                {ORG.street}<br />
                                {ORG.zipCity}
                            </p>
                            <p>
                                E-Mail: <a href={`mailto:${ORG.email}`}>{ORG.email}</a><br />
                                Tel: <a href={`tel:${ORG.phone.replace(/\s+/g, "")}`}>{ORG.phone}</a>
                            </p>
                        </section>

                        <section className="imp-section">
                            <h3>Verantwortlich für den Inhalt</h3>
                            <p>{ORG.name}</p>
                        </section>

                        <section className="imp-section">
                            <h3>Haftungsausschluss</h3>
                            <p>
                                Der Inhalt dieser Webseite wurde sorgfältig recherchiert und überprüft.
                                Dennoch übernehmen wir keine Gewähr für Richtigkeit, Vollständigkeit und Aktualität.
                                Haftungsansprüche aufgrund der Nutzung oder Nichtnutzung der Informationen sind ausgeschlossen.
                            </p>
                        </section>

                        <section className="imp-section">
                            <h3>Urheberrecht</h3>
                            <p>
                                Alle Inhalte (Texte, Bilder, Grafiken, Layout) sind urheberrechtlich geschützt.
                                Jede Verwertung bedarf der vorherigen schriftlichen Zustimmung der Rechteinhaber.
                            </p>
                        </section>

                        <section className="imp-section">
                            <h3>Datenschutz (Kurzfassung)</h3>
                            <p>
                                Personenbezogene Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage genutzt und
                                nicht ohne Einwilligung an Dritte weitergegeben.
                            </p>
                        </section>

                        <p className="imp-meta">Stand: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            )}
        </footer>
    );
}

