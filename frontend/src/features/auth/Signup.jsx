// src/pages/auth/SignupPage.jsx
import React from "react";
import { Typography, Button, Box, Container } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import SignupForm from "../../features/auth/components/SignupForm";
import { useAuth } from "../../contexts/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleRegisterSuccess = (user) => {
        login(user);
        navigate(from, { replace: true });
  };

  return (
        <AuthLayout>
            <Container>
                <Box sx={{display: 'flex', justifyContent: 'center', m: 4}}>
                    <img src="/kimms-logo.svg" alt="" style={{width: '50px'}}/>
                </Box>
                <Box>
                    <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}} mb={3}>
                        Let's get you started
                    </Typography>
                    <Typography variant="body2" component="h1" mb={3}>
                        Join our community and start your journey.
                    </Typography>
                                
                </Box>
                <SignupForm onSuccess={handleRegisterSuccess} />

                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        onClick={() => navigate("/auth/login")}
                        sx={{textDecoration: 'underline', }}
                        variant="text"
                        color="secondary"
                    >
                        Already have an account? Login
                    </Button>
                </Box>
            </Container>
        </AuthLayout>
    );
}
