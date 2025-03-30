import { pool } from "../config/db.js";

export const getWords = async (req, res) => {
    const { id } = req.params;

    try {
        if (id) {
            const result = await pool.query("SELECT * FROM words WHERE id = $1", [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "No such word" });
            }

            return res.status(200).json(result.rows[0]);
        }

        // Get 2 random words
        const words = await pool.query("SELECT * FROM words ORDER BY RANDOM() LIMIT 2");

        if (words.rows.length < 2) {
            return res.status(404).json({ error: "Not enough words in the database" });
        }

        res.status(200).json({ word1: words.rows[0], word2: words.rows[1] });
    } catch (error) {
        console.error("Failed to fetch words:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
