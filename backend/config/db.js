import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

pool.connect()
    .then(() => console.log("PostgreSQL Connected!"))
    .catch((err) => console.error("PostgreSQL Connection Error:", err));
