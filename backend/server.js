import express from "express";
import dotenv from "dotenv";
import wordRoutes from "./routes/Word.route.js";
import userRoutes from "./routes/User.route.js";
import authRoutes from "./routes/Auth.route.js";
import { pool } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000","https://gh-2-frontend.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

//routes
app.use("/", authRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/users", userRoutes);

//connect db
pool
  .connect()
  .then(() => {
    console.log("PostgreSQL Connected!");

    app.listen(process.env.PORT || 8081, () => {
      console.log(`Server running on port ${process.env.PORT || 8080}`);
    });
  })
  .catch((err) => console.error("PostgreSQL Connection Error:", err));
