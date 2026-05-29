import fs from "fs";

import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// ======================================
// Upload Resume
// ======================================
export const uploadResume = asyncHandler(async (req, res) => {

    // Check File
    if (!req.file) {
        res.status(400);
        throw new Error("Resume file is required");
    }

    // Upload to Cloudinary
    let result;
    try {
        result = await cloudinary.uploader.upload(
            req.file.path,
            {
                resource_type: "raw",
                folder: "placement_tracker_resumes"
            }
        );
    } catch (uploadError) {
        // Clean up local file even if upload fails
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error("Cloudinary Upload Error:", uploadError);
        res.status(500);
        throw new Error(`Cloudinary Upload Failed: ${uploadError.message || uploadError}`);
    }

    // Find Student
    const student = await User.findById(req.user._id);

    if (!student) {
        res.status(404);
        throw new Error("Student not found");
    }

    // Save Resume URL
    student.resumeUrl = result.secure_url;

    await student.save();

    // Delete Local File
    fs.unlinkSync(req.file.path);

    res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        resumeUrl: result.secure_url
    });

});