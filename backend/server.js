// server.js  (Node 18+ empfohlen)
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import compression from "compression";
import morgan from "morgan";

dotenv.config();

/* --- Pfade & Ordner --- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.join(__dirname, "private_docs"); // <- deine PDFs rein

/* --- ENV --- */
const {
    PORT = 5000,
    SECRET_KEY,
    VALID_USERNAME,
    VALID_PASSWORD,
    FRONTEND_ORIGIN,                // z.B. "https://deine-domain.tld"
    NODE_ENV = "development"
} = process.env;

if (!SECRET_KEY || !VALID_USERNAME || !VALID_PASSWORD) {
    console.error("❌ .env unvollständig: SECRET_KEY / VALID_USERNAME / VALID_PASSWORD fehlen");
    process.exit(1);
}

/* --- App + Security --- */
const app = express();

// Wenn hinter Proxy (Render/Railway/NGINX) -> echte IPs/X-Forwarded-* nutzen
app.set("trust proxy", 1);

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // PDFs inline anzeigen
}));
app.use(compression());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// CORS: in Dev alles Lokale erlauben, in Prod nur FRONTEND_ORIGIN
const corsOptions = FRONTEND_ORIGIN
    ? {
        origin: FRONTEND_ORIGIN,
        methods: ["GET","POST","OPTIONS"],
        allowedHeaders: ["Content-Type","Authorization"],
        exposedHeaders: ["Content-Disposition"]
    }
    : {
        origin: (origin, cb) => {
            if (!origin) return cb(null, true); // z.B. curl/Postman
            try {
                const u = new URL(origin);
                const isLocal = (u.hostname === "localhost" || u.hostname === "127.0.0.1");
                return cb(isLocal ? null : new Error("CORS blockiert"), isLocal);
            } catch {
                return cb(new Error("CORS ungültig"), false);
            }
        },
        methods: ["GET","POST","OPTIONS"],
        allowedHeaders: ["Content-Type","Authorization"],
        exposedHeaders: ["Content-Disposition"]
    };
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

/* --- Rate Limit nur für Login --- */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Zu viele Login-Versuche. Bitte später erneut versuchen." },
});

/* --- Health/Info --- */
app.get("/health", (_, res) => res.json({ ok: true, env: NODE_ENV }));
app.get("/",  (_, res) => res.type("text").send("OK – Backend läuft.")); // einfache Startseite

/* --- Login --- */
app.post("/login", loginLimiter, (req, res) => {
    const { username, password } = req.body || {};
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token });
    }
    return res.status(401).json({ message: "Falsche Login-Daten" });
});

/* --- Auth Middleware: Bearer ODER token=? (für window.open/View) --- */
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

/* --- Liste der PDFs --- */
app.get("/dokumente", auth, (req, res) => {
    try {
        if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
        const files = fs.readdirSync(DOCS_DIR, { withFileTypes: true })
            .filter(d => d.isFile() && path.extname(d.name).toLowerCase() === ".pdf")
            .map(d => d.name);

        const payload = files.map(name => ({
            name,
            viewUrl: `/view/${encodeURIComponent(name)}`,   // inline anzeigen
            url:     `/download/${encodeURIComponent(name)}`// herunterladen
        }));
        res.json({ files: payload });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Dateien konnten nicht gelesen werden" });
    }
});

/* --- PDF inline anzeigen --- */
app.get("/view/:filename", auth, (req, res) => {
    const abs = safeJoin(DOCS_DIR, req.params.filename);
    if (!abs) return res.status(400).json({ message: "Ungültiger Pfad" });
    if (!fs.existsSync(abs)) return res.status(404).json({ message: "Datei nicht gefunden" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${path.basename(abs)}"`);
    res.sendFile(abs);
});

/* --- PDF Download --- */
app.get("/download/:filename", auth, (req, res) => {
    const abs = safeJoin(DOCS_DIR, req.params.filename);
    if (!abs) return res.status(400).json({ message: "Ungültiger Pfad" });
    if (!fs.existsSync(abs)) return res.status(404).json({ message: "Datei nicht gefunden" });
    res.download(abs, path.basename(abs));
});

/* --- Server Start --- */
app.listen(PORT, () => {
    console.log(`✅ Backend läuft auf http://localhost:${PORT}`);
}).on("error", (err) => {
    console.error("❌ Konnte Server nicht starten:", err.message);
});
