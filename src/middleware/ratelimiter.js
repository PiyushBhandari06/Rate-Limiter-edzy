import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const RATE_LIMIT = parseInt(process.env.RATE_LIMIT) || 5;
const RATE_WINDOW_SEC = parseInt(process.env.RATE_WINDOW_SEC) || 60;
const WINDOW_MS = RATE_WINDOW_SEC * 1000;

const rateMap = new Map();

/*
Map structure we are gonna use :
Map{
  userId -> {
    count: number,
    windowStart: timestamp (ms)
    }
  }
*/

// Cleanup old entries
// To test cleanup, make RATE_WINDOW_SEC small (like 5 seconds in env)
setInterval(() => {
  console.log("Cleanup running. Current map size:", rateMap.size);

  const now = Date.now();

  for (const [userId, record] of rateMap.entries()) {
    if (now - record.windowStart >= WINDOW_MS) {
      console.log("Deleting user:", userId);
      rateMap.delete(userId);
    }
  }

  console.log("Cleanup finished. New map size:", rateMap.size);
}, WINDOW_MS);



export function rateLimiter(req, res, next) {
  let userId = req.cookies.user_id;

  // Assign UUID if not present
  if (!userId) {
    userId = uuidv4();
    res.cookie("user_id", userId, { httpOnly: true });
  }

  const now = Date.now();
  const windowMs = RATE_WINDOW_SEC * 1000;

  let record = rateMap.get(userId);

  // New user or window expired
  if (!record || now - record.windowStart >= windowMs) {
    record = {
      count: 1,
      windowStart: now,
    };
    rateMap.set(userId, record);
  } else {
    record.count += 1;
  }

  const remaining = Math.max(0, RATE_LIMIT - record.count); // -> How many requests you can STILL make after this request
  const resetSeconds = Math.ceil(
    (windowMs - (now - record.windowStart)) / 1000
  );

  // Required headers
  res.setHeader("X-RateLimit-Limit", RATE_LIMIT);
  res.setHeader("X-RateLimit-Remaining", remaining);     //number
  res.setHeader("X-RateLimit-Reset", resetSeconds);     //seconds

  // Enforce limit
  if (record.count > RATE_LIMIT) {
    return res.status(429).json({
      error: "rate_limited",
      message: "Too many requests, please try again later.",
    });
  }

  next();
}
