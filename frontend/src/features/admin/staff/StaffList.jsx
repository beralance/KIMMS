import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel, Paper, Stack, Collapse } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

// MOVE UPDATE TO NEW COMPONENT
const modulesList = [
    { key: "dashboard", label: "Dashboard" },
    { key: "inventory", label: "Inventory" },
    { key: "inventory-management", label: "Inventory Management" },
    { key: "product-management", label: "Product Management" },
    { key: "auction-management", label: "Auction Management" },
    { key: "order", label: "Orders" },
    { key: "report", label: "Reports" }
];

const StaffList = () => {
    const { token } = useAuth();
    const [staffs, setStaffs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [tempModules, setTempModules] = useState({}); // { staffId: [modules] }
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchStaffs = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/staff-permissions/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStaffs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStaffs();
    }, []);

    const updatePermissions = async (staffId, allowedModules) => {
        try {
            await axios.post(
                `${API_URL}/api/staff-permissions/set-permissions`,
                { staffId, allowedModules },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchStaffs();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteStaff = async (staffId) => {
        if (!window.confirm('Are you sure you want to delete this staff?')) return;
        try {
            await axios.delete(`${API_URL}/api/auth/delete-staff/${staffId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStaffs();
        } catch (err) {
            console.error(err);
        }
    };

    // Toggle checkbox in temp state
    const toggleModule = (staffUserId, moduleKey) => {
        setTempModules((prev) => {
            const current = prev[staffUserId] || [];
            return {
                ...prev,
                [staffUserId]: current.includes(moduleKey)
                    ? current.filter((m) => m !== moduleKey)
                    : [...current, moduleKey],
            };
        });
    };

  // Save changes to backend
    const saveModules = (staffUserId) => {
        const selected = tempModules[staffUserId] || [];

        const hasInventory = selected.includes("inventory");
        const hasManagement =
            selected.includes("inventory-management") ||
            selected.includes("product-management") ||
            selected.includes("auction-management");

        // Rule: If inventory is checked, must have at least one management
        if (hasInventory && !hasManagement) {
            alert("Please select at least one management module when Inventory is checked.");
            return;
        }

        // Rule: If no management is selected, remove inventory automatically
        let finalModules = [...selected];
        if (!hasManagement && hasInventory) {
            finalModules = finalModules.filter((m) => m !== "inventory");
        }
        updatePermissions(staffUserId, tempModules[staffUserId] || []);
        setEditingId(null);
    };

    if (!staffs || staffs.length === 0) {
        return (
            <Typography mt={4} align="center">
                No staff accounts found.
            </Typography>
        );
    }

    return (
        <Stack spacing={2} mt={2}>
            {staffs
                .filter((staff) => staff.staffId)
                .map((staff) => {
                    const staffUserId = staff.staffId._id
                    const isEditing = editingId === staff._id;
                    const currentModules = tempModules[staffUserId] || staff.allowedModules;
                    return (
                        <Paper key={staff._id} sx={{ p: 2 }}>
                            <Typography variant="h6">
                                {staff.staffId?.fullName || staff.staffId?.email}
                            </Typography>

                            <Collapse in={isEditing}>
                                <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
                                    {modulesList.map((module) => {
                                        const isManagement =
                                            ["inventory-management", "product-management", "auction-management"].includes(module.key);
                                        const inventoryChecked = currentModules.includes("inventory");

                                        // Hide managements completely unless inventory is checked
                                        if (isManagement && !inventoryChecked) return null;

                                        return (
                                            <FormControlLabel
                                                key={module.key}
                                                control={
                                                    <Checkbox
                                                        checked={currentModules.includes(module.key)}
                                                        onChange={() => toggleModule(staffUserId, module.key)}
                                                        disabled={isManagement && !inventoryChecked} // disable if inventory not checked
                                                    />
                                                }
                                                label={module.label}
                                            />
                                        );
                                    })}
                                </Box>

                                <Stack direction="row" spacing={1} mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => saveModules(staffUserId)}
                                    >
                                        Done
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setEditingId(null)}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Collapse>

                            {!isEditing && (
                                <Stack direction="row" spacing={1} mt={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setEditingId(staff._id);
                                            setTempModules((prev) => ({
                                                ...prev,
                                                [staffUserId]: staff.allowedModules, // ✅ fix here
                                            }));
                                        }}
                                    >
                                        Edit Permissions
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => deleteStaff(staffUserId)}
                                    >
                                        Delete Account
                                    </Button>
                                </Stack>
                            )}
                        </Paper>
                    );

                })}
        </Stack>
    );
};

export default StaffList;
