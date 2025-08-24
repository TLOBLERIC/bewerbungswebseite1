// src/Pages/Dokumente.jsx
import React, { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/apiBase"; // <-- kleine Helper-Datei: export const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function Dokumente() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const res = await fetch(`${API_BASE}/dokumente`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.status === 403) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }
                if (!res.ok) throw new Error("Fehler beim Laden");
                const data = await res.json();
                setDocs(data.files || []);
            } catch (e) {
                console.error("Fehler beim Laden:", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [navigate]);

    const handleView = (viewUrl) => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        // Backend liefert z.B. viewUrl="/view/Datei.pdf"
        window.open(`${API_BASE}${viewUrl}?token=${encodeURIComponent(token)}`, "_blank", "noopener,noreferrer");
    };

    const handleDownload = async (fileUrl, filename) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}${fileUrl}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return alert("Download fehlgeschlagen");
            const blob = await res.blob();
            saveAs(blob, filename);
        } catch (err) {
            console.error(err);
            alert("Download-Fehler");
        }
    };

    const handleDownloadAll = async () => {
        try {
            const token = localStorage.getItem("token");
            const zip = new JSZip();
            for (const f of docs) {
                const res = await fetch(`${API_BASE}${f.url}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    zip.file(f.name, await res.blob());
                }
            }
            const out = await zip.generateAsync({ type: "blob" });
            saveAs(out, "dokumente.zip");
        } catch (e) {
            console.error(e);
            alert("ZIP konnte nicht erstellt werden");
        }
    };

    return (
        <main className="section docs-section">
            <div className="docs-container">
                <div className="docs-card">
                    <header className="docs-header">
                        <div className="docs-title">
                            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    fill="currentColor"
                                    d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-6-4h-6zM4 6h9v4h7v8H4V6z"
                                />
                            </svg>
                            <h2>Meine Dokumente</h2>
                            <span className="muted">
                ({docs.length} Datei{docs.length === 1 ? "" : "en"})
              </span>
                        </div>

                        <div className="docs-actions">
                            <button className="btn ghost" onClick={() => window.location.reload()}>
                                <span className="i i-refresh" aria-hidden="true" /> Aktualisieren
                            </button>
                            <button className="btn primary" onClick={handleDownloadAll}>
                                <span className="i i-download" aria-hidden="true" /> Alle herunterladen
                            </button>
                        </div>
                    </header>

                    {loading ? (
                        <div className="docs-skeleton">
                            <div className="skeleton-row" />
                            <div className="skeleton-row" />
                            <div className="skeleton-row" />
                        </div>
                    ) : docs.length === 0 ? (
                        <div className="docs-empty">
                            <svg viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M9 2h6l1 2h4a1 1 0 0 1 1 1v2H3V5a1 1 0 0 1 1-1h4l1-2Zm11 6v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8h16ZM8 12h8v2H8v-2Zm0 4h6v2H8v-2Z"
                                />
                            </svg>
                            <h3>Keine Dateien vorhanden</h3>
                            <p className="muted">Sobald Dateien im Backend liegen, erscheinen sie hier.</p>
                        </div>
                    ) : (
                        <ul className="docs-list">
                            {docs.map((f) => (
                                <li key={f.name} className="doc-item">
                                    <div className="doc-left">
                                        <span className="file-badge">PDF</span>
                                        <span className="file-label" title={f.name}>
                      {f.name}
                    </span>
                                    </div>
                                    <div className="doc-buttons">
                                        <button className="btn ghost" onClick={() => handleView(f.viewUrl)}>
                                            <span className="i i-eye" aria-hidden="true" /> Ansehen
                                        </button>
                                        <button className="btn ghost" onClick={() => handleDownload(f.url, f.name)}>
                                            <span className="i i-download" aria-hidden="true" /> Download
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}
