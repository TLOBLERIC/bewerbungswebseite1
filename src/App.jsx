// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./Hero";
import UeberMich from "./Pages/UeberMich";
import Projects from "./Pages/Projects";
import Informatikkompetenzen from "./Pages/Informatikkompetenzen";
import Noten from "./Pages/Noten";
import Ausbildung from "./Pages/Ausbildung"; // NEU
import Dokumente from "./Pages/Dokumente";
import Login from "./Pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
    return (
        <Router>
            <Navbar />

            {/* Hauptinhalt */}
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Hero />
                            <section id="ueber-mich">
                                <UeberMich />
                            </section>
                            <section id="projects">
                                <Projects />
                            </section>
                            <section id="kompetenzen">
                                <Informatikkompetenzen />
                            </section>
                            <section id="noten">
                                <Noten />
                            </section>
                            <section id="ausbildung">
                                <Ausbildung /> {/* Direkt unter Noten */}
                            </section>
                        </>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dokumente"
                    element={
                        <ProtectedRoute>
                            <Dokumente />
                        </ProtectedRoute>
                    }
                />
                {/* Eigene Route für Ausbildung, falls separat aufrufbar */}
                <Route path="/ausbildung" element={<Ausbildung />} />
            </Routes>

            {/* Footer immer unten */}
            <Footer />
        </Router>
    );
}

