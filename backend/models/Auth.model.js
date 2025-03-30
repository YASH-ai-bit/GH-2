import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

export const createAuth = async (email, password) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
        "INSERT INTO auth (email, password) VALUES ($1, $2) RETURNING *",
        [email, hashedPassword]
    );
    return result.rows[0];
};

export const loginAuth = async (email, password) => {
    const result = await pool.query("SELECT * FROM auth WHERE email = $1", [email]);

    if (result.rowCount === 0) throw Error("Incorrect Email");

    const auth = result.rows[0];
    const isMatch = await bcrypt.compare(password, auth.password);

    if (!isMatch) throw Error("Incorrect Password");

    return auth;
};
