import multer from "multer";
import path from "path";
import fs from "fs";

// ======================================
// Ensure Upload Directories Exist
// ======================================
const uploadDirs = ["uploads/resumes", "uploads/csv"];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// ======================================
// Storage Configuration
// ======================================
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/resumes");
    },

    filename: function (req, file, cb) {

        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueSuffix + path.extname(file.originalname)
        );
    }
});

// ======================================
// File Filter
// ======================================
const fileFilter = (req, file, cb) => {

    // Allowed Types
    const allowedFileTypes = [
        "application/pdf",
        "text/csv"
    ];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only PDF and CSV files are allowed"),
            false
        );
    }
};

// ======================================
// Multer Upload Config
// ======================================
const upload = multer({

    storage,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },

    fileFilter
});

export default upload;