import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Box } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { PersonAddAlt1Rounded } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function LabelBottomNavigation() {
    const location = useLocation()
    const {user, token} = useAuth()

    const navItemsByRole = {
        admin:[
                { label: "Dashboard", value: "dashboard", icon: <DashboardIcon />, path: '/admin' },
                { label: "Inventory", value: "inventory", icon: <InventoryIcon />, path: '/admin/inventory/manage-inventory' },
                { label: "Orders", value: "orders", icon: <ShoppingCartIcon />, path: '/admin/orders' },
                { label: "Reports", value: "reports", icon: <BarChartIcon />, path: '/admin/reports' },
                { label: "Staff", value: "staff", icon: <PersonAddAlt1Rounded />, path: '/admin/manage-staff' },
            ],
        staff:[
                { label: "Dashboard", value: "dashboard", icon: <DashboardIcon />, path: '/staff' },
                { label: "Inventory", value: "inventory", icon: <InventoryIcon />, path: '/staff/inventory/manage-inventory' },
                { label: "Orders", value: "orders", icon: <ShoppingCartIcon />, path: '/staff/orders' },
                { label: "Reports", value: "reports", icon: <BarChartIcon />, path: '/staff/reports' },
            ]
    }
    const navItems = navItemsByRole[user?.role] || []

    const currentValue = (() => {
        const inventoryPaths = [
            "/admin/inventory/manage-inventory",
            "/admin/inventory/manage-product",
            "/admin/inventory/manage-auction",
            "/staff/inventory/manage-inventory",
            "/staff/inventory/manage-product",
            "/staff/inventory/manage-auction",
        ];

        if (inventoryPaths.some((path) => location.pathname.startsWith(path))) {
            return "inventory"; // must match navItems' value
        }

        const matched = navItems
            .filter(
                (item) =>
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/")
            )
            .sort((a, b) => b.path.length - a.path.length)[0];

        return matched?.value || "dashboard";
    })();
    
    return (
        <Box
            sx={{
                display: { xs: "block", md: "none" },
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
            }}
        >
            <BottomNavigation
                sx={{ width: "100%",  }}
                value={currentValue}
            >
                {navItems.map((item) => (
                    <BottomNavigationAction
                        component={NavLink}
                        to={item.path}
                        key={item.value}
                        label={item.label}
                        value={item.value}
                        icon={item.icon}
                        sx={{
                            px: 0,
                            transition: 'all 0.5 ease',
                            "&.Mui-selected": {
                                color: "black",
                            },
                            "&:hover .MuiSvgIcon-root": {
                                color: "black",
                            },
                        }}
                    />
                ))}
            </BottomNavigation>
        </Box>
    );
}
