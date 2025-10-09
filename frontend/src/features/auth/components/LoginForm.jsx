import React, { useState } from "react";
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Fade, Grow, Stack } from "@mui/material";
import { Facebook, Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { ScrollSectionLeft, ScrollSectionRight } from '../../../components/SectionTransitionX';
import { resendCode } from "../../../utils/api";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import FullScreenLoader from '../../../components/FullScreenLoader'
import {signInWithGoogle, facebookProvider, auth} from '../../../firebase'
import { signInWithPopup } from "firebase/auth";
import axios from 'axios'
// s


export default function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {onRegisterSuccess} = useOutletContext()
    const API_URL = import.meta.env.VITE_API_URL;
    const { login } = useAuth();
    const {showSnackbar} = useSnackbar()
    const navigate = useNavigate();

    {/*Show Password*/}
    const toggleShowPassword = () => setShowPassword(prev => !prev);

    {/*Sign in with google*/}
    const handleGoogleSignIn = async () => {
        setLoading(true)

        try {
            const firebaseUser = await signInWithGoogle()
            console.log('Logged in as: ', firebaseUser.displayName)

            const payload = {
                email: firebaseUser.email,
                fullName: firebaseUser.displayName,
                googleId: firebaseUser.uid,
                avatar: firebaseUser.photoURL || 'https://blbymugxhgylzhdmfgeb.supabase.co/storage/v1/object/public/assets/account-avatar-profile-male-01.svg'
            }

            const res = await fetch (`${API_URL}/api/auth/google-login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) {
                showSnackbar(data.error || 'Google login failed', 'error')
                return
            }

            login({
                token: data.token,
                role: data.role,
                fullName: data.fullName,
                userId: data.userId,
                isLocal: data.isLocal,
                address: data.address,
                avatar: data.avatar
            })

            if (onSuccess) onSuccess(data);

            if (!data.address || !data.address?.region || !data.address?.province || !data.address?.city || !data.address?.street ) {
                navigate(`/auth/signup/address?id=${data.userId}`);
            }
            else if (data.role === 'admin') {navigate('/admin');}
            else if (data.role === 'staff') {navigate('/staff');}
            else {navigate('/')}
        }
        catch (err) {
            console.error(err)
            showSnackbar(err.message || 'Google login failed', 'error')
        }
        finally {
            setLoading(false)
        }
    }

    {/*Sign in with google*/}
    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider)
            const user = user.user;

            console.log('Facebook user: ', user)
            /*
            await axios.post('api/users/oauth', {
                uid: user.uid,
            })
            */ 
        }
        catch (error) {
            console.error('Facebook login error:', error)
        }
    }

    {/*Sign in with system*/}
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

            const handleNotVerified = async () => {
                try {
                    setLoading(true);
                    setError(data.error || "Login Failed");
                    await resendCode({email})
                    showSnackbar(`Verification code sent to ${email}.`, 'success')
                    navigate(`/auth/signup/verify?email=${encodeURIComponent(email)}`);
                }
                catch (err) {
                    showSnackbar(err.message, 'error')
                }
                finally {
                    setLoading(false)
                }
            }

            if (data?.code === 'notVerified') {
               await handleNotVerified()
            }

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
                address: data.address,
                avatar: data.avatar
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

                <Stack direction={'row'} justifyContent={'center'} gap={1} py={2}>
                    <Box>
                        <Button variant="contained" color="secondary" onClick={handleGoogleSignIn}>
                            <Google/>
                        </Button>
                    </Box>
                </Stack>
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
            <FullScreenLoader open={loading}/>
        </form>
    );
}
