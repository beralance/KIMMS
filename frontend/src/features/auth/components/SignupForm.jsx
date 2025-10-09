import React, { useState } from "react";
import { Box, TextField, Button, Typography, InputAdornment, IconButton, Container, Stack, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../../utils/api"; // <- new import
import phData from '../../../data/phData.json'
import { useAuth } from "../../../contexts/AuthContext";
import {useSnackbar} from '../../../contexts/SnackbarContext'
import { ScrollSectionLeft, ScrollSectionRight } from '../../../components/SectionTransitionX';
import { useOutletContext } from "react-router-dom";
import { signupWithGoogle } from "../../../firebase";
import FullScreenLoader from '../../../components/FullScreenLoader'

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
    const [gender, setGender] = useState('')
    const [loading, setLoading] = useState(false)

    const {onRegisterSuccess} = useOutletContext()
    const [error, setError] = useState("");
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const { login } = useAuth()

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

        

        // avatar
        const genderValue = gender || 'other'
        let avatar;
        if (gender === 'male') avatar = 'https://blbymugxhgylzhdmfgeb.supabase.co/storage/v1/object/public/assets/account-avatar-profile-male-02.svg.svg'
        else if (gender === 'female') avatar = 'https://blbymugxhgylzhdmfgeb.supabase.co/storage/v1/object/public/assets/account-avatar-profile-female-01.svg.svg'
        else avatar = 'https://blbymugxhgylzhdmfgeb.supabase.co/storage/v1/object/public/assets/account-avatar-profile-male-01.svg'
        
        const payload = {
            email,
            password,
            fullName,
            phoneNumber,
            gender: genderValue,
            avatar
        };

        // store data to database
        try {
            setLoading(true)
            const data = await signupUser(payload)
            if (onRegisterSuccess) onRegisterSuccess({userId: data.userId, email: data.email})
        } 
        catch (err) {
            let message = 'Signup failed'
            if (err.message === 'User already exists') message = 'Account already created'
            console.error(err)
            showSnackbar(message, 'warning');
        }
        finally {
            setLoading(false)
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true)
        try {
            const firebaseData = await signupWithGoogle();
            
            console.log('')
            console.log('FIREBASE DATA ', firebaseData)

            const payload = {
                email: firebaseData.email,
                fullName: firebaseData.fullName,
                googleId: firebaseData.googleId,
                avatar: firebaseData.avatar || 'https://blbymugxhgylzhdmfgeb.supabase.co/storage/v1/object/public/assets/account-avatar-profile-male-01.svg',
                phoneNumber: firebaseData.phoneNumber || '',
                gender: 'other',
            }

            console.log('PAYLOAD ', firebaseData)
            console.log('PAYLOAD ', payload)

            if (!payload.email || !payload.fullName || !payload.googleId) {
                showSnackbar("Google signup data is incomplete", "error");
                return;
            }

            const backendData = await signupUser(payload)

            console.log('BACKEND DATA', backendData)
            console.log('BACKEND DATA googleID', backendData.userId)

            if (onRegisterSuccess) {
                login({
                    userId: backendData.userId,
                    fullName: backendData.fullName,
                    role: backendData.role,
                    token: backendData.token,
                    address: backendData.address,
                    isLocal: backendData.isLocal,
                    avatar: backendData.avatar
                });
                showSnackbar(backendData.message, 'success')
                navigate(`/auth/signup/address?id=${backendData.userId}`);
            }
        }
        catch (err){
            console.error(err)
            showSnackbar(err.message || 'Google signup failed', 'error' )
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={handleSignup}>
            <Box sx={{ my: 0.5, overflowY: 'auto', maxHeight: '45vh'}}>
                <Stack justifyContent={'center'} sx={{ mb: 2, gap: 2 }}>
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
                            "& .MuiInputLabel-root": {
                                color: 'white'
                            },
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
                    <FormControl variant="standard" fullWidth>
                        <InputLabel sx={{color: 'white', "&.Mui-focused": { color: "white" }, "&.Mui-disabled": { color: "darkgray" },}}>Gender</InputLabel>
                        <Select 
                            labelId="gender"
                            id="gender-select"
                            value={gender} 
                            onChange={e => setGender(e.target.value)}
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
                            <MenuItem value={''} disabled>Select Gender</MenuItem>
                            <MenuItem value={'male'}>Male</MenuItem>
                            <MenuItem value={'female'}>Female</MenuItem>
                            <MenuItem value={'other'}>Other</MenuItem>
                        </Select>
                    </FormControl>
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
                            "& .MuiInputLabel-root": {
                                color: 'white'
                            },
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
                            "& .MuiInputLabel-root": {
                                color: 'white'
                            },
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
                    <TextField
                        disabled={loading}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="standard"
                        value={password}
                        sx={{
                            ...labelSx(error && !password),
                            input: {color: 'white'},
                            "& .MuiInputLabel-root": {
                                color: 'white'
                            },
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
                                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" sx={{mr: 0}}>
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
                            "& .MuiInputLabel-root": {
                                color: 'white'
                            },
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
                                    <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end" sx={{mr: 0}}>
                                        {showConfirm ? <VisibilityOff sx={{color: 'white'}}/> : <Visibility sx={{color: 'white'}}/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>

                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleGoogleSignup}
                    sx={{
                        width: 100,
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid white',
                        py: 1, 
                        borderRadius: '999px',
                        my: 1,
                        "&.Mui-disabled": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            color: "grey",   
                            border: '2px solid grey'    
                        },
                    }}
                > 
                    <img src="/google-icon.svg" alt="google-icon" style={{width: 25, aspectRatio: '1/1'}} />
                </Button>
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
                        !fullName
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
                            SIGN  UP
                        </>
                    }
                </Button>
            </Box>
            <FullScreenLoader open={loading} message="Creating account..."/>
        </form>
    );
}
