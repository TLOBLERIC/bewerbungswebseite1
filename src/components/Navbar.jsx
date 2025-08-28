
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState("#ueber-mich");
    const location = useLocation();

    // Scroll-Shadow
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 6);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Aktiven Link bestimmen (Hash/Route)
    useEffect(() => {
        const setFromHash = () => {
            const h = window.location.hash || "#ueber-mich";
            setActive(h);
        };
        setFromHash();
        window.addEventListener("hashchange", setFromHash);
        return () => window.removeEventListener("hashchange", setFromHash);
    }, [location.pathname]);

    const closeMobile = () => setOpen(false);

    const NavA = ({ href, children }) => (
        <a
            className={`nav-link ${active === href ? "is-active" : ""}`}
            href={href}
            onClick={closeMobile}
        >
            <span>{children}</span>
            <i aria-hidden="true" />
        </a>
    );

    const NavLinkRoute = ({ to, children }) => (
        <Link
            className={`nav-link route ${location.pathname === to ? "is-active" : ""}`}
            to={to}
            onClick={closeMobile}
        >
            <span>{children}</span>
            <i aria-hidden="true" />
        </Link>
    );

    return (
        <header className={`nav-wrap ${scrolled ? "is-scrolled" : ""}`}>
            <nav className="navbar-pro">
                {/* Logo */}
                <a className="brand" href="/#ueber-mich" onClick={closeMobile} aria-label="Start">
                    <div className="brand-mark" aria-hidden="true">LT</div>
                    <div className="brand-text">
                        <strong>Loïc</strong> Tobler
                    </div>
                </a>

                {/* Desktop Links */}
                <ul className="nav-list">
                    <li><NavA href="/#ueber-mich">Über mich</NavA></li>
                    <li><NavA href="/#projects">Projects</NavA></li>
                    <li><NavA href="/#kompetenzen">Informatikkompetenzen</NavA></li>
                    <li><NavA href="/#noten">Noten</NavA></li>
                    <li className="divider" aria-hidden="true" />
                    <li><NavLinkRoute to="/dokumente">Dokumente</NavLinkRoute></li>
                </ul>

                {/* Burger */}
                <button
                    className={`burger ${open ? "is-open" : ""}`}
                    onClick={() => setOpen(v => !v)}
                    aria-label="Menü umschalten"
                    aria-expanded={open}
                    aria-controls="mobile-drawer"
                    type="button"
                >
                    <span /><span /><span />
                </button>

                {/* Mobile Drawer */}
                <div id="mobile-drawer" className={`drawer ${open ? "open" : ""}`}>
                    <div className="drawer-inner">
                        <NavA href="/#ueber-mich">Über mich</NavA>
                        <NavA href="/#projects">Projects</NavA>
                        <NavA href="/#kompetenzen">Informatikkompetenzen</NavA>
                        <NavA href="/#noten">Noten</NavA>
                        <NavLinkRoute to="/dokumente">Dokumente</NavLinkRoute>
                    </div>
                </div>

                {/* Backdrop für Drawer */}
                <button
                    className={`backdrop ${open ? "show" : ""}`}
                    onClick={closeMobile}
                    aria-label="Menü schließen"
                />
            </nav>
        </header>
    );
}
