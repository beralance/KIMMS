import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel, Paper, Stack, Collapse, Container, Divider, IconButton } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import SectionWrapper from '../../../components/SectionWrapper';
import { toTitleCase } from '../../../utils/stringUtils';
import { PenIcon, RefreshCwIcon, RotateCcwIcon, TrashIcon } from 'lucide-react';
import ConfirmDialog from '../../../components/ConfirmDialog'
import { useSnackbar } from '../../../contexts/SnackbarContext';


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
    const {showSnackbar} = useSnackbar()
    const [staffs, setStaffs] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [confirm, setConfirm] = useState(false)
    const [editingId, setEditingId] = useState(null);
    const [tempModules, setTempModules] = useState({}); // { staffId: [modules] }
    const API_URL = import.meta.env.VITE_API_URL;

    const handleConfirmOpen = (staffUserId) => {
        setSelectedStaff(staffUserId)
        setConfirm(true)
    }
    const handleConfirmClose = () => {
        setSelectedStaff(null)
        setConfirm(false)
    }
    
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
        try {
            await axios.delete(`${API_URL}/api/auth/delete-staff/${staffId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            handleConfirmClose()
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
            showSnackbar("Please select at least one management module when Inventory is checked.", 'warning');
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
        <Stack sx={{gap: 1, pb: 2}}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} px={1}>
                <Typography variant="body1" color="initial">
                    Accounts
                </Typography>
                <IconButton onClick={() => fetchStaffs()}>
                    <RotateCcwIcon/>
                </IconButton>
            </Stack>
            {staffs
                .filter((staff) => staff.staffId)
                .map((staff) => {
                    const staffUserId = staff.staffId._id
                    const isEditing = editingId === staff._id;
                    const currentModules = tempModules[staffUserId] || staff.allowedModules;

                    return (
                        <Box key={staff._id}>
                            <SectionWrapper sx={{ bgcolor: '#f0f0f0', gap: 2}}>
                                <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
                                    <Stack>
                                        <Typography variant="subtitle2" color='secondary'>
                                            {toTitleCase(staff.staffId?.fullName)}
                                        </Typography>
                                        <Typography variant="body2" color='gray'>
                                            {staff.staffId?.email}
                                        </Typography>
                                    </Stack>
                                    <Stack>
                                        {!isEditing && (
                                            <Stack direction="row" gap={1}>
                                                <IconButton
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setEditingId(staff._id);
                                                        setTempModules((prev) => ({
                                                            ...prev,
                                                            [staffUserId]: staff.allowedModules, // ✅ fix here
                                                        }));
                                                    }}
                                                >
                                                    <PenIcon style={{fill: '#494949ff', color: '#494949ff'}}/>
                                                </IconButton>
                                                <IconButton onClick={() => handleConfirmOpen(staffUserId)}>
                                                    <TrashIcon style={{color: '#ca2323ff', fill: '#ca2323ff'}}/>
                                                </IconButton>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                                <Collapse in={isEditing} sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2}} mountOnEnter unmountOnExit>
                                    <Stack gap={2}>
                                        <Stack>
                                            <Typography variant="subtitle2" color="secondary">Permissions</Typography>
                                            <Typography variant="body2" color="gray">Modify existing access rights and privileges</Typography>
                                        </Stack>
                                        <Stack sx={{p: 1}}>
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
                                                                color='secondary'
                                                                checked={currentModules.includes(module.key)}
                                                                onChange={() => toggleModule(staffUserId, module.key)}
                                                                disabled={isManagement && !inventoryChecked} // disable if inventory not checked
                                                            />
                                                        }
                                                        label={module.label}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" justifySelf={'flex-end'} gap={2}>
                                        <Button variant="text" color='secondary' onClick={() => setEditingId(null)}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => saveModules(staffUserId)}>
                                            Done
                                        </Button>
                                    </Stack>
                                </Collapse>
                            </SectionWrapper>
                        </Box>
                    );

                })}
                <ConfirmDialog
                    open={confirm}
                    title='Delete Staff?'
                    content='Are you sure you want to delete this account? This account cannot be recovered after deletion.'
                    onConfirm={() => deleteStaff(selectedStaff)}
                    onCancel={() => handleConfirmClose()}
                    confirmText='Delete'
                    cancelText='Cancel'
                    color='error'
                />
        </Stack>
    );
};

export default StaffList;
