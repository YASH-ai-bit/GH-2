import { pool } from "../config/db.js";  // PostgreSQL connection

export const createWord = async (word, searchCount, imageUrl) => {
    const result = await pool.query(
        "INSERT INTO words (word, search_count, image_url) VALUES ($1, $2, $3) RETURNING *",
        [word, searchCount, imageUrl]
    );
    return result.rows[0];
};

export const getWords = async () => {
    const result = await pool.query("SELECT * FROM words ORDER BY created_at DESC");
    return result.rows;
};
