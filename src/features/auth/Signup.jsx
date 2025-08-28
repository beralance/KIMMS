// src/pages/auth/SignupPage.jsx
import React from "react";
import { Typography, Button } from "@mui/material";
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
            <Typography variant="h5" component="h1" mb={3}>
                Register
            </Typography>

            <SignupForm onSuccess={handleRegisterSuccess} />

            <Button
                onClick={() => navigate("/auth/login")}
                sx={{ mt: 2 }}
                variant="text"
                color="primary"
            >
                Already have an account? Login
            </Button>
        </AuthLayout>
    );
}
