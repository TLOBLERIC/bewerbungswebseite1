// /api/health.js
import { withCors } from "./_auth.js";

export default withCors(async function handler(req, res) {
    res.status(200).json({ ok: true, env: process.env.NODE_ENV || "dev" });
});

