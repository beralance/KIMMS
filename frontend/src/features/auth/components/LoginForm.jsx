import React, { useState } from "react";
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Fade, Grow } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { ScrollSectionLeft, ScrollSectionRight } from '../../../components/SectionTransitionX';

export default function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // reset error

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
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
                isLocal: data.isLocal,
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
                <Box sx={{display: "flex", flexDirection: "column", gap: 2 }}>
                    <Fade in={true} timeout={800} mountOnEnter unmountOnExit>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        sx={{
                            input: {color: 'white'},
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            "& .MuiInputLabel-root": { color: error ? "red" : "white" },
                            "& .MuiInputLabel-root.Mui-focused": { color: error ? "red" : "white" },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'gray', // default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white', // hover border color
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white', // focused border color
                                },
                            }
                        }}
                    />
                    </Fade>
                    <Fade in={true} timeout={800} mountOnEnter unmountOnExit>
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
                                        {showPassword ? <VisibilityOff sx={{color: 'white'}}/> : <Visibility sx={{color: 'white'}}/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            input: {color: 'white'},
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            "& .MuiInputLabel-root": { color: error ? "red" : "white" },
                            "& .MuiInputLabel-root.Mui-focused": { color: error ? "red" : "white" },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'gray', // default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'white', // hover border color
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'white', // focused border color
                                },
                            }
                        }}
                    />
                    </Fade>
                </Box>
                
                {error && 
                    <Typography 
                        color="red" 
                        sx={{
                            my: 3,
                            justifySelf: 'center' 
                        }}
                    >
                        {error}
                    </Typography>
                }

                <Fade in={true} timeout={800} mountOnEnter unmountOnExit>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        sx={{
                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid white',
                            py: 2, 
                            borderRadius: '999px',
                            my: error ? 0 : 3,
                        }}
                    >
                        LOGIN
                    </Button>
                </Fade>
            </Box>
        </form>
    );
}
