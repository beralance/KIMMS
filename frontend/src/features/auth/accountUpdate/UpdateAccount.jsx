import React from 'react'
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { AlignJustify, ChevronRightIcon, DraftingCompassIcon, InboxIcon, LockKeyholeIcon, MailIcon, MapPinHouseIcon, PenIcon, UserCog, UserCogIcon} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import SectionWrapper from '../../../components/SectionWrapper'
import { useAuth } from '../../../contexts/AuthContext'

const options = [
    {key: 0, path: '/account/update-address', label: 'My Address', icon: <MapPinHouseIcon/>, divide: <Divider sx={{my: 1}}/>},
    {key: 1, path: '/account/update-information', label: 'Basic Information', icon: <UserCogIcon/>, divide: <Divider sx={{my: 1}}/>},
    {key: 2, path: '/account/update-email', label: 'Email address', icon: <MailIcon/>, divide: <Divider sx={{my: 1}}/>},
    {key: 3, path: '/account/update-password', label: 'Update password', icon: <LockKeyholeIcon/>},
]

const UpdateAccount = () => {
    const navigate = useNavigate()
    const {user} = useAuth()

    const filteredOptions = options.filter(o => {
        if (user?.googleId && (o.path === '/account/update-password' || o.path === '/account/update-email')) return false;
        return true
    })

    return (
        <nav>
            <Stack gap={2} sx={{p: 2, bgcolor: 'white'}}>
                <Stack>
                    <Typography variant='subtitle1' color="initial" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        Manage Account Information
                        <PenIcon/>
                    </Typography>
                    <Typography variant="body2" color="secondary">
                        Update your personal information and manage your account preferences
                    </Typography>
                </Stack>
                <List>
                    <Stack sx={{px: 1}}>
                        {filteredOptions.map((o) => 
                            <Box key={o.key}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => navigate(o.path)}  sx={{px: 1, py: 2, borderRadius: 2}}>
                                        <Stack alignItems={'center'} justifyContent={'space-between'} direction={'row'} sx={{width: '100%'}}>
                                            <Stack gap={2} direction={'row'} alignItems={'center'}>
                                                {o.icon}
                                                <Typography variant='body1' color='secondary'>{o.label}</Typography>
                                            </Stack>
                                            <ChevronRightIcon/>
                                        </Stack>
                                    </ListItemButton>
                                </ListItem>
                                {o.divide}
                            </Box>
                        )}
                    </Stack>
                </List>
            </Stack>
        </nav>
    )
}

export default UpdateAccount
