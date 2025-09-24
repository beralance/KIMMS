import React, { useState } from "react";
import { Box, TextField, Button, Typography, InputAdornment, IconButton, Container, Stack, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../../utils/api"; // <- new import
import phData from '../../../data/phData.json'
import { useAuth } from "../../../contexts/AuthContext";
import {useSnackbar} from '../../../contexts/SnackbarContext'

function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


export default function SignUpForm({onSuccess}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [regionCode, setRegionCode] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const {login} = useAuth();
    const { showSnackbar } = useSnackbar()

    const navigate = useNavigate();

    const labelSx = (hasError) => ({
        "& .MuiInputLabel-root": { color: hasError ? "red" : "grey" },
        "& .MuiInputLabel-root.Mui-focused": { color: hasError ? "red" : "" },
    });

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        // check credential field
        if (!email || !password || !confirmPassword || !fullName) {
            showSnackbar("All required fields must be filled", 'warning');
            return;
        }

        // check address field
        if (!regionCode || !province || !city || !street) {
            showSnackbar('Please complete your address before signing up', 'warning')
            return
        }

        // password matching
        if (password !== confirmPassword) {
            showSnackbar("Passwords do not match", 'warning');
            return;
        }

        // email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showSnackbar('Invalid email format', 'warning')
            return
        }

        // password format
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            showSnackbar('Password must be at least 8 characters, include uppercase, lowercase, and a number', 'warning')
            return
        }

        // store data to database
        try {
            setLoading(true)
            // prepare payload (lowercased for consistency)
            const payload = {
                email,
                password,
                fullName,
                phoneNumber,
                address: { 
                    street: street.toLowerCase(),
                    city: city.toLowerCase(), 
                    province: province.toLowerCase(), 
                    region: regionCode.toLowerCase(), 
                    postalCode: postalCode.toLowerCase(),
                },
            };

            // ✅ use centralized API function
            const data = await signupUser(payload);
            
            // call onsuccess to handle login/redirect in signuppage
            if (onSuccess) onSuccess({userId: data.userId, email: data.email})

        } 
        catch (err) {
            showSnackbar(err.message || 'Signup failed', 'warning');
        }
        finally {
            setLoading(false)
        }
    };

    // region list: code + name
    const regions = Object.entries(phData).map(([code, data]) => ({
        code,
        name: data.region_name,
    }))
    // Provinces list for selected region
    const provinces = regionCode
        ? Object.keys(phData[regionCode].province_list)
        : [];
    // Cities list for selected province in selected region
    const cities = regionCode && province
        ? Object.keys(phData[regionCode].province_list[province].municipality_list)
        : [];

   
    return (
        <form onSubmit={handleSignup}>
            <Box sx={{ my: 0.5 }}>
                <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField disabled={loading} label="Full Name" variant="standard" value={fullName} sx={labelSx(error && !fullName)} onChange={(e) => setFullName(e.target.value)} fullWidth />
                    <TextField disabled={loading} label="Email" type="email" variant="standard" value={email} sx={labelSx(error && !email)} onChange={(e) => setEmail(e.target.value)} fullWidth />
                    <TextField disabled={loading} label="Phone Number (optional)" type="tel" variant="standard" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} fullWidth />

                    {/* Address Fields */}
                    <Box sx={{mt: 2}}>
                        <Typography component='label' color="grey">
                            Address:
                        </Typography>
                        <Stack sx={{p: 2, mt: 1, bgcolor: '#f8f8f8', borderRadius: 3}} spacing={1}>
                            <Stack spacing={2}>
                                <FormControl variant="standard" fullWidth disabled={loading}>
                                    <InputLabel> Region </InputLabel>
                                    <Select value={regionCode} onChange={e => {setRegionCode(e.target.value); setProvince(''); setCity('');}}>
                                        {regions.map(r => (
                                            <MenuItem key={r.code} value={r.code}>{r.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" fullWidth disabled={!regionCode || loading}>
                                    <InputLabel>Province</InputLabel>
                                    <Select value={province} onChange={e => { setProvince(e.target.value); setCity(""); }}>
                                        {provinces.map(p => (
                                            <MenuItem key={p} value={p}>{toTitleCase(p)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl variant="standard" fullWidth disabled={!province || loading}>
                                    <InputLabel>City/Town</InputLabel>
                                    <Select value={city} onChange={e => setCity(e.target.value)}>
                                        {cities.map(c => (
                                            <MenuItem key={c} value={c}>{toTitleCase(c)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField disabled={loading} label="Street/Brgy" variant="standard" value={street} onChange={(e) => setStreet(e.target.value)} fullWidth />
                                <TextField disabled={loading} label="Postal Code" variant="standard" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} fullWidth />
                            </Stack>
                        </Stack>
                    </Box>
                    <TextField
                        disabled={loading}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="standard"
                        value={password}
                        sx={labelSx(error && !password)}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: password && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        disabled={loading}
                        label="Confirm Password"
                        type={showConfirm ? "text" : "password"}
                        variant="standard"
                        value={confirmPassword}
                        sx={labelSx(error && !confirmPassword)}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: confirmPassword && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end">
                                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {error && (
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Typography variant="body2" color="red">
                            {error}
                        </Typography>
                    </Box>
                )}

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="secondary" 
                    fullWidth sx={{ p: 1 }}
                    disabled={
                        loading ||
                        !email ||
                        !password ||
                        !confirmPassword ||
                        !fullName ||
                        !regionCode ||
                        !province ||
                        !city ||
                        !street
                    }
                >
                    {loading ? 
                        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}> 
                            <Typography variant="body2" color="initial">
                                Signing Up
                            </Typography>
                            <CircularProgress enableTrackSlot color="secondary" size={20}/>
                        </Box> 
                        :
                        <>
                        Sign Up 
                        </>
                    }
                </Button>
            </Box>
        </form>
    );
}
