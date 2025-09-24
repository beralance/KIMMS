import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { verifyEmail, resendCode } from "../../../utils/api";

export default function VerifyForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const { login } = useAuth();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        if (!email) {
            setError('Email not provided. Please go back to signup.')
            return;
        }
        try {
            const data = await verifyEmail({ email, code });
            login({
                userId: data.userId,
                fullName: data.fullName,
                role: data.role,
                token: data.token,
            });
            navigate("/"); // redirect after verification
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResend = async () => {
        setError("");
        setMessage("");
        try {
            await resendCode({ email });
            setMessage("Verification code resent. Check your email.");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
            <Typography variant="h6">Verify Your Email</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>Enter the 6-digit code sent to {email}</Typography>
            <form onSubmit={handleVerify}>
                <TextField
                    label="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                {error && <Typography color="red">{error}</Typography>}
                {message && <Typography color="green">{message}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 1 }}>
                    Verify
                </Button>
                <Button variant="text" onClick={handleResend} fullWidth>
                    Resend Code
                </Button>
            </form>
        </Box>
    );
}
