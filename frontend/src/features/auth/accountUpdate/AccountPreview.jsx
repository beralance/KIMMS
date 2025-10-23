import React, { useContext } from 'react'
import { PenIcon } from 'lucide-react'
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useActionData, useNavigate } from 'react-router-dom'
import {toTitleCase} from '../../../utils/stringUtils'
import { OrderContext } from '../../../contexts/OrderContext'
import { useAuth } from '../../../contexts/AuthContext'
import RecentPurchase from './RecentPurchase'
import SectionWrapper from '../../../components/SectionWrapper'
import Recommendation from '../../../components/Recommendation'

const AccountPreview = () => {
    const {user} = useAuth()
    const {orders} = useContext(OrderContext)
    const navigate = useNavigate()

    const userOrders = (orders || []).filter(order => order.userId?._id === user.userId)
    const userAddress = `${user.address?.street}, ${user.address?.city}, ${user.address?.province}, Region ${user.address?.region}, ${user.address?.postalCode}, ${user.address?.country}`

    return (
        <Stack sx={{ p: 2}} >
            <Stack gap={2}>
                <SectionWrapper sx={{gap: 3, overflow: 'hidden'}}>
                    <Box
                        sx={{
                            bgcolor: '#9CAFAA',
                            height: '35vh',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            m: -2,
                        }}
                    >
                        <Stack
                            sx={{
                                position: 'absolute',
                                top: 0, bottom: 0, left: 0, right: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Box sx={{width: 120, height: 120, overflow: 'hidden', borderRadius: '999px', boxShadow: 5}}>
                                <img 
                                    src={user.avatar} 
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: '100%',
                                        aspectRatio: '1/1'
                                    }}
                                />
                            </Box>
                            <Stack>
                                <Typography variant="h6" color="white" align='center'>{user.fullName}</Typography>
                                <Typography variant="body2" color="white" align='center'>{user.isLocal ? 'Local' : 'International'} user</Typography>
                            </Stack>
                        </Stack>
                        <Stack sx={{position: 'absolute', bottom: 10, right: 10, bgcolor: 'white', overflow: 'hidden', borderRadius: '999px'}}>
                            <IconButton variant='outlined' color='secondary' onClick={() => navigate('/account/update')}>
                                <Stack gap={1} alignItems={'center'} direction={'row'}>
                                    <PenIcon/>
                                </Stack>
                            </IconButton>
                        </Stack>
                    </Box>
                    <Stack sx={{p: 1}}>
                        <Stack>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant="body1" color="initial">Email address:</Typography>
                                <Typography variant="body1" color="gray">{user.email || 'noname@test.com'}</Typography>
                            </Stack>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant="body1" color="initial">Gender:</Typography>
                                <Typography variant="body1" color="gray">{user.gender || 'other'}</Typography>
                            </Stack>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography variant="body1" color="initial">Phone number:</Typography>
                                <Typography variant="body1" color="gray">{user.phoneNumber || 'xxxxxxxxxxx'}</Typography>
                            </Stack>
                            <Divider sx={{my: 1.5}}/>
                            <Stack>
                                <Typography variant="body1" color="initial">Address:</Typography>
                                <Typography variant="body1" color="gray" sx={{p: 1}}>{toTitleCase(userAddress) || 'No address'}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </SectionWrapper>
                <Box>
                    {userOrders.length > 0 &&                    
                        <SectionWrapper>
                            <RecentPurchase userOrders={userOrders}/>
                        </SectionWrapper>
                    }
                </Box>
                <SectionWrapper>
                    <Recommendation/>
                </SectionWrapper>
            </Stack>
        </Stack>
    )
}

export default AccountPreview
