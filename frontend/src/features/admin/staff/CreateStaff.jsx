import React, { useState } from "react";
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Stack,
    Typography,
    Alert,
    Collapse,
    IconButton
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import SectionWrapper from '../../../components/SectionWrapper'
import {toTitleCase} from '../../../utils/stringUtils'
import { ListCheckIcon, UserRoundPenIcon, UserRoundPlusIcon, XIcon } from 'lucide-react'
import {useSnackbar} from '../../../contexts/SnackbarContext'

const modulesList = ['dashboard', "inventory", "order", 'report'];
const nestedInventoryModules = [
    { name: "inventory-management", label: "Manage Inventory Tab" },
    { name: "product-management", label: "Manage Product Tab" },
    { name: "auction-management", label: "Manage Auction Tab" },
];

const CreateStaff = ({ open, onClose, onStaffCreated }) => {
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;
    const {showSnackbar} = useSnackbar()

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [allowedModules, setAllowedModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const toggleModule = (moduleName) => {
        setAllowedModules((prev) =>
            prev.includes(moduleName)
                ? prev.filter((m) => m !== moduleName)
                : [...prev, moduleName]
        );
    };

    const toggleInventory = () => {
        setAllowedModules((prev) => {
            if (prev.includes("inventory")) {
                // uncheck inventory -> also uncheck nested
                return prev.filter(
                (m) =>
                    m !== "inventory" &&
                    !nestedInventoryModules.some((tab) => tab.name === m)
                );
            } else {
                // check inventory
                return [...prev, "inventory"];
            }
        });
    };

    const toggleNestedTab = (tabName) => {
        setAllowedModules((prev) =>
            prev.includes(tabName)
                ? prev.filter((m) => m !== tabName)
                : [...prev, tabName]
        );
    };

    const handleSubmit = async () => {
        setLoading(true);

        // validation: inventory is checked but no nested tab
        if (
            allowedModules.includes("inventory") &&
            !allowedModules.some((m) =>
                nestedInventoryModules.map((tab) => tab.name).includes(m)
        )) 
        {
            showSnackbar("Please select at least one tab for Inventory", 'warning');
            setLoading(false);
            return;
        }

        if (!fullName || !email || !password) {
            showSnackbar("Please fill all required fields", 'warning');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/api/auth/create-staff`,
                { email, password, fullName, allowedModules },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showSnackbar(res.data.message || 'Account created successfully', 'success');
            onStaffCreated && onStaffCreated(res.data);
            setFullName("");
            setEmail("");
            setPassword("");
            setAllowedModules([]);
            onStaffCreated()
        } catch (err) {
            showSnackbar(err.response?.data?.error || "Something went wrong", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <SectionWrapper sx={{gap: 3, bgcolor: '#f0f0f0', position: 'relative'}}>
                <IconButton onClick={onClose} disabled={loading} sx={{position: 'absolute', top: 10, right: 10}}>
                    <XIcon/>
                </IconButton>
                <Stack sx={{mt: 2}}>
                    <Typography variant="subtitle1" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <UserRoundPlusIcon/>
                        Create staff account
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Register a staff account and assign module permissions
                    </Typography>
                </Stack>
                <Stack>
                    <Stack spacing={3}>
                        <SectionWrapper sx={{gap: 2}}>
                            <Stack>
                                <Typography variant="subtitle2" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <UserRoundPenIcon/>
                                    Add account
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Enter user details to add a new account
                                </Typography>
                            </Stack>
                            <Stack gap={2}>
                                <TextField
                                    label="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                />
                            </Stack>
                        </SectionWrapper>
                        <Stack>
                            <SectionWrapper sx={{gap: 1}}>
                                <Stack>
                                    <Typography variant="subtitle1" color="secondary" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <ListCheckIcon/>
                                        Assign modules
                                    </Typography>
                                    <Typography variant="body2" color="gray">
                                        Grant or restrict access to specific system modules
                                    </Typography>
                                </Stack>
                                <Stack direction="column" gap={1} sx={{p: 1}}>
                                    {modulesList.map((module) => {
                                        const isInventory = module === "inventory";
                                        return (
                                            <Box key={module}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            color="secondary"
                                                            checked={allowedModules.includes(module)}
                                                            onChange={
                                                            isInventory ? toggleInventory : () => toggleModule(module)
                                                            }
                                                        />
                                                    }
                                                    label={toTitleCase(module)}
                                                />

                                                {isInventory && (
                                                    <Collapse in={allowedModules.includes("inventory")}>
                                                        <Stack direction="column" spacing={0.5} sx={{ ml: 4 }}>
                                                            {nestedInventoryModules.map((tab) => (
                                                                <FormControlLabel
                                                                    key={tab.name}
                                                                    control={
                                                                        <Checkbox
                                                                            color="#777777ff"
                                                                            checked={allowedModules.includes(tab.name)}
                                                                            onChange={() => toggleNestedTab(tab.name)}
                                                                        />
                                                                    }
                                                                    label={tab.label}
                                                                />
                                                            ))}
                                                        </Stack>
                                                    </Collapse>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </SectionWrapper>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack>
                    <Button onClick={handleSubmit} variant="contained" color="secondary" disabled={loading}>
                        {loading ? "Creating..." : "Create Staff"}
                    </Button>
                </Stack>
            </SectionWrapper>
        </Dialog>
    );
};

export default CreateStaff;
