import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// ======================================
// Get Student Profile
// ======================================
export const getStudentProfile = asyncHandler(async (req, res) => {

    const student = await User.findById(req.user._id)
        .select("-password");

    if (!student) {
        res.status(404);
        throw new Error("Student not found");
    }

    res.status(200).json({
        success: true,
        student
    });

});

// ======================================
// Update Student Profile
// ======================================
export const updateStudentProfile = asyncHandler(async (req, res) => {

    const student = await User.findById(req.user._id);

    if (!student) {
        res.status(404);
        throw new Error("Student not found");
    }

    const {
        name,
        cgpa,
        branch,
        backlogs,
        resumeUrl
    } = req.body;

    // Update Fields
    if (name !== undefined) {
        student.name = name;
    }

    if (cgpa !== undefined) {
        student.cgpa = cgpa;
    }

    if (branch !== undefined) {
        student.branch = branch;
    }

    if (backlogs !== undefined) {
        student.backlogs = backlogs;
    }

    if (resumeUrl !== undefined) {
        student.resumeUrl = resumeUrl;
    }

    await student.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        student
    });

});