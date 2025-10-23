import React from 'react'
import { Box, Fade, Container, MenuItem, Stack, Button, TextField, Typography } from '@mui/material'
import { updateUserProfile } from '../../../utils/api'
import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import SectionWrapper from '../../../components/SectionWrapper'
import { PenIcon, UserCogIcon } from 'lucide-react'
import { useSnackbar } from '../../../contexts/SnackbarContext'
import { toTitleCase } from '../../../utils/stringUtils'


const GeneralUpdate = () => {
    const {user, login, token} = useAuth()
    const [fullName, setFullName] = useState(user?.fullName || '')
    const [email] = useState(user?.email || '')
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
    const [gender, setGender] = useState(user?.gender || '')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const {showSnackbar} = useSnackbar()

    
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
            showSnackbar('Phone number should be 11 digits', 'warning');
        }

        setPhoneNumber(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const payload = {fullName: toTitleCase(fullName), gender, phoneNumber};
            const res = await updateUserProfile(user.userId, payload, token);
            console.log('RESPONSE', res)
            login({
                fullName: res.user?.fullName,
                gender: res.user?.gender,
                phoneNumber: res.user?.phoneNumber,
            });
            setFullName('')
            setPhoneNumber('')
            setGender('')
            showSnackbar(res.message || 'Profile updated successfully!', 'success')
        }
        catch (err) {
            setError(err.message || 'Failed to update profile')
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <Box sx={{p: 2, height: '95vh'}}>
            <form onSubmit={handleSubmit}>
                <Stack sx={{mb: 2}}>
                    <Typography variant="subtitle1" color="initial" sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        Basic Information 
                        <PenIcon/>
                    </Typography>
                    <Typography variant="body2" color="secondary">
                        Keep your information current to avoid issues with your orders and deliveries
                    </Typography>
                </Stack>
                <SectionWrapper sx={{p: 2}}>
                    <Stack sx={{mb: 3}}>
                        <Typography variant="subtitle2" color="initial">
                            Update your profile
                        </Typography>
                        <Typography variant="body2" color="secondary">
                            Fill in or update your personal details below.
                        </Typography>
                    </Stack>
                    <Stack gap={2}>
                        <Fade in={true} timeout={600}>
                            <TextField
                                label="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Fade>

                        <Fade in={true} timeout={700}>
                            <TextField
                                label="Phone Number"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                fullWidth
                                variant="outlined"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 11 }}
                                placeholder="09XXXXXXXXX"
                            />
                        </Fade>

                        <Fade in={true} timeout={800}>
                            <TextField
                                label="Gender"
                                select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                fullWidth
                                variant="outlined"
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>
                        </Fade>

                        {error && <Typography color="error">{error}</Typography>}

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 2, width: 150, alignSelf: 'flex-end', backgroundColor: '#333', color: '#fff', '&:hover': { backgroundColor: '#555' } }}
                        >
                            {isLoading ? 'Saving...' : 'Update Profile'}
                        </Button>
                    </Stack>
                </SectionWrapper>
            </form>
        </Box>
    )
}

export default GeneralUpdate
