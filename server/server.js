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
const __dirname = path.dirname(__filename);

// PDFs liegen in server/documents
const DOCS_DIR = path.join(__dirname, "documents");

const {
    NODE_ENV = "production",
    FRONTEND_ORIGIN, // z.B. https://loictobler.ch
    VALID_USERNAME,
    VALID_PASSWORD,
    SECRET_KEY,
    JWT_EXPIRES_IN = "1h",
} = process.env;

// --- App & Middleware ---
const app = express();
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// CORS nur setzen, wenn du von einer anderen Origin zugreifst.
if (FRONTEND_ORIGIN) {
    app.use(
        cors({
            origin: FRONTEND_ORIGIN,
            methods: ["GET", "POST", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            exposedHeaders: ["Content-Disposition"],
            credentials: false,
        })
    );
}

// --- Helpers ---
function makeToken(payload) {
    if (!SECRET_KEY) throw new Error("SECRET_KEY fehlt");
    return jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
}

function auth(req, res, next) {
    try {
        let token = null;
        const hdr = req.headers.authorization || "";
        if (hdr.startsWith("Bearer ")) token = hdr.slice(7);
        if (!token && req.query?.token) token = String(req.query.token);

        if (!token) return res.status(403).json({ message: "Kein Token" });
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (e) {
        return res.status(403).json({ message: "Ungültiges oder abgelaufenes Token" });
    }
}

// RFC 5987 kompatible Content-Disposition für Umlaute
function contentDispositionInline(filename) {
    const fallback = filename.replace(/[^\x20-\x7E]+/g, "_");
    const encoded = encodeRFC5987ValueChars(filename);
    return `inline; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}
function contentDispositionAttachment(filename) {
    const fallback = filename.replace(/[^\x20-\x7E]+/g, "_");
    const encoded = encodeRFC5987ValueChars(filename);
    return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}
function encodeRFC5987ValueChars(str) {
    return encodeURIComponent(str)
        .replace(/['()]/g, escape)
        .replace(/\*/g, "%2A")
        .replace(/%(7C|60|5E)/g, "%25$1");
}

// --- Routes ---
app.get("/api/health", async (_req, res) => {
    const exists = fs.existsSync(DOCS_DIR);
    let files = [];
    if (exists) {
        try {
            files = (await fsp.readdir(DOCS_DIR)).filter(
                (n) => path.extname(n).toLowerCase() === ".pdf"
            );
        } catch {}
    }
    res.json({ ok: true, env: NODE_ENV, docsDirExists: exists, files });
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

        const files = (await fsp.readdir(DOCS_DIR)).filter(
            (n) => path.extname(n).toLowerCase() === ".pdf"
        );

        const payload = files.map((name) => ({
            name,
            viewUrl: `/api/view/${encodeURIComponent(name)}`,
            url: `/api/download/${encodeURIComponent(name)}`,
        }));
        res.json({ files: payload });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Dateien konnten nicht gelesen werden" });
    }
});

// Wichtig: keine sendFile/download-Streams verwenden, sondern Buffer senden.
// Zusätzlich: Param sicher decodieren und nur Basename erlauben.
app.get("/api/view/:filename", auth, async (req, res) => {
    try {
        const raw = req.params.filename || "";
        const decoded = decodeURIComponent(raw);
        const filename = path.basename(decoded); // verhindert / oder \
        const abs = path.join(DOCS_DIR, filename);

        await fsp.access(abs, fs.constants.R_OK);
        const buf = await fsp.readFile(abs);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", contentDispositionInline(filename));
        res.setHeader("Content-Length", buf.length);
        return res.end(buf);
    } catch (err) {
        console.error("VIEW error:", err);
        if (err?.code === "ENOENT") return res.status(404).json({ message: "Datei nicht gefunden" });
        return res.status(500).json({ message: "Konnte Datei nicht anzeigen" });
    }
});

app.get("/api/download/:filename", auth, async (req, res) => {
    try {
        const raw = req.params.filename || "";
        const decoded = decodeURIComponent(raw);
        const filename = path.basename(decoded);
        const abs = path.join(DOCS_DIR, filename);

        await fsp.access(abs, fs.constants.R_OK);
        const buf = await fsp.readFile(abs);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", contentDispositionAttachment(filename));
        res.setHeader("Content-Length", buf.length);
        return res.end(buf);
    } catch (err) {
        console.error("DOWNLOAD error:", err);
        if (err?.code === "ENOENT") return res.status(404).json({ message: "Datei nicht gefunden" });
        return res.status(500).json({ message: "Konnte Datei nicht herunterladen" });
    }
});

// WICHTIG für Vercel Serverless:
export default app;
