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
    Collapse
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";


const modulesList = ['dashboard', "inventory", "order", 'report'];
const nestedInventoryModules = [
    { name: "inventory-management", label: "Manage Inventory Tab" },
    { name: "product-management", label: "Manage Product Tab" },
    { name: "auction-management", label: "Manage Auction Tab" },
];

const CreateStaff = ({ open, onClose, onStaffCreated }) => {
    const { token } = useAuth();
    const API_URL = "http://localhost:5000/api";

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [allowedModules, setAllowedModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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
        setError("");
        setSuccess("");

        // validation: inventory is checked but no nested tab
        if (
            allowedModules.includes("inventory") &&
            !allowedModules.some((m) =>
                nestedInventoryModules.map((tab) => tab.name).includes(m)
        )
        ) {
            setError("Please select at least one tab for Inventory");
            setLoading(false);
            return;
        }

        if (!fullName || !email || !password) {
            setError("Please fill all required fields");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/auth/create-staff`,
                { email, password, fullName, allowedModules },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(res.data.message);
            onStaffCreated && onStaffCreated(res.data);
            setFullName("");
            setEmail("");
            setPassword("");
            setAllowedModules([]);
            onStaffCreated()
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Staff</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

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

                    <Typography variant="subtitle1">Assign Modules:</Typography>
                    <Stack direction="column" spacing={1}>
                        {modulesList.map((module) => {
                            const isInventory = module === "inventory";
                            return (
                                <Box key={module}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={allowedModules.includes(module)}
                                                onChange={
                                                isInventory ? toggleInventory : () => toggleModule(module)
                                                }
                                            />
                                        }
                                        label={module}
                                    />

                                    {isInventory && (
                                        <Collapse in={allowedModules.includes("inventory")}>
                                            <Stack direction="column" spacing={0.5} sx={{ ml: 4 }}>
                                                {nestedInventoryModules.map((tab) => (
                                                    <FormControlLabel
                                                        key={tab.name}
                                                        control={
                                                            <Checkbox
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
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? "Creating..." : "Create Staff"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateStaff;
