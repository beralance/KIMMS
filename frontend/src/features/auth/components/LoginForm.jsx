import React, { useState } from "react";
import { findAccount } from "../../../utils/Accounts";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = findAccount(email, password);
        if (user) {
            onSuccess(user);
        }
        else {
            setError("Invalid username or password");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{my: .5}}>
                <Box sx={{mb: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
                    <TextField 
                        id="username" 
                        label="Username" 
                        type="email" 
                        variant="outlined" 
                        value={email}
                        fullWidth
                         sx={{
                            "& .MuiInputLabel-root": {
                                color: error ? "red" : "grey", 
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: error ? "red" : "", 
                            },
                        }}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField 
                        id="password" 
                        label="Password" 
                        type="password" 
                        variant="outlined" 
                        value={password}
                        fullWidth
                        sx={{
                            "& .MuiInputLabel-root": {
                                color: error ? "red" : "grey", 
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: error ? "red" : "",
                            },
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'center', mb: 3}}>
                    {error && <Typography variant="body2" sx={{ color: "red" }}>{error}</Typography>}
                </Box>
                <Button variant="contained" color="secondary" type="submit" fullWidth sx={{p: 1}}>
                    <Typography variant="body1">
                        LOGIN
                    </Typography>
                </Button>
            </Box>
        </form>
    );
}
