import * as React from 'react';
import { Box, Container, IconButton, Stack } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboardIcon, Package2, PackageIcon, UserPenIcon, ChartColumnBigIcon } from 'lucide-react';

export default function CustomBottomNav() {
    const location = useLocation();
    const { user } = useAuth();

    const navItemsByRole = {
        admin: [
            { value: "dashboard", icon: <LayoutDashboardIcon style={{width: '18px'}}/>, path: '/admin' },
            { value: "inventory", icon: <Package2 style={{width: '18px'}}/>, path: '/admin/inventory/manage-inventory' },
            { value: "orders", icon: <PackageIcon style={{width: '18px'}}/>, path: '/admin/orders' },
            { value: "reports", icon: <ChartColumnBigIcon style={{width: '18px'}}/>, path: '/admin/reports' },
            { value: "staff", icon: <UserPenIcon style={{width: '18px'}}/>, path: '/admin/manage-staff' },
        ],
        staff: [
            { value: "dashboard", icon: <LayoutDashboardIcon style={{width: '18px'}}/>, path: '/staff' },
            { value: "inventory", icon: <Package2 style={{width: '18px'}}/>, path: '/staff/inventory/manage-inventory' },
            { value: "orders", icon: <PackageIcon style={{width: '18px'}}/>, path: '/staff/orders' },
            { value: "reports", icon: <ChartColumnBigIcon style={{width: '18px'}}/>, path: '/staff/reports' },
        ]
    };
    const navItems = navItemsByRole[user?.role] || [];

    const currentValue = (() => {
        const inventoryPaths = [
            "/admin/inventory/manage-inventory",
            "/admin/inventory/manage-product",
            "/admin/inventory/manage-auction",
            "/staff/inventory/manage-inventory",
            "/staff/inventory/manage-product",
            "/staff/inventory/manage-auction",
        ];
        if (inventoryPaths.some(path => location.pathname.startsWith(path))) return "inventory";
        const matched = navItems
            .filter(item => location.pathname === item.path || location.pathname.startsWith(item.path + "/"))
            .sort((a, b) => b.path.length - a.path.length)[0];
        return matched?.value || "dashboard";
    })();

    return (
        <Box
            sx={{
                display: { xs: "flex", md: "none" },
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'center',
                overflowX: 'scroll',
                width: '100%',
                scrollBehavior: 'smooth',
                zIndex: 1000,

            }}
        >
            <Box
                sx={{
                    borderRadius: '999px',
                    display: 'flex',
                    boxShadow: '0px 2px 10px 1px rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 'auto',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    my: 1,
                    mt: 2,
                    p: .5,
                    px: 5,
                }}
            >
                <Stack direction={'row'} position={'relative'} justifyContent={'center'} alignContent={'center'} sx={{flex: 1, minWidth: 300}}>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            height: 3,
                            width: `${100 / navItems.length}%`,
                            bgcolor: 'rgba(255, 255, 255, 1)',
                            borderRadius: '999px',
                            transition: 'transform 0.3s ease',
                            transform: `translateX(${navItems.findIndex(i => i.value === currentValue) * 100}%)`,
                            zIndex: 0,
                        }}
                    />

                    {navItems.map(item => (
                        <IconButton
                            key={item.value}
                            component={NavLink}
                            to={item.path}
                            sx={{
                                flex: 1,
                                transition: 'color 0.3s ease',
                                '&:hover': { color: 'black' },
                                maxWidth: 'none',
                                mb: currentValue === item.value ? 1 : 0,
                                py: 1.5,
                                px: 0,
                                zIndex: 1, // above highlight
                            }}
                        >
                            {React.cloneElement(item.icon, {
                                color: currentValue === item.value ? 'transparent' : 'white',
                                strokeWidth: '3',
                                transition: 'all .5s ease',
                                width: '10px',
                                fill: currentValue === item.value ? 'white' : 'none',
                                transform: currentValue === item.value ? 'scale(1.4)' : 'none',
                            })}
                        </IconButton>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
