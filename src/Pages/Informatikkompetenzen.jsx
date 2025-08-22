import React, { useEffect, useRef } from "react";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Title
} from "chart.js";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Title
);

export default function Informatikkompetenzen() {
    const labels = ["JavaScript", "Node.js", "React", "MongoDB", "Azure", "Html", "CSharp"];
    const values = [65, 50, 65, 55, 70, 75, 35];

    const radarData = {
        labels,
        datasets: [
            {
                label: "Kompetenzen (%)",
                data: values,
                borderColor: "#004080",
                backgroundColor: "rgba(0, 64, 128, 0.2)",
                pointBackgroundColor: "#004080",
                pointBorderColor: "#004080",
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 6,
            },
        ],
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: "easeOutQuart" },
        plugins: { legend: { display: false }, title: { display: false } },
        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: { stepSize: 20, showLabelBackdrop: false, color: "#002b5c" },
                angleLines: { color: "rgba(0, 64, 128, 0.25)" },
                grid: { color: "rgba(0, 64, 128, 0.18)" },
                pointLabels: { color: "#002b5c", font: { size: 12 } }
            }
        }
    };

    const items = [
        { key: "js", title: "JavaScript", desc: "Frontend-Logik & Interaktion.", badge: "JS" },
        { key: "node", title: "Node.js", desc: "APIs & Serverlogik.", badge: "Node" },
        { key: "react", title: "React", desc: "Komponenten & Hooks.", badge: "React" },
        { key: "mongo", title: "MongoDB", desc: "Dokumenten-Datenbank.", badge: "MDB" },
        { key: "azure", title: "Azure", desc: "Cloud-Deployments.", badge: "AZ" },
        { key: "html", title: "Html", desc: "Cloud-Deployments.", badge: "HTML" },
        { key: "csharp", title: "CSharp", desc: "Cloud-Deployments.", badge: "C#" }
    ];

    const Badge = ({ text }) => (
        <div
            style={{
                width: 44,
                height: 44,
                borderRadius: "9999px",
                background: "#004080",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
            }}
            aria-hidden="true"
        >
            {text}
        </div>
    );

    // Animation on scroll
    const sectionRef = useRef(null);
    useEffect(() => {
        const root = sectionRef.current;
        if (!root) return;

        const cards = root.querySelectorAll(".kompetenzen-card");

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        cards.forEach((card, idx) => {
            card.style.setProperty("--delay", `${idx * 120}ms`);
            io.observe(card);
        });

        return () => io.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="kompetenzen" className="kompetenzen-section">
            <div className="section-header">
                <h2>Informatikkompetenzen</h2>
                <div className="section-line"></div>
            </div>

            <div className="kompetenzen-content">
                {/* Radar Chart */}
                <div className="kompetenzen-chart">
                    <Radar data={radarData} options={radarOptions} />
                </div>

                {/* Grid mit Skills */}
                <div className="kompetenzen-grid">
                    {items.map((it, idx) => (
                        <div key={it.key} className="kompetenzen-card">
                            <Badge text={it.badge} />
                            <div style={{ display: "grid", gap: 2 }}>
                                <div className="kompetenzen-title">{it.title}</div>
                                <div className="kompetenzen-desc">{it.desc}</div>
                                <div className="kompetenzen-percent">{values[idx]}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
