import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            required: true,
            trim: true
        },

        packageOffered: {
            type: Number,
            required: true
        },

        minCGPA: {
            type: Number,
            required: true
        },

        allowedBranches: [
            {
                type: String
            }
        ],

        allowedBacklogs: {
            type: Number,
            default: 0
        },

        deadline: {
            type: Date
        },

        isOpen: {
            type: Boolean,
            default: true
        },

        description: {
            type: String,
            default: ""
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

const Company = mongoose.model("Company", companySchema);

export default Company;