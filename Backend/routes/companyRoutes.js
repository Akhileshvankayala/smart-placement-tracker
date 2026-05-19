import express from "express";

import {
    addCompany,
    getAllCompanies,
    getEligibleCompanies,
    getSingleCompany,
    closeCompanyApplications,
    reopenCompanyApplications
} from "../controllers/companyController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ===================================
// Admin Routes
// ===================================

// Add Company
router.post(
    "/add",
    authMiddleware,
    roleMiddleware("admin"),
    addCompany
);

// Close Applications
router.patch(
    "/close/:id",
    authMiddleware,
    roleMiddleware("admin"),
    closeCompanyApplications
);

// Reopen Applications
router.patch(
    "/reopen/:id",
    authMiddleware,
    roleMiddleware("admin"),
    reopenCompanyApplications
);

// ===================================
// Student / Public Routes
// ===================================

// Get All Companies
router.get("/", authMiddleware, getAllCompanies);

// Get Eligible Companies
router.get(
    "/eligible",
    authMiddleware,
    roleMiddleware("student"),
    getEligibleCompanies
);

// Get Single Company
router.get("/:id", authMiddleware, getSingleCompany);

export default router;