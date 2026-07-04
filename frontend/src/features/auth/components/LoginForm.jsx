import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Fade,
    Grow,
    Stack,
    Divider,
} from "@mui/material";
import {
    Facebook,
    Google,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
    ScrollSectionLeft,
    ScrollSectionRight,
} from "../../../components/SectionTransitionX";
import { resendCode } from "../../../utils/api";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { signInWithGoogle, facebookProvider, auth } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

export default function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { onRegisterSuccess } = useOutletContext();
    const API_URL = import.meta.env.VITE_API_URL;
    const { login } = useAuth();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const handleGoogleSignIn = async () => {
        setLoading(true);

        try {
            const firebaseUser = await signInWithGoogle();
            console.log("Logged in as: ", firebaseUser.displayName);

            const payload = {
                email: firebaseUser.email,
                fullName: firebaseUser.displayName,
                googleId: firebaseUser.uid,
                avatar:
                    firebaseUser.photoURL ||
                    "https://ryanbajkoeratpmdwvuy.supabase.co/storage/v1/object/public/Kimms%20Bucket/account-avatar-profile-male-01.svg",
            };

            const res = await fetch(`${API_URL}/api/auth/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!data.hasAccount) {
                navigate("/auth/signup");
            }

            if (!res.ok) {
                showSnackbar(data.error || "Google login failed", "error");
                return;
            }

            login({
                token: data.token,
                role: data.role,
                fullName: data.fullName,
                userId: data.userId,
                isLocal: data.isLocal,
                address: data.address,
                avatar: data.avatar,
                phoneNumber: data.phoneNumber,
                email: data.email,
                gender: data.gender,
                googleId: data.googleId,
            });

            if (onSuccess) onSuccess(data);

            if (
                !data.address ||
                !data.address?.region ||
                !data.address?.province ||
                !data.address?.city ||
                !data.address?.street
            ) {
                navigate(`/auth/signup/address?id=${data.userId}`);
            } else if (data.role === "admin") {
                navigate("/admin");
            } else if (data.role === "staff") {
                navigate("/staff");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            showSnackbar(err.message || "Google login failed", "error");
        } finally {
            setLoading(false);
        }
    };

    {
        /*Sign in with system*/
    }
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
                body: JSON.stringify({ email: email.toLowerCase(), password }),
            });

            const data = await res.json();

            const handleNotVerified = async () => {
                try {
                    setLoading(true);
                    setError(data.error || "Login Failed");
                    await resendCode({ email });
                    showSnackbar(
                        `Verification code sent to ${email}.`,
                        "success"
                    );
                    navigate(
                        `/auth/signup/verify?email=${encodeURIComponent(email)}`
                    );
                } catch (err) {
                    showSnackbar(err.message, "error");
                } finally {
                    setLoading(false);
                }
            };

            if (data?.code === "notVerified") {
                await handleNotVerified();
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
                email: data.email,
                gender: data.gender,
                address: data.address,
                phoneNumber: data.phoneNumber,
                avatar: data.avatar,
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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        mb: 5,
                    }}
                >
                    <Fade in={true} timeout={800} mountOnEnter unmountOnExit>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            variant="standard"
                            sx={{
                                input: { color: "white" },
                                "& .MuiInputLabel-root": {
                                    color: error
                                        ? "red"
                                        : "rgba(255, 255, 255, 0.8)",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: error ? "red" : "white",
                                },
                                "& .MuiInput-underline:before": {
                                    borderBottomColor:
                                        "rgba(255, 255, 255, 0.5)", // default / unfocused
                                },
                                "& .MuiInput-underline:hover:before": {
                                    borderBottomColor: "white", // hover
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: "white", // focused
                                },
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
                            variant="standard"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {password && (
                                            <IconButton
                                                onClick={toggleShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff
                                                        sx={{ color: "white" }}
                                                    />
                                                ) : (
                                                    <Visibility
                                                        sx={{ color: "white" }}
                                                    />
                                                )}
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                input: { color: "white" },
                                "& .MuiInputLabel-root": {
                                    color: error
                                        ? "red"
                                        : "rgba(255, 255, 255, 0.8)",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: error ? "red" : "white",
                                },
                                "& .MuiInput-underline:before": {
                                    borderBottomColor:
                                        "rgba(255, 255, 255, 0.5)", // default / unfocused
                                },
                                "& .MuiInput-underline:hover:before": {
                                    borderBottomColor: "white", // hover
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: "white", // focused
                                },
                            }}
                        />
                    </Fade>
                    {error && (
                        <Stack justifyContent={"center"}>
                            <Typography
                                color="red"
                                variant="body2"
                                align="center"
                            >
                                {error}
                            </Typography>
                        </Stack>
                    )}
                </Box>

                <Stack gap={1} sx={{ my: 3 }}>
                    <Fade in={true} timeout={800} mountOnEnter unmountOnExit>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: "rgba(255, 255, 255, 0.2)",
                                border: "1px solid white",
                                py: 1.2,
                                borderRadius: "999px",
                            }}
                        >
                            L O G I N 
                        </Button>
                    </Fade>
                    <Divider>
                        <Typography variant="body1" color="white">
                            or
                        </Typography>
                    </Divider>
                    <Stack alignItems={"center"} justifyContent={"center"}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleGoogleSignIn}
                            fullWidth
                            sx={{
                                bgcolor: "rgba(0, 0, 0, 0.2)",
                                border: "1px solid white",
                                py: 1.2,
                                borderRadius: "999px",
                                "&.Mui-disabled": {
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    color: "grey",
                                    border: "2px solid grey",
                                },
                            }}
                        >
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                gap={1}
                            >
                                Login with
                                <img
                                    src="/google-icon.svg"
                                    alt="google-icon"
                                    style={{ width: 25, aspectRatio: "1/1" }}
                                />
                            </Stack>
                        </Button>
                    </Stack>
                </Stack>

                <Link
                    to={"/forgot-password"}
                    style={{
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="body2" color="white">
                        Forgot Password?
                    </Typography>
                </Link>
            </Box>
            <FullScreenLoader open={loading} />
        </form>
    );
}
