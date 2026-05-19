import Company from "../models/Company.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// ======================================
// Add Company
// ======================================
export const addCompany = asyncHandler(async (req, res) => {

    const {
        companyName,
        role,
        packageOffered,
        minCGPA,
        allowedBranches,
        allowedBacklogs,
        deadline,
        description
    } = req.body;

    const company = await Company.create({
        companyName,
        role,
        packageOffered,
        minCGPA,
        allowedBranches,
        allowedBacklogs,
        deadline,
        description,
        createdBy: req.user._id
    });

    res.status(201).json({
        success: true,
        message: "Company added successfully",
        company
    });

});

// ======================================
// Get All Companies
// ======================================
export const getAllCompanies = asyncHandler(async (req, res) => {

    const companies = await Company.find()
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: companies.length,
        companies
    });

});

// ======================================
// Get Single Company
// ======================================
export const getSingleCompany = asyncHandler(async (req, res) => {

    const company = await Company.findById(req.params.id);

    if (!company) {
        res.status(404);
        throw new Error("Company not found");
    }

    res.status(200).json({
        success: true,
        company
    });

});

// ======================================
// Get Eligible Companies
// ======================================
export const getEligibleCompanies = asyncHandler(async (req, res) => {

    const student = await User.findById(req.user._id);

    const companies = await Company.find({
        isOpen: true,
        deadline: { $gte: new Date() }, // Only show companies whose deadline has not passed
        minCGPA: { $lte: student.cgpa },
        allowedBranches: { $in: [student.branch] },
        allowedBacklogs: { $gte: student.backlogs }
    });

    res.status(200).json({
        success: true,
        count: companies.length,
        companies
    });

});

// ======================================
// Close Company Applications
// ======================================
export const closeCompanyApplications = asyncHandler(async (req, res) => {

    const company = await Company.findById(req.params.id);

    if (!company) {
        res.status(404);
        throw new Error("Company not found");
    }

    company.isOpen = false;

    await company.save();

    res.status(200).json({
        success: true,
        message: "Applications closed successfully",
        company
    });

});

// ======================================
// Reopen Company Applications
// ======================================
export const reopenCompanyApplications = asyncHandler(async (req, res) => {

    const company = await Company.findById(req.params.id);

    if (!company) {
        res.status(404);
        throw new Error("Company not found");
    }

    company.isOpen = true;

    await company.save();

    res.status(200).json({
        success: true,
        message: "Applications reopened successfully",
        company
    });

});