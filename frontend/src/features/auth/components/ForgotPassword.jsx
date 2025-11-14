import React, { useEffect, useState } from "react";
import { resetPassword, resendCode, forgotPassword } from "../../../utils/api";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { updateUserPassword } from "../../../utils/api";
import {
    EmojiPeople,
    MailRounded,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import SectionWrapper from "../../../components/SectionWrapper";
import { PenIcon } from "lucide-react";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";

const COOLDOWN_SECONDS = 60;

const ForgotPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [code, setCode] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [isSent, setIsSent] = useState(false);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (cooldown > 0) return;
        setLoadingEmail(true);

        if (!email) {
            setLoadingEmail(false);
            return showSnackbar("Please enter your email address", "warning");
        }
        try {
            const res = await forgotPassword({ email });
            setIsSent(res.isSent);
            showSnackbar(`Code sent to ${email}`, "success");
            setCooldown(COOLDOWN_SECONDS);
        } catch (err) {
            showSnackbar(err.message || "Something went wrong", "error");
        } finally {
            setLoadingEmail(false);
        }
    };

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);
    const handleCodeChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) {
            setCode(value);
        }
    };
    const handleReset = async (e) => {
        e.preventDefault();

        if (!code || !newPassword || !confirmPassword) {
            setLoading(false);
            return showSnackbar("Please fill in all fields", "warning");
        }
        if (newPassword !== confirmPassword) {
            return showSnackbar("Password do not match", "warning");
        }
        setLoading(true);

        try {
            const res = await resetPassword({ email, code, newPassword });
            showSnackbar(
                res.message || "Password has been reset successfully",
                "success"
            );
            navigate("/auth/login");
        } catch (err) {
            showSnackbar(err.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };
    return (
        <Box sx={{ p: 2, height: "100%", minHeight: "92vh" }}>
            <Stack sx={{ gap: 2 }}>
                <Stack>
                    <Typography
                        variant="subtitle1"
                        color="secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                        Forgot Password
                        <PenIcon />
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Please enter your email address below. A verification
                        code will be sent to you to securely reset your
                        password.
                    </Typography>
                </Stack>
                <SectionWrapper sx={{ gap: 2 }}>
                    <Stack>
                        <Typography variant="body1" color="secondary">
                            Enter email address
                        </Typography>
                    </Stack>
                    <form onSubmit={handleSendCode}>
                        <Stack
                            direction={"row"}
                            alignItems={"center"}
                            gap={1}
                            height={55}
                        >
                            <TextField
                                label="Email"
                                type="email"
                                disabled={isSent}
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value.toLowerCase())
                                }
                                sx={{ width: "100%" }}
                            />
                            {cooldown === 0 && (
                                <Button
                                    variant={isSent ? "text" : "contained"}
                                    color="secondary"
                                    disabled={cooldown > 0}
                                    type="submit"
                                    sx={{ minHeight: "100%" }}
                                >
                                    {loadingEmail ? (
                                        <CircularProgress
                                            color="white"
                                            sx={{ p: 1 }}
                                        />
                                    ) : (
                                        <>
                                            {isSent ? (
                                                "Resend"
                                            ) : (
                                                <MailRounded />
                                            )}
                                        </>
                                    )}
                                </Button>
                            )}
                        </Stack>
                        {cooldown > 0 && (
                            <Typography
                                variant="body2"
                                color="gray"
                                sx={{ mt: 1, mx: 1 }}
                            >
                                Resend after {cooldown}
                            </Typography>
                        )}
                    </form>
                </SectionWrapper>
                {isSent && (
                    <SectionWrapper>
                        <form onSubmit={handleReset}>
                            <Stack sx={{ gap: 2 }}>
                                <Stack gap={3}>
                                    <Stack gap={3}>
                                        <Stack gap={1}>
                                            <Stack>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="secondary"
                                                >
                                                    Enter verification code
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                ></Typography>
                                            </Stack>

                                            <TextField
                                                disabled={loading}
                                                label="Verification Code"
                                                value={code}
                                                onChange={handleCodeChange}
                                                placeholder="Enter 6-digit code"
                                                fullWidth
                                                required
                                                inputProps={{ maxLength: 6 }}
                                            />
                                        </Stack>
                                        <Stack gap={1}>
                                            <Stack>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="secondary"
                                                >
                                                    Enter verification code Set
                                                    a new password
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                >
                                                    Password must be at least 8
                                                    characters long and include
                                                    a number, an uppercase, and
                                                    a lowercase letter
                                                </Typography>
                                            </Stack>
                                            <Stack gap={2}>
                                                <TextField
                                                    disabled={loading}
                                                    label="New Password"
                                                    type={
                                                        showNew
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    variant="outlined"
                                                    value={newPassword}
                                                    onChange={(e) =>
                                                        setNewPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    fullWidth
                                                    InputProps={{
                                                        endAdornment:
                                                            newPassword && (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            setShowNew(
                                                                                (
                                                                                    p
                                                                                ) =>
                                                                                    !p
                                                                            )
                                                                        }
                                                                        edge="end"
                                                                    >
                                                                        {showNew ? (
                                                                            <VisibilityOff />
                                                                        ) : (
                                                                            <Visibility />
                                                                        )}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                    }}
                                                />
                                                <TextField
                                                    disabled={loading}
                                                    label="Confirm Password"
                                                    type={
                                                        showConfirm
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    variant="outlined"
                                                    value={confirmPassword}
                                                    onChange={(e) =>
                                                        setConfirmPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    fullWidth
                                                    InputProps={{
                                                        endAdornment:
                                                            confirmPassword && (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            setShowConfirm(
                                                                                (
                                                                                    p
                                                                                ) =>
                                                                                    !p
                                                                            )
                                                                        }
                                                                        edge="end"
                                                                    >
                                                                        {showConfirm ? (
                                                                            <VisibilityOff />
                                                                        ) : (
                                                                            <Visibility />
                                                                        )}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                    }}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        width: 180,
                                        alignSelf: "flex-end",
                                        backgroundColor: "#333",
                                        color: "#fff",
                                        "&:hover": { backgroundColor: "#555" },
                                    }}
                                >
                                    {loading
                                        ? "Updating..."
                                        : "Update Password"}
                                </Button>
                            </Stack>
                        </form>
                    </SectionWrapper>
                )}
            </Stack>
            <FullScreenLoader open={loading} />
        </Box>
    );
};

export default ForgotPassword;
