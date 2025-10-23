import React, { useState } from 'react'
import { Box, Stack, TextField, Button, CircularProgress, Typography } from '@mui/material'
import { updateUserEmail, verifyUpdatedEmail } from '../../../utils/api'
import { useAuth } from '../../../contexts/AuthContext'
import { useSnackbar} from '../../../contexts/SnackbarContext'
import SectionWrapper from '../../../components/SectionWrapper'
import { PenIcon } from 'lucide-react'

const UpdateEmail = () => {
    const {user} = useAuth()
    const { showSnackbar } = useSnackbar()
    const token = user.token

    const [currentPassword, setCurrentPassword] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)

    const handleUpdateEmail = async (e) => {
        e.preventDefault()

        if (!newEmail || !currentPassword) {
            showSnackbar('Please fill in all fields', 'warning')
            return
        }

        try {
            setLoading(true)
            const res = await updateUserEmail(user._id, currentPassword, newEmail, token)
            showSnackbar(res.message || 'Verification code sent to your new email', 'success')
            setStep(2)
        } catch (err) {
            showSnackbar(err.message || 'Failed to send verification code', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault()

        if (!code) {
            showSnackbar('Please enter the verification code', 'warning')
            return
        }

        try {
            setLoading(true)
            const res = await verifyUpdatedEmail(user._id, code, token)
            showSnackbar(res.message || 'Email updated successfully!', 'success')
            setStep(1)
            setCode('')
            setNewEmail('')
            setCurrentPassword('')
        } catch (err) {
            showSnackbar(err.message || 'Verification failed', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{p: 2, height: '95vh'}}>
            <Stack sx={{mb: 2}}>
                <Typography variant="subtitle1" color="initial" sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    Email Address
                    <PenIcon/>
                </Typography>
                <Typography variant="body2" color="secondary">
                    Update your account email address to stay connected and receive important notifications
                </Typography>
            </Stack>
            {step === 1 ? (
                <form onSubmit={handleUpdateEmail}>
                    <SectionWrapper>
                        <Stack gap={3}>
                            <Stack>
                                <Stack sx={{mb: 2}}>
                                    <Typography variant="subtitle2" color="initial">
                                        Verify with Current Password
                                    </Typography>
                                    <Typography variant="body2" color="secondary">
                                        For your security, please confirm your identity by entering your current password
                                    </Typography>
                                </Stack>
                                <TextField
                                    label="Current Password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    fullWidth
                                />
                            </Stack>
                            <Stack>
                                <Stack sx={{mb: 2}}>
                                    <Typography variant="subtitle2" color="initial">
                                        New Email Address
                                    </Typography>
                                    <Typography variant="body2" color="secondary">
                                        Type your new email address. Verification is required before the change is applied
                                    </Typography>
                                </Stack>
                                <TextField
                                    label="New Email"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    fullWidth
                                />
                            </Stack>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{width: 'auto', alignSelf: 'flex-end', backgroundColor: '#333', color: '#fff', '&:hover': { backgroundColor: '#555' } }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Send Verification Code'}
                            </Button>
                        </Stack>
                    </SectionWrapper>
                </form>
            ) : (
                <form onSubmit={handleVerifyCode}>
                    <SectionWrapper>
                         <Stack sx={{mb: 2}}>
                            <Typography variant="subtitle2" color="initial">
                                Verify your email
                            </Typography>
                            <Typography variant="body2" color="secondary">
                                Enter the code sent to <b>{`"${newEmail}"`}</b> to confirm the change
                            </Typography>
                        </Stack>
                        <Stack gap={3}>
                            <TextField
                                label="Verification Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{width: 'auto', alignSelf: 'flex-end', backgroundColor: '#333', color: '#fff', '&:hover': { backgroundColor: '#555' } }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Verify Email'}
                            </Button>
                        </Stack>
                    </SectionWrapper>
                </form>
            )}
        </Box>
    )
}

export default UpdateEmail
