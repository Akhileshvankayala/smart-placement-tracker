import transporter from "../config/mailConfig.js";
import User from "../models/User.js";

// ======================================
// Send Application Confirmation Email
// ======================================
export const sendApplicationConfirmationEmail = async (studentEmail, studentName, companyName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `Application Submitted - ${companyName}`,
            html: `
                <h2>Application Confirmed</h2>
                <p>Dear ${studentName},</p>
                <p>Your application for <strong>${companyName}</strong> has been submitted successfully.</p>
                <p>Track your progress in your student dashboard.</p>
                <p>Best regards,<br>Placement Cell</p>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log("Application confirmation email sent");
    } catch (error) {
        console.error("Email sending error:", error);
    }
};

// ======================================
// Send Round Update Email
// ======================================
export const sendRoundUpdateEmail = async (studentEmail, studentName, companyName, roundStatus) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `Round Update - ${companyName}`,
            html: `
                <h2>Application Status Update</h2>
                <p>Dear ${studentName},</p>
                <p>Your application status for <strong>${companyName}</strong> has been updated to: <strong>${roundStatus}</strong></p>
                <p>Check your dashboard for more details.</p>
                <p>Best regards,<br>Placement Cell</p>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log("Round update email sent");
    } catch (error) {
        console.error("Email sending error:", error);
    }
};

// ======================================
// Send Selection Email
// ======================================
export const sendSelectionEmail = async (studentEmail, studentName, companyName, salaryPackage) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `Congratulations! Selected by ${companyName}`,
            html: `
                <h2>Congratulations!</h2>
                <p>Dear ${studentName},</p>
                <p>We are delighted to inform you that you have been <strong>SELECTED</strong> by <strong>${companyName}</strong>!</p>
                <p><strong>Package:</strong> ${salaryPackage} LPA</p>
                <p>Further details will be shared soon.</p>
                <p>Best regards,<br>Placement Cell</p>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log("Selection email sent");
    } catch (error) {
        console.error("Email sending error:", error);
    }
};

// ======================================
// Send Rejection Email
// ======================================
export const sendRejectionEmail = async (studentEmail, studentName, companyName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `Application Status - ${companyName}`,
            html: `
                <h2>Application Status Update</h2>
                <p>Dear ${studentName},</p>
                <p>Thank you for your interest in ${companyName}. Unfortunately, your application was not selected at this time.</p>
                <p>We encourage you to apply for future opportunities.</p>
                <p>Best regards,<br>Placement Cell</p>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log("Rejection email sent");
    } catch (error) {
        console.error("Email sending error:", error);
    }
};

// ======================================
// Send Block Email
// ======================================
export const sendBlockEmail = async (studentEmail, studentName, isBlocked) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: isBlocked ? "Account Access Restricted" : "Account Access Restored",
            html: `
                <h2>Account Status Update</h2>
                <p>Dear ${studentName},</p>
                ${isBlocked 
                    ? "<p>Your access to the Placement Tracker platform has been <strong>blocked</strong> by the administrator. Please contact the Placement Cell for more details.</p>"
                    : "<p>Your access to the Placement Tracker platform has been <strong>restored</strong>. You can now log in and continue tracking your applications.</p>"
                }
                <p>Best regards,<br>Placement Cell</p>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Block email sent (${isBlocked ? 'Blocked' : 'Unblocked'})`);
    } catch (error) {
        console.error("Email sending error:", error);
    }
};