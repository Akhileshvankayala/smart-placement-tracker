import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// ==============================
// Register User
// ==============================
export const registerUser = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        password,
        role,
        cgpa,
        branch,
        backlogs
    } = req.body;

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role,
        cgpa,
        branch,
        backlogs
    });

    // Response
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        token: generateToken(user._id, user.role),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// ==============================
// Login User
// ==============================
export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    if (user.isBlocked) {
        res.status(403);
        throw new Error("Your account has been blocked by the administrator");
    }

    // Compare Password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    // Response
    res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateToken(user._id, user.role),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});