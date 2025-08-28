// src/pages/auth/LoginPage.jsx
import React from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import LoginForm from "../../features/auth/components/LoginForm";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || "/";

    const handleLoginSuccess = (user) => {
        login(user);
        navigate(from, { replace: true });
    };

    return (
        <AuthLayout>
            <Typography variant="h5" component="h1" mb={3}>
                Login
            </Typography>

            <LoginForm onSuccess={handleLoginSuccess} />

            <Button
                onClick={() => navigate("/auth/signup")}
                sx={{ mt: 2 }}
                variant="text"
                color="primary"
            >
                Don’t have an account? Register
            </Button>
        </AuthLayout>
    );
}
