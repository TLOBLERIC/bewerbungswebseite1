// src/lib/apiBase.js
const apiBase =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000" // nur lokal, falls du lokal testen willst
        : "";                      // auf Vercel/Domain relativ -> /api/...
export default apiBase;
