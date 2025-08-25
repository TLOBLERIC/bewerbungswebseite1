// server/server.js  (ESM, für Vercel Serverless)
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// --- Pfade & ENV ---
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// PDFs liegen standardmäßig in server/private_docs
const DOCS_DIR = path.join(__dirname, "documents"); // statt "private_docs"

const {
    NODE_ENV = "production",
    FRONTEND_ORIGIN,                 // z.B. https://loictobler.ch
    VALID_USERNAME,
    VALID_PASSWORD,
    SECRET_KEY,
    JWT_EXPIRES_IN = "1h"
} = process.env;

// --- App & Middleware ---
const app = express();
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// CORS nur setzen, wenn du von einer anderen Origin zugreifst.
// Wenn Frontend & Backend über dieselbe Domain laufen, ist CORS nicht nötig.
if (FRONTEND_ORIGIN) {
    app.use(
        cors({
            origin: FRONTEND_ORIGIN,
            methods: ["GET", "POST", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            exposedHeaders: ["Content-Disposition"],
        })
    );
}

// --- Helpers ---
function makeToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
}

function auth(req, res, next) {
    try {
        let token = null;
        const hdr = req.headers.authorization || "";
        if (hdr.startsWith("Bearer ")) token = hdr.slice(7);
        if (!token && req.query?.token) token = req.query.token;

        if (!token) return res.status(403).json({ message: "Kein Token" });
        jwt.verify(token, SECRET_KEY);
        next();
    } catch {
        res.status(403).json({ message: "Ungültiges oder abgelaufenes Token" });
    }
}

function safeJoin(base, target) {
    const p = path.normalize(path.join(base, target));
    if (!p.startsWith(base + path.sep) && p !== base) return null;
    return p;
}

// --- Routes ---
app.get("/api/health", async (_req, res) => {
    const exists = fs.existsSync(DOCS_DIR);
    let files = [];
    if (exists) {
        try { files = await fsp.readdir(DOCS_DIR); } catch {}
    }
    res.json({ ok: true, env: NODE_ENV, docsDir: exists, files });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body || {};
    if (!VALID_USERNAME || !VALID_PASSWORD || !SECRET_KEY) {
        return res.status(500).json({ message: "ENV Variablen fehlen" });
    }
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        const token = makeToken({ sub: username });
        return res.json({ token, expiresIn: JWT_EXPIRES_IN });
    }
    return res.status(401).json({ message: "Falsche Login-Daten" });
});

app.get("/api/dokumente", auth, async (_req, res) => {
    try {
        if (!fs.existsSync(DOCS_DIR)) return res.json({ files: [] });
        const files = (await fsp.readdir(DOCS_DIR))
            .filter((n) => path.extname(n).toLowerCase() === ".pdf");

        const payload = files.map((name) => ({
            name,
            viewUrl: `/api/view/${encodeURIComponent(name)}`,
            url:     `/api/download/${encodeURIComponent(name)}`
        }));
        res.json({ files: payload });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Dateien konnten nicht gelesen werden" });
    }
});

app.get("/api/view/:filename", auth, (req, res) => {
    const abs = safeJoin(DOCS_DIR, req.params.filename);
    if (!abs) return res.status(400).json({ message: "Ungültiger Pfad" });
    if (!fs.existsSync(abs)) return res.status(404).json({ message: "Datei nicht gefunden" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${path.basename(abs)}"`);
    res.sendFile(abs);
});

app.get("/api/download/:filename", auth, (req, res) => {
    const abs = safeJoin(DOCS_DIR, req.params.filename);
    if (!abs) return res.status(400).json({ message: "Ungültiger Pfad" });
    if (!fs.existsSync(abs)) return res.status(404).json({ message: "Datei nicht gefunden" });
    res.download(abs, path.basename(abs));
});

// WICHTIG für Vercel Serverless:
export default app;
