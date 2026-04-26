const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const aiRoutes = require("./routes/ai.routes");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isVercelOrigin(origin) {
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

function isAllowedOrigin(origin) {
  if (!origin || allowedOrigins.length === 0) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === "https://*.vercel.app") {
      return isVercelOrigin(origin);
    }

    return false;
  });
}

app.use(clerkMiddleware());

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin) || isVercelOrigin(origin)) {
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "API Running",
  });
});

app.use("/ai", aiRoutes);

module.exports = app;
