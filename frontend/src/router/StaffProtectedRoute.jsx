import React, {Children, useEffect, useState} from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'
import {useAuth} from '../contexts/AuthContext'
import {} from '@mui/icons-material'
import {Box, CircularProgress, Fade, Grow, Stack, Typography} from '@mui/material'


const StaffProtectedRoute = ({moduleName, children}) => {
    const {user, token} = useAuth()
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(true)
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchPermissions = async () => {
            if (!user) return;
            if (user.role === 'staff') {
                try{ 
                    const res = await axios.get(`${API_URL}/api/staff-permissions/${user.userId}`, {
                        headers: {Authorization: `Bearer ${token}`}
                    })
                    setPermissions(res.data.allowedModules || []);
                }
                catch (err) {
                    console.error(err)
                    setPermissions([])
                }
            }
            setLoading(false)
        }
        fetchPermissions()
    }, [user, token])

    if (loading) {
        return (
            <Box display='flex' justifyContent='center' height='90vh' alignItems='center' mt={4}>
                <CircularProgress/>
            </Box>
        )
    }

    if (!user) return <Navigate to="/auth/login" replace />;
    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

    console.log('MODULE NAMES ADDED: ', moduleName)
    console.log('permissions GIVEN: ', permissions)

    if (user.role === 'admin') return children || <Outlet/>

    //staff access check
    if(user.role === 'staff' && moduleName && !permissions.includes(moduleName)) {
        return (
            <Stack height={'40vh'} sx={{display: 'flex', mt: 5, justifyContent: 'center', alignItems: 'center'}}>
                <Grow in={true} unmountOnExit mountOnEnter timeout={800}>
                    <Box sx={{width: 80}} >
                        <img 
                            src="/warning-rhomb-filled-svgrepo-com.svg" 
                            alt="warning-rhomb-filled-svgrepo-com"
                            style={{
                                width: '100%',
                                objectFit: 'cover',
                                opacity: '.8',
                            }} 
                        />
                    </Box>
                </Grow>
               
                <Fade in={true} unmountOnExit mountOnEnter timeout={600}>
                    <Stack alignItems={'center'} justifyContent={'center'} >
                        <Typography variant='h6' fontWeight='bold' color='secondary'>
                            Content Hidden
                        </Typography>
                        <Typography variant='subtitle2' color='grey'>
                            You need admin approval to access this section
                        </Typography>
                    </Stack>
                </Fade>
            </Stack>
        )
    }
    if(user.role !== 'staff' && !permissions.includes(moduleName)) {
        return <Navigate to="*" replace /> 
    }

    return children || <Outlet/>;
}

export default StaffProtectedRoute
