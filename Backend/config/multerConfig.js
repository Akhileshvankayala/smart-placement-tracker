import multer from "multer";
import path from "path";

// ======================================
// Storage Configuration
// ======================================
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        if (file.mimetype === "text/csv") {
            cb(null, "uploads/csv");
        } else {
            cb(null, "uploads/resumes");
        }

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

    const allowedTypes = [
        "application/pdf",
        "text/csv"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only PDF and CSV files allowed"),
            false
        );
    }

};

// ======================================
// Upload Config
// ======================================
const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});

export default upload;