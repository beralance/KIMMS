import React, { useState } from 'react'
import { Box, Button, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { updateUserPassword } from '../../../utils/api'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {useAuth} from '../../../contexts/AuthContext'
import {useSnackbar} from '../../../contexts/SnackbarContext'
import SectionWrapper from '../../../components/SectionWrapper'
import { PenIcon } from 'lucide-react';

const UpdatePassword = () => {
    const {user} = useAuth()
    const {showSnackbar} = useSnackbar()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const userId = user.userId
    const token = user.token
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        
        if (newPassword !== confirmPassword) {
            showSnackbar("Passwords do not match", 'warning');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            showSnackbar('Password must be at least 8 characters, include uppercase, lowercase, and a number', 'warning')
            return
        }

        try {
            setLoading(true)
            const res = await updateUserPassword(userId, currentPassword, newPassword, token)
            showSnackbar(res?.message || 'Password updated successfull', 'success')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
        catch(err) {
            showSnackbar(err.message || 'Failed to updated password', 'error')
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <Box component={'form'} onSubmit={handleSubmit} sx={{p: 2}}>
            <Stack sx={{gap: 2}}>
                <Stack>
                    <Typography variant="subtitle1" color="initial" sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        Update Password
                        <PenIcon/>
                    </Typography>
                    <Typography variant="body2" color="gray">Secure your account by setting a new password that’s strong and unique.</Typography>
                </Stack>
                <SectionWrapper sx={{gap: 2}}>
                    <Stack sx={{gap: 2}}>
                        <Stack>
                            <Typography variant="subtitle2" color="initial">Verify password</Typography>
                            <Typography variant="body2" color="gray">Verify your account by entering your current password</Typography>
                        </Stack>
                        <Stack gap={3}>
                            {/*Current password*/}
                            <TextField
                                disabled={loading}
                                label="Current Password"
                                type={showCurrent ? "text" : "password"}
                                variant="outlined"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                fullWidth
                                InputProps={{
                                    endAdornment: currentPassword && (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowCurrent((p) => !p)} edge="end">
                                                {showCurrent ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {/*Current password*/}
                            <Stack gap={1}>
                                <Stack>
                                    <Typography variant="subtitle2" color="initial">Add new password</Typography>
                                    <Typography variant="body2" color="gray">Password must be at least 8 characters long and include a number, an uppercase, and a lowercase letter</Typography>
                                </Stack>
                                <Stack gap={2}>
                                    <TextField
                                        disabled={loading}
                                        label="New Password"
                                        type={showNew ? "text" : "password"}
                                        variant="outlined"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: newPassword && (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowNew((p) => !p)} edge="end">
                                                        {showNew ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        disabled={loading}
                                        label="Confirm Password"
                                        type={showConfirm ? "text" : "password"}
                                        variant="outlined"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: confirmPassword && (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end">
                                                        {showConfirm ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                        <Button
                            variant='contained'
                            color='secondary'
                            type='submit'
                            disabled={loading}
                            sx={{ mt: 2, width: 180, alignSelf: 'flex-end', backgroundColor: '#333', color: '#fff', '&:hover': { backgroundColor: '#555' } }}
                        >  
                            {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </Stack>
                </SectionWrapper>
            </Stack>
        </Box>
    )
}

export default UpdatePassword
