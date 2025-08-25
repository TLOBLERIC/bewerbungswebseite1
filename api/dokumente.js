// /api/dokumente.js
import fs from "fs";
import path from "path";
import { withCors, requireAuth } from "./_auth.js";

const DOCS_DIR = path.join(process.cwd(), "private_docs"); // wird via includeFiles gebündelt

export default withCors(async function handler(req, res) {
    if (!requireAuth(req, res)) return;

    try {
        if (!fs.existsSync(DOCS_DIR)) {
            res.status(200).json({ files: [] });
            return;
        }
        const files = fs
            .readdirSync(DOCS_DIR, { withFileTypes: true })
            .filter((d) => d.isFile() && path.extname(d.name).toLowerCase() === ".pdf")
            .map((d) => d.name);

        const payload = files.map((name) => ({
            name,
            viewUrl: `/api/view?file=${encodeURIComponent(name)}`,
            url: `/api/download?file=${encodeURIComponent(name)}`,
        }));

        res.status(200).json({ files: payload });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Dateien konnten nicht gelesen werden" });
    }
});
