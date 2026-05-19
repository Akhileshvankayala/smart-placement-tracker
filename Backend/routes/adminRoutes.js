import express from "express";

import {
    bulkUploadStudents,
    getAllStudents,
    toggleBlockStudent,
    deleteStudent,
    generateReport
} from "../controllers/adminController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ======================================
// Bulk Upload Students
// ======================================
router.post(
    "/bulk-upload",
    authMiddleware,
    roleMiddleware("admin"),
    upload.single("file"),
    bulkUploadStudents
);

// ======================================
// Get All Students
// ======================================
router.get(
    "/students",
    authMiddleware,
    roleMiddleware("admin"),
    getAllStudents
);

// ======================================
// Toggle Block Student
// ======================================
router.patch(
    "/students/:id/block",
    authMiddleware,
    roleMiddleware("admin"),
    toggleBlockStudent
);

// ======================================
// Delete Student
// ======================================
router.delete(
    "/students/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteStudent
);

// ======================================
// Generate Excel Report
// ======================================
router.get(
    "/report",
    authMiddleware,
    roleMiddleware("admin"),
    generateReport
);

export default router;