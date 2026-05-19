export const validateRegisterInput = (data) => {

    const errors = [];

    // Name Validation
    if (!data.name || data.name.trim() === "") {
        errors.push("Name is required");
    }

    // Email Validation
    if (!data.email || data.email.trim() === "") {
        errors.push("Email is required");
    }

    // Password Validation
    if (!data.password || data.password.length < 6) {
        errors.push(
            "Password must be at least 6 characters"
        );
    }

    return errors;
};

// ======================================
// Login Validation
// ======================================
export const validateLoginInput = (data) => {

    const errors = [];

    // Email Validation
    if (!data.email || data.email.trim() === "") {
        errors.push("Email is required");
    }

    // Password Validation
    if (!data.password || data.password.trim() === "") {
        errors.push("Password is required");
    }

    return errors;
};