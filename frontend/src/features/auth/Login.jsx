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
        <Box>
            <Box 
                sx={{
                    backgroundImage: 'url(/minimalist-black-interior-with-black-sofa.jpg)',
                    backgroundPosition: 'center',
                    backgroundSize: '100%',
                    minHeight: '100vh',
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: -1,
                }}
            />
            <Box 
                sx={{
                    width: '100%',
                    height: '100vh',
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'transparent',
                }}
            >
                <AuthLayout>
                    <Container 
                        sx={{
                            borderRadius: 5,
                            overflowY: 'auto',
                            maxHeight: '100vh',
                            bgcolor: 'rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <Box sx={{display: 'flex', justifyContent: 'center', m: 4}}>
                            <img src="/kimms-logo-full.svg" alt="" style={{width: '150px', filter: 'invert(1)'}}/>
                        </Box>
                        <Typography variant="h5" component="h1" color="white" sx={{fontWeight: 'bold'}}>
                            Welcome Back!
                        </Typography>
                        <Typography variant="body2" color="white" component="h1" mb={3}>
                            Enter your email and password to continue.
                        </Typography>
                    
                        <LoginForm onSuccess={handleLoginSuccess} />
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <Button
                                onClick={() => navigate("/auth/signup")}
                                sx={{textDecoration: 'underline', color: 'white'}}
                                variant="text"
                            >
                                Don’t have an account? Register
                            </Button>
                        </Box>
                    </Container>
                </AuthLayout>
            </Box>
        </Box>
    );
}
