import React, { useRef, useState } from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { verifyEmail, resendCode } from "../../../utils/api";

export default function VerifyForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const { login } = useAuth();
    const email = searchParams.get('email') || '';
    const [codes, setCodes] = useState(["", "", "", "", "", ""]);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const inputsRef = useRef([]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        if (!email) {
            setError('Email not provided. Please go back to signup.')
            return;
        }
        try {
            const data = await verifyEmail({ email, code: combinedCode });
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
    const handleChange = (index, value) => {
        if (/^\d?$/.test(value)) { // allow only one digit
            const newCodes = [...codes];
            newCodes[index] = value;
            setCodes(newCodes);

            // move to next if value entered
            if (value && index < inputsRef.current.length - 1) {
                inputsRef.current[index + 1].focus();
            }
        }
    };

     const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !codes[index] && index > 0) {
            inputsRef.current[index - 1].focus();
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
    
    const combinedCode = codes.join("");
    console.log(combinedCode)

    return (
        <Box>
            <Box 
                sx={{
                    backgroundImage: 'url(/modern-clean-interior-design.jpg)',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
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
                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    backdropFilter: 'blur(10px)',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    pb: 10,
                }}
            >
                <Stack 
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 5,
                        py: 10,
                        px: 2
                    }}
                >
                    <Stack justifyContent={'center'} alignItems={'center'}>
                        <Typography variant="h5" color="white" gutterBottom>Verify Your Email</Typography>
                        <Typography variant="body1" align="center" color="white">Enter the 6-digit code sent to {email}</Typography>
                    </Stack>
                    <form onSubmit={handleVerify} style={{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}>
                        <Stack direction="row" gap={1} justifyContent="center">
                            {codes.map((digit, index) => (
                            <TextField
                                key={index}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                inputRef={(el) => (inputsRef.current[index] = el)}
                                inputProps={{ maxLength: 1, color: 'white', style: { textAlign: "center" } }}
                                sx={{ 
                                    width: 50,
                                    border: '2px solid white',
                                    borderRadius: 1,
                                    my: 5,
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                    "& .MuiOutlinedInput-input": {
                                        color: "white",
                                    }
                                }}
                            />
                            ))}
                        </Stack>
                        {error && <Typography color="red">{error}</Typography>}
                        {message && <Typography color="green">{message}</Typography>}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            sx={{
                                mb: 1,
                                border: '1px solid white',
                                py: 1.5,
                                borderRadius: '999px',
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            Verify
                        </Button>
                        <Button variant="text" sx={{color: 'white'}} onClick={handleResend}>
                            Resend Code
                        </Button>
                    </form>
                </Stack>
            </Box>
        </Box>
    );
}
