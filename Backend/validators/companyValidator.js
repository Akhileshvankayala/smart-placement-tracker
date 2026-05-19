export const validateCompanyInput = (data) => {

    const errors = [];

    // Company Name
    if (
        !data.companyName ||
        data.companyName.trim() === ""
    ) {
        errors.push("Company name is required");
    }

    // Role
    if (
        !data.role ||
        data.role.trim() === ""
    ) {
        errors.push("Role is required");
    }

    // Package
    if (
        data.packageOffered === undefined ||
        data.packageOffered <= 0
    ) {
        errors.push("Valid package is required");
    }

    // Minimum CGPA
    if (
        data.minCGPA === undefined ||
        data.minCGPA < 0 ||
        data.minCGPA > 10
    ) {
        errors.push("Minimum CGPA must be between 0 and 10");
    }

    // Allowed Branches
    if (
        !Array.isArray(data.allowedBranches) ||
        data.allowedBranches.length === 0
    ) {
        errors.push("At least one branch is required");
    }

    // Allowed Backlogs
    if (
        data.allowedBacklogs === undefined ||
        data.allowedBacklogs < 0
    ) {
        errors.push("Allowed backlogs cannot be negative");
    }

    return errors;
};