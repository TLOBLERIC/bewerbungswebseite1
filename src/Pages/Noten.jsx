import React, { useMemo, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Noten() {
    const subjects = useMemo(
        () => [
            { name: "EFZ (Informatik)", labels: ["1.Semester", "2.Semester", "3.Semester", "4.Semester"], values: [4.6, 4.7, 4.8, 5.1] },
            { name: "Französisch", labels: ["1.Semester", "2.Semester", "3.Semester", "4.Semester"], values: [5.2, 5.0, 5.0, 5.0] },
            { name: "Deutsch", labels: ["1.Semester", "2.Semester", "3.Semester", "4.Semester"], values: [4.6, 4.2, 5.0, 4.2] },
            { name: "Englisch", labels: ["1.Semester", "2.Semester", "3.Semester", "4.Semester"], values: [5.0, 4.6, 5.1, 4.9] },
            { name: "Finanz & RW", labels: ["1.Semester", "2.Semester", "3.Semester", "4.Semester"], values: [4.0, 4.3, 5.1, 4.9] },
            { name: "Wirtschaft & Recht", labels: ["1.Semester", "2.Semester", "3.Semester", "4.Semester"], values: [4.6, 3.0, 4.6, 4.0] },
            { name: "Geschichte & Politik", labels: ["1.Semester", "2.Semester", "3.Semester", "4.Semester"], values: [4.8, 5.3, 4.7, 4.7] },
            { name: "Mathematik", labels: ["1.Semester", "2.Semester", "3.Semester", "4.Semester"], values: [3.6, 3.3, 3.7, 4.0] },
            { name: "Technik & Umwelt", labels: [" 3.Semester", "4.Semester"], values: [3.5, 3.0] }
        ],
        []
    );

    const [index, setIndex] = useState(0);
    const [hoverIndex, setHoverIndex] = useState(null);

    const baseThickness = 30;
    const hoverThickness = 50;
    const current = subjects[index];


    useEffect(() => {
        const els = Array.from(document.querySelectorAll(".noten .nt-anim"));
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
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);


    const valueAboveBarPlugin = {
        id: "valueAboveBar",
        afterDatasetsDraw(chart) {
            const { ctx, scales } = chart;
            const meta = chart.getDatasetMeta(0);
            const dataset = chart.data.datasets[0];
            if (!meta || !dataset) return;

            ctx.save();
            ctx.font = "12px Arial";
            ctx.fillStyle = "#002b5c";
            ctx.textAlign = "center";

            dataset.data.forEach((raw, i) => {
                const el = meta.data[i];
                if (!el) return;
                const value = typeof raw === "number" ? raw.toFixed(1) : raw;
                const x = el.x;
                let y = el.y - 8;
                const top = scales.y.top + 12;
                if (y < top) y = top;
                ctx.fillText(String(value), x, y);
            });

            ctx.restore();
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 6, right: 6, bottom: 6, left: 6 } },
        animation: { duration: 220 },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: { label: (ctx) => `Note: ${ctx.parsed.y}` }
            }
        },
        onHover: (_e, elements) => {
            if (elements.length > 0) setHoverIndex(elements[0].index);
            else setHoverIndex(null);
        },
        scales: {
            x: { ticks: { font: { size: 12 } } },
            y: {
                min: 0,
                max: 6.2,
                ticks: { stepSize: 1, font: { size: 12 } },
                grid: { drawBorder: true }
            }
        }
    };

    const data = {
        labels: current.labels,
        datasets: [
            {
                data: current.values,
                backgroundColor: "#004080",
                barThickness: (ctx) =>
                    ctx.dataIndex === hoverIndex ? hoverThickness : baseThickness
            }
        ]
    };

    const prev = () => setIndex((i) => (i - 1 + subjects.length) % subjects.length);
    const next = () => setIndex((i) => (i + 1) % subjects.length);

    return (
        <section className="section noten">
            {/* Titel + Linie (mit Animation) */}
            <h2 className="noten-title nt-anim" style={{ "--delay": "0ms" }}>Noten</h2>
            <div className="section-line section-line-tight nt-anim" style={{ "--delay": "80ms" }}></div>

            {/* Kopfzeile mit Pfeilen + Fachname */}
            <div
                className="nt-anim"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 14,
                    marginBottom: 8,
                    "--delay": "140ms"
                }}
            >
                <button
                    onClick={prev}
                    aria-label="Vorheriges Fach"
                    style={{
                        border: "2px solid #004080",
                        background: "white",
                        color: "#004080",
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontWeight: 700,
                        cursor: "pointer"
                    }}
                >
                    ◀
                </button>

                <div style={{ fontWeight: 800, color: "#002b5c", fontSize: 16 }}>
                    {current.name}
                </div>

                <button
                    onClick={next}
                    aria-label="Nächstes Fach"
                    style={{
                        marginLeft: "auto",
                        border: "2px solid #004080",
                        background: "white",
                        color: "#004080",
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontWeight: 700,
                        cursor: "pointer"
                    }}
                >
                    ▶
                </button>
            </div>

            {/* Chart-Box (mit Animation) */}
            <div
                className="nt-anim"
                style={{
                    height: 260,
                    position: "relative",
                    border: "1px solid rgba(0,64,128,0.15)",
                    borderRadius: 10,
                    padding: 8,
                    "--delay": "220ms"
                }}
            >
                <Bar
                    key={current.name}
                    data={data}
                    options={options}
                    plugins={[valueAboveBarPlugin]}
                />
            </div>

            {/* Pager-Dots (mit Animation) */}
            <div
                className="nt-anim"
                style={{
                    display: "flex",
                    gap: 6,
                    justifyContent: "center",
                    marginTop: 10,
                    flexWrap: "wrap",
                    "--delay": "300ms"
                }}
            >
                {subjects.map((_s, i) => (
                    <span
                        key={_s.name}
                        onClick={() => setIndex(i)}
                        title={_s.name}
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: i === index ? "#004080" : "#c4d7f3",
                            cursor: "pointer"
                        }}
                    />
                ))}
            </div>
        </section>
    );
}

