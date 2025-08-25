// /api/view.js
import fs from "fs";
import path from "path";
import { withCors, requireAuth } from "./_auth.js";

const DOCS_DIR = path.join(process.cwd(), "private_docs");

export default withCors(async function handler(req, res) {
    if (!requireAuth(req, res)) return;

    const file = req.query?.file;
    if (!file) {
        res.status(400).json({ message: "Parameter file fehlt" });
        return;
    }
    const abs = path.join(DOCS_DIR, file);
    if (!abs.startsWith(DOCS_DIR) || !fs.existsSync(abs)) {
        res.status(404).json({ message: "Datei nicht gefunden" });
        return;
    }

    try {
        const buf = fs.readFileSync(abs);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${path.basename(abs)}"`);
        res.status(200).end(buf);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Fehler beim Lesen" });
    }
});
