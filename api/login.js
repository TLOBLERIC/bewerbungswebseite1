// /api/login.js
import jwt from "jsonwebtoken";
import { withCors } from "./_auth.js";

export default withCors(async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Only POST" });
        return;
    }

    const { username, password } = req.body || {};
    if (
        username === process.env.VALID_USERNAME &&
        password === process.env.VALID_PASSWORD
    ) {
        const token = jwt.sign({ username }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ message: "Falsche Login-Daten" });
    }
});
