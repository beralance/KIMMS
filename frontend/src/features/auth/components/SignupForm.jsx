import React, { useState } from "react";
import { addAccount, findAccountByEmail } from "../../../utils/Accounts";
import { Box, TextField, Button, Typography, IconButton, InputAdornment, } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function SignUpForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password || !confirmPassword || !fullName) {
            return setError("All fields are required");
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        const exists = findAccountByEmail(email);
        if (exists) return setError("Account already exists");

        const newUser = { email, password, name: fullName, role: "user" };
        addAccount(newUser);
        onSuccess(newUser);
    };

    const labelSx = (hasError) => ({
        "& .MuiInputLabel-root": {
            color: hasError ? "red" : "grey",
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: hasError ? "red" : "",
        },
    });

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{my: .5}}>
                <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        id="fullName"
                        label="Full Name"
                        type="text"
                        variant="standard"
                        value={fullName}
                        fullWidth
                        sx={labelSx(error)}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        variant="standard"
                        value={email}
                        fullWidth
                        sx={labelSx(error)}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="standard"
                        value={password}
                        fullWidth
                        sx={labelSx(error)}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: password && ( // only show icon if password has value
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                        sx={{p: 1.5}}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        type={showConfirm ? "text" : "password"}
                        variant="standard"
                        value={confirmPassword}
                        fullWidth
                        sx={labelSx(error)}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment: confirmPassword && ( // only show icon if confirm has value
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirm((prev) => !prev)}
                                        edge="end"
                                        sx={{p: 1.5}}
                                    >
                                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    {error && <Typography variant="body2" sx={{ color: "red" }}>{error}</Typography>}
                </Box>
                <Button variant="contained" color="secondary" type="submit" fullWidth sx={{ p: 1 }}>
                    <Typography variant="body1">Sign Up</Typography>
                </Button>
            </Box>
        </form>
    );
}
