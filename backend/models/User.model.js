import { pool } from "../config/db.js";

export const createUser = async (username) => {
    const result = await pool.query(
        "INSERT INTO users (username) VALUES ($1) RETURNING *",
        [username]
    );
    return result.rows[0];
};

export const getUserById = async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
};

export const updateHighScore = async (id, highScore) => {
    const result = await pool.query(
        "UPDATE users SET high_score = $1 WHERE id = $2 RETURNING *",
        [highScore, id]
    );
    return result.rows[0];
};
