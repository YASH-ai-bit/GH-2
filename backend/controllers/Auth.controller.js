import Auth from "../models/Auth.model.js";
import jwt from "jsonwebtoken";
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "yash", {
    expiresIn: maxAge,
  });
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

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

export const register = async (req, res, next) => {
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

    const auth = await Auth.create({ email, password });
    const token = createToken(auth._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ auth: auth._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password} = req.body;
    const auth = await Auth.login(email, password);
    const token = createToken(auth._id);
    res.cookie("jwt", token, {httpOnly: false, maxAge: maxAge * 1000});
    res.status(200).json({auth : auth._id, status: true});
  } catch (err) {
    const errors = handleErrors(err);
    res.json({errors, status: false});
  }
};