const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/authRoutes");
const issueRoutes = require("../modules/issues/issueRoutes");
const userRoutes = require("../modules/users/userRoutes");

router.use("/auth", authRoutes);
router.use("/issues", issueRoutes);
router.use("/users", userRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Issue Tracker API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  });
});

module.exports = router;
