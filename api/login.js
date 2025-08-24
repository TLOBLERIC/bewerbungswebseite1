// api/login.js
import jwt from "jsonwebtoken";
import { jsonResponse } from "./_auth.js";

export const config = { runtime: "nodejs18.x" };

export default async function handler(req) {
    if (req.method !== "POST") {
        return jsonResponse({ message: "Method not allowed" }, 405);
    }

    const { VALID_USERNAME, VALID_PASSWORD, SECRET_KEY } = process.env;
    if (!VALID_USERNAME || !VALID_PASSWORD || !SECRET_KEY) {
        return jsonResponse({ message: "Server falsch konfiguriert" }, 500);
    }

    const body = await req.json().catch(() => ({}));
    const { username, password } = body;

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        return jsonResponse({ token }, 200);
    }

    return jsonResponse({ message: "Falsche Login-Daten" }, 401);
}
