import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = express();

// middlewares:
app.use(cookieParser());
app.use(rateLimiter);

// test routes:
app.get("/", (req, res) => {
  res.json({ message: "Request successful" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
