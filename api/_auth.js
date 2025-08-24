// api/_auth.js
import jwt from "jsonwebtoken";

export function verifyAuth(req) {
    // Header: Authorization: Bearer <token>  ODER  ?token=...
    let token = null;

    const authHeader = req.headers.get("authorization") || "";
    if (authHeader.toLowerCase().startsWith("bearer ")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        const url = new URL(req.url);
        token = url.searchParams.get("token");
    }
    if (!token) {
        return { ok: false, status: 403, body: { message: "Kein Token" } };
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY);
        return { ok: true };
    } catch {
        return { ok: false, status: 403, body: { message: "Ungültiges oder abgelaufenes Token" } };
    }
}

export function jsonResponse(obj, status = 200, extraHeaders) {
    return new Response(JSON.stringify(obj), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            ...extraHeaders
        },
    });
}
