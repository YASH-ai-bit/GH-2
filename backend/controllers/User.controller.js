import { pool } from "../config/db.js";

export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No such user" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createUser = async (req, res) => {
    const { username } = req.body;

    try {
        const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (existingUser.rows.length > 0) {
            return res.status(401).json({ error: "Username already exists, try another!" });
        }

        const result = await pool.query("INSERT INTO users (username) VALUES ($1) RETURNING *", [username]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(400).json({ error: "Create a username!" });
    }
};

export const updateHighScore = async (req, res) => {
    const { id } = req.params;
    const { highScore } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "No such user" });
        }

        if (highScore > result.rows[0].high_score) {
            await pool.query("UPDATE users SET high_score = $1 WHERE id = $2", [highScore, id]);
            return res.status(200).json({ message: "High score updated!" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
