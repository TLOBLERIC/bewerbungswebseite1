// api/dokumente.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verifyAuth, jsonResponse } from "./_auth.js";

export const config = { runtime: "nodejs18.x" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.join(__dirname, "..", "private_docs");

export default async function handler(req) {
    const auth = verifyAuth(req);
    if (!auth.ok) return jsonResponse(auth.body, auth.status);

    try {
        if (!fs.existsSync(DOCS_DIR)) {
            return jsonResponse({ files: [] });
        }

        const files = fs.readdirSync(DOCS_DIR, { withFileTypes: true })
            .filter((d) => d.isFile() && path.extname(d.name).toLowerCase() === ".pdf")
            .map((d) => d.name);

        const payload = files.map((name) => ({
            name,
            viewUrl: `/api/view?file=${encodeURIComponent(name)}`,      // inline anzeigen
            url:     `/api/download?file=${encodeURIComponent(name)}`,  // Download
        }));

        return jsonResponse({ files: payload });
    } catch (e) {
        console.error(e);
        return jsonResponse({ message: "Dateien konnten nicht gelesen werden" }, 500);
    }
}
