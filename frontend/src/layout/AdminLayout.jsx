import { Box, Container, Stack, Typography } from '@mui/material'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from '../features/admin/AdminSidebar'
import AutoSlideCarousel from '../components/AutoSlideCarousel'
import { useEffect } from 'react'
import {useSnackbar} from '../contexts/SnackbarContext'
import { useAuth } from '../contexts/AuthContext'
import { useRef } from 'react'
import { useState } from 'react'

const AdminLayout = () => {
    const navigate = useNavigate()
    const {showSnackbar} = useSnackbar()
    const {user, logout} = useAuth()
    const [logoutNotif, setLogoutNotif] = useState(false)

    useEffect(() => {
        let timeout;
        let interval;
        const duration = 15 * 60 * 1000; // 15 minutes
        const warningTime = 1 * 60 * 1000 // 1 minute before logout
        const startTime = Date.now();

        let warned = false

        const handleLogout = () => {
            console.log("⏰ Session expired — logging out");
            setLogoutNotif(true)
            showSnackbar('Session expired due to inactivity.', 'warning')
            localStorage.removeItem('user')
            if (user.role === 'admin' || user.role === 'staff') logout();
            setLogoutNotif(false)
        }

        const checkWarning = (elapsed) => {
            const remaining = duration - elapsed;
            if (!warned && remaining <= warningTime) {
                showSnackbar('You will be logged out in 1 minute due to inactivity.', 'warning')
                warned = true;
            }
        }

        const resetTimer = () => {
            clearTimeout(timeout)
            clearInterval(interval)
            warned = false;

            const resetTime = Date.now()

            timeout = setTimeout(handleLogout, duration);

            // display countdown every 10s
            interval = setInterval(() => {
                const elapsed = Date.now() - resetTime;
                const remaining = Math.max(duration - elapsed, 0);
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);

                checkWarning(elapsed)

                console.log(`🕒 Session expires in: ${minutes}m ${seconds}s`);
            }, 10000);
        }

        // first start
        resetTimer();

        // track user activity
        const activityEvents = ['mousemove', 'keypress', 'click', 'scroll'];
        activityEvents.forEach(event => window.addEventListener(event, resetTimer));

        return () => {
            activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [user, logout, setLogoutNotif]);

    return (
        <Box>
            <AdminSidebar>
                <Outlet/>
            </AdminSidebar>
        </Box>
    )
}

export default AdminLayout
