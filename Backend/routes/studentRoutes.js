import express from "express";

import {
    getStudentProfile,
    updateStudentProfile
} from "../controllers/studentController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ======================================
// Student Profile Routes
// ======================================

// Get Logged-In Student Profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    getStudentProfile
);

// Update Student Profile
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("student"),
    updateStudentProfile
);

export default router;