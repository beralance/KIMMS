import React, { useState } from "react";
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // reset error

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login Failed");
                return;
            }

            // Update AuthContext
            login({
                token: data.token,
                role: data.role,
                fullName: data.fullName,
                userId: data.userId,
            });

            // Optional callback
            if (onSuccess) onSuccess(data);

            // Redirect based on role
            if (data.role === "admin") navigate("/admin");
            else if (data.role === "staff") navigate("/staff");
            else navigate("/");

        } catch (err) {
            console.error(err);
            setError("Server error. Try again later.");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <Box sx={{ my: 0.5 }}>
                <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        sx={{
                            "& .MuiInputLabel-root": { color: error ? "red" : "grey" },
                            "& .MuiInputLabel-root.Mui-focused": { color: error ? "red" : "" },
                        }}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiInputLabel-root": { color: error ? "red" : "grey" },
                            "& .MuiInputLabel-root.Mui-focused": { color: error ? "red" : "" },
                        }}
                    />
                </Box>

                {error && <Typography color="red" sx={{ mb: 2 }}>{error}</Typography>}

                <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ p: 1 }}>
                    <Typography variant="body1">LOGIN</Typography>
                </Button>
            </Box>
        </form>
    );
}
