import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// middlewares:
app.use(cookieParser());
app.use(rateLimiter);

// test route
app.get("/", (req, res) => {
  res.json({ message: "Request successful" });
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
