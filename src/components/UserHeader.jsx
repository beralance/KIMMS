import React, { useState } from "react";
import { Box, Toolbar, Typography, Button, List, ListItem, ListItemButton, ListItemText, AppBar } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import UserDrawer from "./UserDrawer";
import NavDrawer from "./NavDrawer";

// Icons
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseIcon from "@mui/icons-material/Close";

const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Cart", to: "/cart" },
    { label: "Auction", to: "/auction" },
];
const userLinks = [
    {label: 'Profile', to: '/*'},
    {label: 'Cart', to: '/*'},
    {label: 'Orders', to: '/*'},
    {label: 'Logout', to: '/*'},
]
export default function UserHeader() {
    const [userDrawerOpen, setUserDrawerOpen] = useState(false);
    const [navDrawer, setNavDrawer] = useState(false);

    const navigate = useNavigate();

    const handleMenuClick = () => setNavDrawer((prev) => !prev);

    const handleLinkClick = (to) => {
        navigate(to);
        setNavDrawer(false); // auto-close drawer on link click
    };

    return (
        <Box sx={{ width: "100%", my: 1 }}>
            <Toolbar sx={{ p: 0, display: "flex", justifyContent: "center"} }>
                
                {/* User Drawer Button (mobile) */}
                <Box sx={{ display: { sm: "none", xs: "flex" }, flexGrow: 1, justifyContent: "start" }}>
                    <Button onClick={() => setUserDrawerOpen(true)}>
                        <PersonRoundedIcon sx={{ fontSize: "1.5rem" }} color="action" />
                    </Button>
                </Box>

                {/* Brand */}
                <Box sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                        flexGrow: { sm: 1, xs: 2 },
                        fontSize: "1.5rem",
                        display: "flex",
                        justifyContent: { sm: "start", xs: "center" },
                        }}
                    >
                        <Button component={NavLink} to='/' variant="text">
                            KIMMS
                        </Button>
                    </Typography>
                </Box>

                {/* Hamburger Menu Button (mobile) */}
                <Box sx={{ display: { sm: "none", xs: "flex" }, flexGrow: 1, justifyContent: "end" }}>
                    <Button onClick={handleMenuClick}>
                        {navDrawer ? (
                        <CloseIcon sx={{ fontSize: "1.5rem" }} color="action" />
                        ) : (
                        <MenuRoundedIcon sx={{ fontSize: "1.5rem" }} color="action" />
                        )}
                    </Button>
                </Box>

                {/* Desktop Search */}
                <Box sx={{ flexGrow: 3, p: 0.5, display: { sm: "block", xs: "none" } }}>
                    <SearchBar height="2.5rem" />
                </Box>

                {/* Desktop Navigation */}
                <Box sx={{ flexGrow: 1, display: { sm: "flex", xs: "none" }, justifyContent: "end" }}>
                    {navLinks.map(({ label, to }) => (
                        <Button key={label} component={NavLink} to={to} color="inherit">
                            {label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>

            {/* Mobile Search */}
            <Box sx={{ p: 0.5, display: { sm: "none", xs: "block" } }}>
                <SearchBar height="3rem" />
            </Box>

            {/* User Drawer */}
            <UserDrawer open={userDrawerOpen} onClose={() => setUserDrawerOpen(false)} links={userLinks}/>

            {/* Menu Drawer (mobile) */}
            <NavDrawer open={navDrawer} width={200} anchor="top" onClose={() => setNavDrawer(false)} links={navLinks}/>
        </Box>
    );
}
