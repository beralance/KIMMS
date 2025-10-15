import React, { useState } from "react";
import { Box, TextField, Button, Typography, InputAdornment, IconButton, Container, Stack, FormControl, InputLabel, Select, MenuItem, CircularProgress, Fade } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { updateUserAddress } from "../../../utils/api"; // <- new import
import phData from '../../../data/phData.json'
import { useAuth } from "../../../contexts/AuthContext";
import {useSnackbar} from '../../../contexts/SnackbarContext'
import { ScrollSectionLeft, ScrollSectionRight } from '../../../components/SectionTransitionX';
import { useOutletContext } from "react-router-dom";
import { toTitleCase } from "../../../utils/stringUtils";

const AddressForm = () => {
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [regionCode, setRegionCode] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [searchParams] = useSearchParams()
    const userId = searchParams.get('id') || '';
    const navigate = useNavigate()
    const {showSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const {user, login} = useAuth()
    const token = user.token

    console.log('LOCALITY UGH', user)

    const handleAddressSubmit = async () => {

        // check address field
        if (!regionCode || !province || !city || !street) {
            showSnackbar('Please complete your address before signing up', 'warning')
            return
        }   

        const addressPayload = {
            address: {
                street: street.toLowerCase(),
                city: city.toLowerCase(),
                province: province.toLowerCase(),
                region: regionCode.toLowerCase(),
                postalCode: postalCode.toLowerCase(),
                country: 'Philippines',
            }
        }
    
        try {
            const data = await updateUserAddress(userId, addressPayload, token)
            
            console.log('______TOKEN INSIDE ADDRESS FORM: ', data)
            login({address: data.address, isLocal: data.isLocal, token: data.token})
            navigate('/')
        }
        catch (err) {
            console.error(err)
            showSnackbar('Failed to update address' || err.message, 'error')
        }
    }

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
        <Box>
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
            <Fade in={true} timeout={800} mountOnEnter unmountOnExit>
                <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    onClick={handleAddressSubmit}
                    sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid white',
                        py: 2, 
                        borderRadius: '999px',
                        my: error ? 0 : 3,
                    }}
                >
                    S U B M I T
                </Button>
            </Fade>
        </Box>
    )
}

export default AddressForm
