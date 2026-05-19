const checkEligibility = (student, company) => {

    const isCGPAEligible =
        student.cgpa >= company.minCGPA;

    const isBranchEligible =
        company.allowedBranches.includes(student.branch);

    const isBacklogEligible =
        student.backlogs <= company.allowedBacklogs;

    return (
        isCGPAEligible &&
        isBranchEligible &&
        isBacklogEligible
    );
};

export default checkEligibility;