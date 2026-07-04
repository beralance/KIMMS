import mongoose from "mongoose";

const staffPermissionSchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        allowedModules: [
            {
                type: String,
                enum: [
                    "dashboard",
                    "inventory",
                    "inventory-management",
                    "product-management",
                    "auction-management",
                    "order",
                    "report",
                ],
            },
        ],
    },
    { timestamps: true }
);

const StaffPermission = mongoose.model(
    "StaffPermission",
    staffPermissionSchema
);
export default StaffPermission;
