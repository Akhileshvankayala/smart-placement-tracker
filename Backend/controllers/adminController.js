import fs from "fs";
import Papa from "papaparse";
import ExcelJS from "exceljs";

import User from "../models/User.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendBlockEmail } from "../services/emailService.js";

// ======================================
// Get All Students
// ======================================
export const getAllStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: "student" }).select("-password");
    res.status(200).json({
        success: true,
        data: students
    });
});

// ======================================
// Bulk Upload Students
// ======================================
export const bulkUploadStudents = asyncHandler(async (req, res) => {

    // Check File
    if (!req.file) {
        res.status(400);
        throw new Error("CSV file is required");
    }

    // Read CSV File
    const file = fs.readFileSync(req.file.path, "utf8");

    // Parse CSV
    const parsedData = Papa.parse(file, {
        header: true,
        skipEmptyLines: true
    });

    const students = parsedData.data;

    const insertedStudents = [];

    // Process Students
    for (const student of students) {

        const {
            name,
            email,
            password,
            cgpa,
            branch,
            backlogs
        } = student;

        // Skip if email exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            continue;
        }

        // Create Student (password will be hashed by pre-save hook)
        const newStudent = await User.create({
            name,
            email,
            password,
            role: "student",
            cgpa: parseFloat(cgpa) || 0,
            branch,
            backlogs: parseInt(backlogs) || 0
        });

        insertedStudents.push(newStudent);
    }

    // Delete Local CSV File
    fs.unlinkSync(req.file.path);

    res.status(201).json({
        success: true,
        message: "Students uploaded successfully",
        totalInserted: insertedStudents.length,
        students: insertedStudents
    });

});

// ======================================
// Toggle Block Status
// ======================================
export const toggleBlockStudent = asyncHandler(async (req, res) => {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== "student") {
        res.status(404);
        throw new Error("Student not found");
    }

    student.isBlocked = !student.isBlocked;
    await student.save();

    // Send block/unblock email notification
    sendBlockEmail(student.email, student.name, student.isBlocked);

    res.status(200).json({
        success: true,
        message: `Student ${student.isBlocked ? "blocked" : "unblocked"} successfully`,
        data: student
    });
});

// ======================================
// Delete Student
// ======================================
export const deleteStudent = asyncHandler(async (req, res) => {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== "student") {
        res.status(404);
        throw new Error("Student not found");
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Student deleted successfully"
    });
});

// ======================================
// Generate Report (Excel)
// ======================================
export const generateReport = asyncHandler(async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Placement Tracker';

    // Fetch data
    const companies = await Company.find();
    const students = await User.find({ role: 'student' }).select('-password');
    const applications = await Application.find().populate('company').populate('student');

    // --- Companies Sheet ---
    const companySheet = workbook.addWorksheet('Companies');
    companySheet.columns = [
        { header: 'Company Names', key: 'name', width: 20 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'LPA', key: 'lpa', width: 10 },
        { header: 'ROLE', key: 'role', width: 15 },
        { header: 'DEADLINE', key: 'deadline', width: 15 },
        { header: 'ALLOWED BRANCHES', key: 'branches', width: 20 },
        { header: 'ELIGIBLITY', key: 'eligibility', width: 30 }
    ];

    companies.forEach(c => {
        companySheet.addRow({
            name: c.companyName,
            status: c.isOpen ? 'Active' : 'Closed',
            lpa: c.packageOffered,
            role: c.role,
            deadline: c.deadline ? new Date(c.deadline).toLocaleDateString() : 'N/A',
            branches: c.allowedBranches && c.allowedBranches.length > 0 ? c.allowedBranches.join(', ') : 'All',
            eligibility: `CGPA >= ${c.minCGPA} | Backlogs <= ${c.allowedBacklogs}`
        });
    });

    // Make header bold
    companySheet.getRow(1).font = { bold: true };

    // --- Students Sheet ---
    const studentSheet = workbook.addWorksheet('Students');
    studentSheet.columns = [
        { header: 'STUDENT NAMES', key: 'name', width: 20 },
        { header: 'EMAIL', key: 'email', width: 25 },
        { header: 'BRANCH', key: 'branch', width: 10 },
        { header: 'CGPA', key: 'cgpa', width: 10 },
        { header: 'RESUME LINK', key: 'resume', width: 40 },
        { header: 'ACTIONS', key: 'actions', width: 10 },
        { header: 'APPLICATIONS GIVEN(COUNT)', key: 'appCount', width: 30 },
        { header: 'STATUS OF APPLICATION', key: 'appStatus', width: 50 },
        { header: 'OFFERS', key: 'offers', width: 10 }
    ];

    students.forEach(s => {
        const studentApps = applications.filter(app => app.student && app.student._id.toString() === s._id.toString());
        const offersCount = studentApps.filter(app => app.status === 'SELECTED').length;
        
        const appStatusArray = studentApps.map(app => {
            const compName = app.company ? app.company.companyName : 'Unknown';
            return `${compName}-${app.status}`;
        });

        studentSheet.addRow({
            name: s.name,
            email: s.email,
            branch: s.branch || 'N/A',
            cgpa: s.cgpa,
            resume: s.resumeUrl || 'N/A',
            actions: s.isBlocked ? 'unblock' : 'block',
            appCount: studentApps.length,
            appStatus: appStatusArray.length > 0 ? appStatusArray.join(',') : 'N/A',
            offers: offersCount
        });
    });

    studentSheet.getRow(1).font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Placement_Report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
});