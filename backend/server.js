import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import wordRoutes from "./routes/Word.route.js";
import userRoutes from "./routes/User.route.js";
import authRoutes from "./routes/Auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const BASE_URL = process.env.BASE_URL;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ['POST','GET','PUT','DELETE'],
    credentials: true,
  })
)

//routes
app.use("/", authRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/users", userRoutes);
app.use(cookieParser());

//connect db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(8080, () => {
    console.log("Connected to db andListening on port 8080");
  });
});
