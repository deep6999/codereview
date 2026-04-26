const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const aiRoutes = require("./routes/ai.routes");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(clerkMiddleware());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

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
