/**
 * Main Routes Aggregator
 * ======================
 * Combines all route modules and mounts them on the API
 *
 * Adapted from: olympus-backend-services/express-server/routes/index.js
 */

const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("../modules/auth/authRoutes");
const issueRoutes = require("../modules/issues/issueRoutes");
const userRoutes = require("../modules/users/userRoutes");

// ========================================
// Mount Routes
// ========================================

// Auth routes: /api/auth/*
router.use("/auth", authRoutes);

// Issue routes: /api/issues/*
router.use("/issues", issueRoutes);

// User management routes (admin): /api/users/*
router.use("/users", userRoutes);

// ========================================
// Health Check Endpoint
// ========================================
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
