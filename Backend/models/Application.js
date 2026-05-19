import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        status: {
            type: String,
            enum: [
                "APPLIED",
                "ROUND1",
                "ROUND2",
                "SELECTED",
                "REJECTED"
            ],
            default: "APPLIED"
        },

        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Prevent Duplicate Applications
applicationSchema.index(
    { student: 1, company: 1 },
    { unique: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;