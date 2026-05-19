import express from "express";

import {
    applyToCompany,
    updateApplicationStatus,
    getStudentApplications,
    getCompanyApplicants,
    getAllApplications
} from "../controllers/applicationController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ======================================
// Student Routes
// ======================================

// Apply to Company
router.post(
    "/apply/:companyId",
    authMiddleware,
    roleMiddleware("student"),
    applyToCompany
);

// Get Logged-In Student Applications
router.get(
    "/my-applications",
    authMiddleware,
    roleMiddleware("student"),
    getStudentApplications
);

// ======================================
// Admin Routes
// ======================================

// Update Application Status
router.patch(
    "/status/:applicationId",
    authMiddleware,
    roleMiddleware("admin"),
    updateApplicationStatus
);

// Get All Applications
router.get(
    "/all",
    authMiddleware,
    roleMiddleware("admin"),
    getAllApplications
);

// Get Applicants for Specific Company
router.get(
    "/company/:companyId",
    authMiddleware,
    roleMiddleware("admin"),
    getCompanyApplicants
);

export default router;