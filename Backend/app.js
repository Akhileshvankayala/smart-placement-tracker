import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Middleware Imports
import errorMiddleware from "./middlewares/errorMiddleware.js";

// Config dotenv
dotenv.config();

// Initialize Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Smart Placement Tracker API Running"
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);

// Error Middleware
app.use(errorMiddleware);

export default app;