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
import { formatNumber, toTitleCase } from "../../../utils/stringUtils";
import SectionWrapper from "../../../components/SectionWrapper";
import { MapPinIcon, PenIcon } from "lucide-react";

const AddressForm = () => {
    const {user, login} = useAuth()
    const {showSnackbar} = useSnackbar()
    const [searchParams] = useSearchParams()
    const userId = searchParams.get('id') || user.userId;
    const navigate = useNavigate()
    const token = user.token

    const [regionCode, setRegionCode] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const addressCheck = user.address?.region || user.address?.province || user.address?.city || user.address?.street;
    const userAddress = toTitleCase(`${user.address?.street}, ${user.address?.city}, ${user.address?.province}, Region ${user.address?.region}, ${user.address?.country}`)

    const handleAddressSubmit = async () => {
        if (!regionCode || !province || !city || !street || !postalCode) {
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
            login({
                address: data.address,
                isLocal: data.isLocal,
                token: data.token
            })
            navigate('/')
            showSnackbar('Address updated successfully!', 'success')
        }
        catch (err) {
            console.error(err)
            showSnackbar('Failed to update address' || err.message, 'error')
        }
    }

    const regions = Object.entries(phData).map(([code, data]) => ({
        code,
        name: data.region_name,
    }))
    const provinces = regionCode
        ? Object.keys(phData[regionCode].province_list)
        : [];
    const cities = regionCode && province
        ? Object.keys(phData[regionCode].province_list[province].municipality_list)
        : [];
    const streets = Object.values(phData[regionCode]?.province_list[province]?.municipality_list[city]?.barangay_list || {})
    
    return (
        <Stack alignContent={'center'} gap={2} sx={{p: 2}}>
            <Stack gap={1} direction={'row'} alignItems={'center'} sx={{p: 1, pb: 0}}>
                <Typography variant="subtitle1" color="black">
                    Delivery Address
                </Typography>
                <PenIcon/>
            </Stack>
            <Stack>
                {addressCheck &&
                    <Stack>
                        <SectionWrapper>
                            <Stack alignItems={'center'} direction={'row'} gap={1}>
                                <MapPinIcon/>
                                <Typography variant="subtitle2" color="initial">
                                    Current Address
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="secondary" sx={{p: 1}}>
                                {userAddress}
                            </Typography>
                        </SectionWrapper>
                    </Stack>
                }
            </Stack>
            <SectionWrapper sx={{gap: 4}}>
                <form>
                    <Stack gap={2}>
                        {addressCheck ?
                            <>
                                <Stack>
                                    <Stack>
                                        <Typography variant="subtitle2" color="initial">Update saved address</Typography>
                                        <Typography variant="body2" color="secondary">
                                            The new address will be applied to your profile as the default shipping address.
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </>
                            :
                            <>
                                <Stack>
                                    <Typography variant="body1" color="initial">
                                        Add a New Shipping Address
                                    </Typography>
                                    <Typography variant="body2" color="secondary">
                                        Please confirm the address details are accurate and complete.
                                    </Typography>
                                </Stack>
                            </>
                        }
                        <Stack spacing={2}>
                            <FormControl variant="outlined" fullWidth disabled={loading}>
                                <InputLabel> Region </InputLabel>
                                <Select 
                                    value={regionCode} 
                                    onChange={e => {setRegionCode(e.target.value); setProvince(''); setCity('');}}
                                >
                                    {regions.map(r => (
                                        <MenuItem key={r.code} value={r.code}>Region {r.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" fullWidth disabled={!regionCode || loading}>
                                <InputLabel>Province</InputLabel>
                                <Select 
                                    value={province} 
                                    onChange={e => { setProvince(e.target.value); setCity(""); }}
                                >
                                    {provinces.map(p => (
                                        <MenuItem key={p} value={p}>{toTitleCase(p)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined" fullWidth disabled={!province || loading}>
                                <InputLabel>City/Town</InputLabel>
                                <Select 
                                    value={city} 
                                    onChange={e => setCity(e.target.value)}
                                >
                                    {cities.map(c => (
                                        <MenuItem key={c} value={c}>{toTitleCase(c)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" fullWidth disabled={!city || loading}>
                                <InputLabel>Brgy</InputLabel>
                                <Select 
                                    value={street} 
                                    onChange={e => setStreet(e.target.value)}
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
                                variant="outlined" 
                                value={postalCode} 
                                onChange={(e) => setPostalCode(e.target.value)} 
                                fullWidth
                            />
                        </Stack>
                    </Stack>
                </form>

                <Fade in={true} timeout={800} mountOnEnter unmountOnExit>
                    <Stack alignItems={'center'}>
                        <Button
                            type="submit" 
                            variant="contained"
                            color="secondary"
                            onClick={handleAddressSubmit}
                            sx={{
                                alignSelf: 'flex-end',
                                width: 150,
                            }}
                        >
                            {addressCheck ? 'Update address' : 'Add address'}
                        </Button>
                    </Stack>
                </Fade>
            </SectionWrapper>
        </Stack>
    )
}

export default AddressForm
