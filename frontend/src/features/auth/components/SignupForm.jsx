import React, { useState } from "react";
import { Box, TextField, Button, Typography, InputAdornment, IconButton, Container, Stack, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../../utils/api"; // <- new import
import phData from '../../../data/phData.json'
import { useAuth } from "../../../contexts/AuthContext";
import {useSnackbar} from '../../../contexts/SnackbarContext'
import { ScrollSectionLeft, ScrollSectionRight } from '../../../components/SectionTransitionX';
import { useOutletContext } from "react-router-dom";


function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


export default function SignUpForm() {

    // creadential
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // address
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [regionCode, setRegionCode] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const {handleRegisterSuccess} = useOutletContext()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");
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
            if (handleRegisterSuccess) handleRegisterSuccess({userId: data.userId, email: data.email})

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

    // Cities list for selected province in selected region
    const streets = Object.values(phData[regionCode]?.province_list[province]?.municipality_list[city]?.barangay_list || {})

   
    return (
        <form onSubmit={handleSignup}>
            <Box sx={{ my: 0.5, overflowY: 'auto', maxHeight: '45vh'}}>
                <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField 
                        disabled={loading}  
                        label="Full Name" 
                        variant="standard" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        fullWidth 
                        sx={{
                            ...labelSx(error && !fullName),
                            input: {color: 'white'},
                            "& .MuiInput-underline:before": {
                                borderBottomColor: "white",
                            },
                            "& .MuiInput-underline:hover:before": {
                                borderBottomColor: "white",
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: "white", 
                            },
                            "&.Mui-focused": { color: "white" }
                        }}
                    />
                    <TextField 
                        disabled={loading}  
                        label="Email" 
                        type="email" 
                        variant="standard" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            ...labelSx(error && !email),
                            input: {color: 'white'},
                            "& .MuiInput-underline:before": {
                                borderBottomColor: "white",   // default / unfocused
                            },
                            "& .MuiInput-underline:hover:before": {
                                borderBottomColor: "white",  // hover
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: "white",   // focused
                            },
                            "&.Mui-focused": { color: "white" }
                        }}
                    fullWidth />
                    <TextField 
                        disabled={loading}  
                        label="Phone Number (optional)" 
                        type="tel" 
                        variant="standard" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        fullWidth 
                        sx={{
                            ...labelSx(error && !phoneNumber),
                            input: {color: 'white'},
                            "& .MuiInput-underline:before": {
                                borderBottomColor: "white",   // default / unfocused
                            },
                            "& .MuiInput-underline:hover:before": {
                                borderBottomColor: "white",  // hover
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: "white",   // focused
                            },
                            "&.Mui-focused": { color: "white" }
                        }}
                    />

                    {/* Address Fields */}
                    <Box sx={{mt: 2}}>
                        <Typography component='label' color="white">
                            Address:
                        </Typography>
                        <Stack sx={{p: 2, mt: 1, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 3}} spacing={1}>
                            <Stack spacing={2}>
                                <FormControl variant="standard" fullWidth disabled={loading}>
                                    <InputLabel sx={{color: 'white', "&.Mui-focused": { color: "white" }, "&.Mui-disabled": { color: "darkgray" },}}> Region </InputLabel>
                                    <Select 
                                        value={regionCode} 
                                        onChange={e => {setRegionCode(e.target.value); setProvince(''); setCity('');}}
                                        sx={{
                                            color: "white",
                                            "&.Mui-focused": {
                                                color: "white",
                                            },
                                            "&.MuiSvgIcon-root": {
                                                color: "white",
                                            },
                                            "& .MuiSvgIcon-root": { color: "white" }, // arrow
                                            "&:before": {
                                                borderBottom: "1px solid white",
                                            },
                                            "&:after": {
                                                borderBottom: "2px solid white",
                                            },
                                        }}
                                    >
                                        {regions.map(r => (
                                            <MenuItem key={r.code} value={r.code}>{r.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" fullWidth disabled={!regionCode || loading}>
                                    <InputLabel sx={{color: 'white', "&.Mui-focused": { color: "white" }, "&.Mui-disabled": { color: "darkgray" },}}>Province</InputLabel>
                                    <Select 
                                        value={province} 
                                        onChange={e => { setProvince(e.target.value); setCity(""); }}
                                        sx={{
                                            color: "white",
                                            "&.Mui-focused": {
                                                color: "white",
                                            },
                                            "&.MuiSvgIcon-root": {
                                                color: "white",
                                            },
                                            "& .MuiSvgIcon-root": { color: "white" }, // arrow
                                            "&:before": {
                                                borderBottom: "1px solid white",
                                            },
                                            "&:after": {
                                                borderBottom: "2px solid white",
                                            },
                                        }}
                                    >
                                        {provinces.map(p => (
                                            <MenuItem key={p} value={p}>{toTitleCase(p)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl variant="standard" fullWidth disabled={!province || loading}>
                                    <InputLabel sx={{color: 'white', "&.Mui-focused": { color: "white" }, "&.Mui-disabled": { color: "darkgray" },}}>City/Town</InputLabel>
                                    <Select 
                                        value={city} 
                                        onChange={e => setCity(e.target.value)}
                                        sx={{
                                            color: "white",
                                            "&.Mui-focused": {
                                                color: "white",
                                            },
                                            "&.MuiSvgIcon-root": {
                                                color: "white",
                                            },
                                            "& .MuiSvgIcon-root": { color: "white" }, // arrow
                                            "&:before": {
                                                borderBottom: "1px solid white",
                                            },
                                            "&:after": {
                                                borderBottom: "2px solid white",
                                            },
                                        }}
                                    >
                                        {cities.map(c => (
                                            <MenuItem key={c} value={c}>{toTitleCase(c)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                 <FormControl variant="standard" fullWidth disabled={!city || loading}>
                                    <InputLabel sx={{color: 'white', "&.Mui-focused": { color: "white" }, "&.Mui-disabled": { color: "darkgray" },}}>Brgy</InputLabel>
                                    <Select 
                                        value={street} 
                                        onChange={e => setStreet(e.target.value)}
                                        sx={{
                                            color: "white",
                                            "&.Mui-focused": {
                                                color: "white",
                                            },
                                            "&.MuiSvgIcon-root": {
                                                color: "white",
                                            },
                                            "& .MuiSvgIcon-root": { color: "white" }, // arrow
                                            "&:before": {
                                                borderBottom: "1px solid white",
                                            },
                                            "&:after": {
                                                borderBottom: "2px solid white",
                                            },
                                        }}
                                    >
                                        {streets.map(s => (
                                            <MenuItem key={s} value={s}>{toTitleCase(s)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField 
                                    disabled={loading} 
                                    inputProps={{maxLength: 4}} 
                                    label="Postal Code" 
                                    variant="standard" 
                                    value={postalCode} 
                                    onChange={(e) => setPostalCode(e.target.value)} 
                                    fullWidth
                                    sx={{
                                        input: {color: 'white'},
                                        "& .MuiInputLabel-root": { color: error ? "red" : "white", },
                                        "& .MuiInputLabel-root.Mui-focused": { color: error ? "red" : "white" },
                                        "& .MuiInput-underline:before": {
                                            borderBottomColor: "white",   // default / unfocused
                                        },
                                        "& .MuiInput-underline:hover:before": {
                                            borderBottomColor: "white",  // hover
                                        },
                                        "& .MuiInput-underline:after": {
                                            borderBottomColor: "white",   // focused
                                        },
                                        "&.Mui-focused": { color: "white" }
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Box>
                    <TextField
                        disabled={loading}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="standard"
                        value={password}
                        sx={{
                            ...labelSx(error && !password),
                            input: {color: 'white'},
                            "& .MuiInput-underline:before": {
                                borderBottomColor: "white",   // default / unfocused
                            },
                            "& .MuiInput-underline:hover:before": {
                                borderBottomColor: "white",  // hover
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: "white",   // focused
                            },
                            "&.Mui-focused": { color: "white" }
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: password && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                                        {showPassword ? <VisibilityOff sx={{color: 'white'}}/> : <Visibility sx={{color: 'white'}}/>}
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
                        sx={{
                            ...labelSx(error && !confirmPassword),
                            input: {color: 'white'},
                            "& .MuiInput-underline:before": {
                                borderBottomColor: "white",   // default / unfocused
                            },
                            "& .MuiInput-underline:hover:before": {
                                borderBottomColor: "white",  // hover
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: "white",   // focused
                            },
                            "&.Mui-focused": { color: "white" }
                        }}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: confirmPassword && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end">
                                        {showConfirm ? <VisibilityOff sx={{color: 'white'}}/> : <Visibility sx={{color: 'white'}}/>}
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
                    fullWidth
                    sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid white',
                        py: 2, 
                        borderRadius: '999px',
                        my: 3,
                        "&.Mui-disabled": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            color: "grey",   
                            border: '2px solid grey'    
                        },
                    }}
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
                            <Typography variant="body2" color="white">
                                Signing Up
                            </Typography>
                            <CircularProgress color="secondary" size={20} sx={{color: 'white'}}/>
                        </Box> 
                        :
                        <>
                            SIGN UP
                        </>
                    }
                </Button>
            </Box>
            <></>
        </form>
    );
}
