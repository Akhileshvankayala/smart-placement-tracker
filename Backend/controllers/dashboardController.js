import User from "../models/User.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";

import asyncHandler from "../utils/asyncHandler.js";

// ======================================
// Get Dashboard Statistics
// ======================================
export const getDashboardStats = asyncHandler(async (req, res) => {

    // Total Students
    const totalStudents = await User.countDocuments({
        role: "student"
    });

    // Active Companies
    const totalCompanies = await Company.countDocuments({ isOpen: true });

    // Total Applications
    const totalApplications = await Application.countDocuments();

    // Total Selected Students
    const selectedStudents = await Application.countDocuments({
        status: "SELECTED"
    });

    // Company-wise Applications
    const companyStats = await Application.aggregate([

        {
            $group: {
                _id: "$company",
                totalApplicants: { $sum: 1 }
            }
        },

        {
            $lookup: {
                from: "companies",
                localField: "_id",
                foreignField: "_id",
                as: "companyDetails"
            }
        },

        {
            $unwind: "$companyDetails"
        },

        {
            $project: {
                _id: 0,
                companyName: "$companyDetails.companyName",
                totalApplicants: 1
            }
        }

    ]);

    res.status(200).json({
        success: true,

        stats: {
            totalStudents,
            totalCompanies,
            totalApplications,
            selectedStudents,
            companyStats
        }
    });

});