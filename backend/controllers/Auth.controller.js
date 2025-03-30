import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, "yash", { expiresIn: maxAge });
};

const handleErrors = (err) => {
    let errors = { email: "", password: "" };

    console.log(err);
    if (err.message === "Incorrect Email") {
        errors.email = "That email is not registered";
    }

    if (err.message === "Incorrect Password") {
        errors.password = "That password is incorrect";
    }

    if (err.code === "23505") {
        errors.email = "Email is already registered";
    }

    return errors;
};

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                errors: { 
                    email: !email ? "Email is required!" : "", 
                    password: !password ? "Password is required!" : "" 
                }, 
                created: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO auth (email, password) VALUES ($1, $2) RETURNING id",
            [email, hashedPassword]
        );

        const token = createToken(result.rows[0].id);

        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
        });

        res.status(201).json({ auth: result.rows[0].id, created: true });
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.json({ errors, created: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query("SELECT * FROM auth WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            throw Error("Incorrect Email");
        }

        const validPassword = await bcrypt.compare(password, result.rows[0].password);
        if (!validPassword) {
            throw Error("Incorrect Password");
        }

        const token = createToken(result.rows[0].id);
        res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
        res.status(200).json({ auth: result.rows[0].id, status: true });
    } catch (err) {
        const errors = handleErrors(err);
        res.json({ errors, status: false });
    }
};
