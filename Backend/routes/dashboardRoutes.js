import express from "express";

import {
    getDashboardStats
} from "../controllers/dashboardController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ======================================
// Dashboard Routes
// ======================================

// Get Dashboard Statistics
router.get(
    "/stats",
    authMiddleware,
    roleMiddleware("admin"),
    getDashboardStats
);

export default router;