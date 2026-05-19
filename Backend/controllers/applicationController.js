import Application from "../models/Application.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

import asyncHandler from "../utils/asyncHandler.js";
import { 
    sendApplicationConfirmationEmail, 
    sendRoundUpdateEmail, 
    sendSelectionEmail, 
    sendRejectionEmail 
} from "../services/emailService.js";

// ======================================
// Apply To Company
// ======================================
export const applyToCompany = asyncHandler(async (req, res) => {

    const companyId = req.params.companyId;

    // Find Company
    const company = await Company.findById(companyId);

    if (!company) {
        res.status(404);
        throw new Error("Company not found");
    }

    // Check if applications are open
    if (!company.isOpen) {
        res.status(400);
        throw new Error("Applications are closed for this company");
    }

    // Check if deadline has passed
    if (new Date(company.deadline) < new Date()) {
        res.status(400);
        throw new Error("The deadline for this company has passed");
    }

    // Get Student
    const student = await User.findById(req.user._id);

    // Eligibility Check
    const isEligible =
        student.cgpa >= company.minCGPA &&
        company.allowedBranches.includes(student.branch) &&
        student.backlogs <= company.allowedBacklogs;

    if (!isEligible) {
        res.status(403);
        throw new Error("You are not eligible for this company");
    }

    // Check Duplicate Application
    const existingApplication = await Application.findOne({
        student: student._id,
        company: company._id
    });

    if (existingApplication) {
        res.status(400);
        throw new Error("You have already applied");
    }

    // Create Application
    const application = await Application.create({
        student: student._id,
        company: company._id
    });

    // Send Email Notification
    sendApplicationConfirmationEmail(student.email, student.name, company.companyName);

    res.status(201).json({
        success: true,
        message: "Applied successfully",
        application
    });

});

// ======================================
// Update Application Status
// ======================================
export const updateApplicationStatus = asyncHandler(async (req, res) => {

    const { status } = req.body;

    const application = await Application.findById(
        req.params.applicationId
    ).populate("student").populate("company");

    if (!application) {
        res.status(404);
        throw new Error("Application not found");
    }

    application.status = status;

    await application.save();

    // Send Email Notification based on status
    const student = application.student;
    const company = application.company;

    if (student && company) {
        if (status === "SELECTED") {
            sendSelectionEmail(student.email, student.name, company.companyName, company.packageOffered);
        } else if (status === "REJECTED") {
            sendRejectionEmail(student.email, student.name, company.companyName);
        } else if (status === "ROUND1" || status === "ROUND2") {
            sendRoundUpdateEmail(student.email, student.name, company.companyName, status === "ROUND1" ? "Round 1" : "Round 2");
        } else {
            // For other statuses if any
            sendRoundUpdateEmail(student.email, student.name, company.companyName, status);
        }
    }

    res.status(200).json({
        success: true,
        message: "Application status updated",
        application
    });

});

// ======================================
// Get Student Applications
// ======================================
export const getStudentApplications = asyncHandler(async (req, res) => {

    const applications = await Application.find({
        student: req.user._id
    })
        .populate("company")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications
    });

});

// ======================================
// Get Company Applicants
// ======================================
export const getCompanyApplicants = asyncHandler(async (req, res) => {

    const applications = await Application.find({
        company: req.params.companyId
    })
        .populate("student", "-password")
        .populate("company");

    res.status(200).json({
        success: true,
        count: applications.length,
        applications
    });

});

// ======================================
// Get All Applications (Admin)
// ======================================
export const getAllApplications = asyncHandler(async (req, res) => {

    const applications = await Application.find()
        .populate("student", "-password")
        .populate("company")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: applications.length,
        applications
    });

});