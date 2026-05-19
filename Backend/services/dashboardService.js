import User from "../models/User.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";

// ======================================
// Get Dashboard Statistics
// ======================================
export const fetchDashboardStats = async () => {

    // Total Students
    const totalStudents = await User.countDocuments({
        role: "student"
    });

    // Total Companies
    const totalCompanies = await Company.countDocuments();

    // Total Applications
    const totalApplications = await Application.countDocuments();

    // Selected Students
    const selectedStudents = await Application.countDocuments({
        status: "SELECTED"
    });

    // Company-wise Stats
    const companyStats = await Application.aggregate([

        {
            $group: {
                _id: "$company",
                totalApplicants: {
                    $sum: 1
                }
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

    return {
        totalStudents,
        totalCompanies,
        totalApplications,
        selectedStudents,
        companyStats
    };
};