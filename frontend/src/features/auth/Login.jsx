// src/pages/auth/LoginPage.jsx
import React from "react";
import { Typography, Button, Box, Container } from "@mui/material";
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
            <Container>
                <Box sx={{display: 'flex', justifyContent: 'center', m: 4}}>
                    <img src="/kimms-logo-full.svg" alt="" style={{width: '100px'}} />
                </Box>
                <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}} mb={3}>
                    Welcome Back!
                </Typography>
                <Typography variant="body2" component="h1" mb={3}>
                    Enter your email and password to continue.
                </Typography>
            
                <LoginForm onSuccess={handleLoginSuccess} />
            </Container>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Button
                    onClick={() => navigate("/auth/signup")}
                    sx={{textDecoration: 'underline', }}
                    variant="text"
                    color="secondary"
                >
                    Don’t have an account? Register
                </Button>
            </Box>
        </AuthLayout>
    );
}
