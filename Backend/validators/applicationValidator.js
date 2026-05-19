const allowedStatuses = [
    "APPLIED",
    "ROUND1",
    "ROUND2",
    "SELECTED",
    "REJECTED"
];

// ======================================
// Validate Application Status
// ======================================
export const validateApplicationStatus = (status) => {

    if (!allowedStatuses.includes(status)) {

        return "Invalid application status";

    }

    return null;
};