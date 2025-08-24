// api/server.js — Express-App für Vercel (ESM, KEIN app.listen!)
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import compression from "compression";
import morgan from "morgan";
import { fileURLToPath } from "url";

/* --- Pfade & statische Ordner --- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// private_docs liegt im Repo-Root (eine Ebene über /api)
const DOCS_DIR = path.join(__dirname, "..", "private_docs");

/* --- ENV (auf Vercel im Dashboard setzen) --- */
const {
    SECRET_KEY,
    VALID_USERNAME,
    VALID_PASSWORD,
    FRONTEND_ORIGIN,            // z.B. "https://loictobler.ch"
    NODE_ENV = "production"
} = process.env;

// Auf Vercel solltest du diese Variablen setzen (Project → Settings → Environment Variables)
// Für das Laufen der App sind SECRET_KEY / VALID_USERNAME / VALID_PASSWORD erforderlich.
if (!SECRET_KEY || !VALID_USERNAME || !VALID_PASSWORD) {
    console.warn("⚠️  ENV Variablen fehlen: SECRET_KEY / VALID_USERNAME / VALID_PASSWORD");
}

/* --- App + Security --- */
const app = express();

// In Vercel-Serverless NICHT app.listen() aufrufen.
app.set("trust proxy", 1);

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // PDFs inline erlauben
}));
app.use(compression());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.json());

// CORS: Wenn Frontend & Backend auf derselben Domain liegen (z.B. loictobler.ch),
// ist CORS eigentlich nicht nötig. Für Calls von anderen Domains kannst du FRONTEND_ORIGIN setzen.
const corsOptions = FRONTEND_ORIGIN
    ? {
        origin: FRONTEND_ORIGIN,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Disposition"]
    }
    : undefined; // gleiche Domain → keine CORS-Header nötig

if (corsOptions) {
    app.use(cors(corsOptions));
    app.options("*", cors(corsOptions));
}

/* --- Rate Limit nur für Login --- */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Zu viele Login-Versuche. Bitte später erneut versuchen." }
});

/* --- Health/Info --- */
app.get("/api/health", (_, res) =>
    res.json({ ok: true, env: NODE_ENV, docsDirExists: fs.existsSync(DOCS_DIR) })
);

app.get("/api", (_, res) => res.type("text").send("OK – Backend läuft (Vercel Serverless)."));

/* --- Login --- */
app.post("/api/login", loginLimiter, (req, res) => {
    const { username, password } = req.body || {};
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token });
    }
    return res.status(401).json({ message: "Falsche Login-Daten" });
});

/* --- Auth Middleware: Bearer ODER token=? (praktisch für window.open/View) --- */
function auth(req, res, next) {
    let token = null;

    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];
    if (!token && req.query?.token) token = req.query.token;

    if (!token) return res.status(403).json({ message: "Kein Token" });
    try {
        jwt.verify(token, SECRET_KEY);
        next();
    } catch {
        return res.status(403).json({ message: "Ungültiges oder abgelaufenes Token" });
    }
}

/* --- sicheren Pfad bauen --- */
function safeJoin(base, target) {
    const p = path.normalize(path.join(base, target));
    if (!p.startsWith(base + path.sep) && p !== base) return null;
    return p;
}

/* --- Liste der PDFs aus /private_docs --- */
app.get("/api/dokumente", auth, (req, res) => {
    try {
        const exists = fs.existsSync(DOCS_DIR);
        if (!exists) return res.json({ files: [] });

        const files = fs
            .readdirSync(DOCS_DIR, { withFileTypes: true })
            .filter(d => d.isFile() && path.extname(d.name).toLowerCase() === ".pdf")
            .map(d => d.name);

        const payload = files.map(name => ({
            name,
            viewUrl: `/api/view/${encodeURIComponent(name)}`,   // inline anzeigen
            url:     `/api/download/${encodeURIComponent(name)}`// herunterladen
        }));
        res.json({ files: payload });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Dateien konnten nicht gelesen werden" });
    }
});

/* --- PDF inline anzeigen --- */
app.get("/api/view/:filename", auth, (req, res) => {
    const abs = safeJoin(DOCS_DIR, req.params.filename);
    if (!abs) return res.status(400).json({ message: "Ungültiger Pfad" });
    if (!fs.existsSync(abs)) return res.status(404).json({ message: "Datei nicht gefunden" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${path.basename(abs)}"`);
    res.sendFile(abs);
});

/* --- PDF Download --- */
app.get("/api/download/:filename", auth, (req, res) => {
    const abs = safeJoin(DOCS_DIR, req.params.filename);
    if (!abs) return res.status(400).json({ message: "Ungültiger Pfad" });
    if (!fs.existsSync(abs)) return res.status(404).json({ message: "Datei nicht gefunden" });
    res.download(abs, path.basename(abs));
});

// WICHTIG: KEIN app.listen() hier!
// In Vercel muss die Express-App exportiert werden:
export default app;
