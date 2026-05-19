import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

const authMiddleware = asyncHandler(async (req, res, next) => {

    let token;

    // Check Authorization Header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {

        token = req.headers.authorization.split(" ")[1];

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find User
        req.user = await User.findById(decoded.id).select("-password");

        next();

    } else {

        res.status(401);
        throw new Error("Unauthorized Access - No Token");

    }
});

export default authMiddleware;