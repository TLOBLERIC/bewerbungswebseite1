// /api/_auth.js
import jwt from "jsonwebtoken";

const ORIGIN = process.env.FRONTEND_ORIGIN || "*";

export function withCors(handler) {
    return async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", ORIGIN);
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        if (req.method === "OPTIONS") {
            res.status(200).end();
            return;
        }
        return handler(req, res);
    };
}

export function requireAuth(req, res) {
    try {
        let token = null;
        const h = req.headers.authorization || "";
        if (h.startsWith("Bearer ")) token = h.split(" ")[1];
        if (!token && req.query?.token) token = req.query.token;

        if (!token) {
            res.status(403).json({ message: "Kein Token" });
            return null;
        }
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        return payload;
    } catch {
        res.status(403).json({ message: "Ungültiges oder abgelaufenes Token" });
        return null;
    }
}
