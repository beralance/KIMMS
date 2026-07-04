// controllers/staffPermissionController.js
import StaffPermission from "../models/StaffPermission.js";
import User from "../models/User.js";

export const setStaffPermissions = async (req, res) => {
    try {
        const { staffId, allowedModules } = req.body;
        const adminId = req.user.id;

        const staffUser = await User.findById(staffId);
        if (!staffUser || staffUser.role !== "staff") {
            return res.status(400).json({ error: "Invalid staff account" });
        }

        const staffPermission = await StaffPermission.findOneAndUpdate(
            { staffId },
            { staffId, adminId, allowedModules },
            { new: true, upsert: true }
        );
        res.json({
            message: "Staff permissions updated",
            staffPermission,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getStaffPermissions = async (req, res) => {
    try {
        const staffId = req.params.staffId;

        const staffPermission = await StaffPermission.findOne({ staffId }).populate("staffId", "fullName email role");

        if (!staffPermission) {
            return res.status(404).json({ error: "No permissions found for this staff" });
        }

        res.json(staffPermission);
    } catch (err) {
        console.error("Error fetching staff permissions:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getAllStaffPermissions = async (req, res) => {
    try {
        const allStaffs = await StaffPermission.find()
            .populate("staffId", "fullName email role");
        res.json(allStaffs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

