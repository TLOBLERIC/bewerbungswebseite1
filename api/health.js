// api/health.js
export const config = { runtime: "nodejs18.x" };

export default async function handler(req) {
    return new Response(JSON.stringify({ ok: true, env: process.env.NODE_ENV || "dev" }), {
        headers: { "Content-Type": "application/json" },
    });
}
