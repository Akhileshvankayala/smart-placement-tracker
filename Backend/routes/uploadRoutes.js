import express from "express";

import {
    uploadResume
} from "../controllers/uploadController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ======================================
// Resume Upload Route
// ======================================
router.post(
    "/resume",
    authMiddleware,
    roleMiddleware("student"),
    upload.single("resume"),
    uploadResume
);

export default router;