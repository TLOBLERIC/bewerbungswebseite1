// api/view.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verifyAuth } from "./_auth.js";

export const config = { runtime: "nodejs18.x" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.join(__dirname, "..", "private_docs");

function safeJoin(base, target) {
    const p = path.normalize(path.join(base, target));
    if (!p.startsWith(base + path.sep) && p !== base) return null;
    return p;
}

export default async function handler(req) {
    const auth = verifyAuth(req);
    if (!auth.ok) {
        return new Response(JSON.stringify(auth.body), {
            status: auth.status,
            headers: { "Content-Type": "application/json" },
        });
    }

    const url = new URL(req.url);
    const name = url.searchParams.get("file");
    if (!name) {
        return new Response(JSON.stringify({ message: "file Parameter fehlt" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const abs = safeJoin(DOCS_DIR, name);
    if (!abs || !fs.existsSync(abs)) {
        return new Response(JSON.stringify({ message: "Datei nicht gefunden" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const buffer = fs.readFileSync(abs);
    return new Response(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${path.basename(abs)}"`,
            "Cache-Control": "private, max-age=0, no-store",
        },
    });
}
