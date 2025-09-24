import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Stack, Divider } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export default function UserDrawer({ open, onClose, links = [], anchor = "right" }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleClick = (to, action) => {
        if (action) action();
        if (to) navigate(to);
        onClose();
    };

    return (
        <Drawer anchor={anchor} open={open} onClose={onClose}>
            <Box
                sx={{ width: {xs: 300, lg: 400}, height: '100%', display: 'flex', flexDirection: 'column' }}
                role="presentation"
                onKeyDown={(event) => {
                    if (event.key === "Tab" || event.key === "Shift") return;
                    onClose();
                }}
            >
                {!user ? (
                    <Stack sx={{ alignItems: 'center', my: 3, mx: 2 }}>
                        <img src="/kimms-logo-full.svg" alt="kimms-logo-full.svg" style={{ width: 150 }} />
                        <Typography variant="body1" color="secondary" sx={{ mt: 1, mb: 5 }}>
                            Welcome! Log in to get full access.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={() => { navigate("/auth/login"); onClose(); }}
                            sx={{ mb: 1 }}
                        >
                            Login
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={() => { navigate("/auth/signup"); onClose(); }}
                        >
                            Signup
                        </Button>
                    </Stack>
                ) : (
                    <>
                        {/* User Info */}
                        <Box sx={{ p: 2, px: 4, display: 'flex', gap: 3, alignItems: 'center', my: 2 }}>
                            <Avatar
                                alt={user.fullName}
                                src="https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg"
                                sx={{ width: 56, height: 56 }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {user.fullName}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Links */}
                        <Divider sx={{m: 2}}/>
                        <List>
                            {links.map(({ label, to, action, icon }) => (
                                <ListItem key={label} disablePadding>
                                    <ListItemButton onClick={() => handleClick(to, action)} sx={{ display: 'flex', alignItems: 'center', p: 2, py: 1.5 }}>
                                        <Box sx={{ pr: 2 }}>{icon}</Box>
                                        <Typography variant="body2">{label}</Typography>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>

                        {/* Logout Button */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, mt: 'auto' }}>
                            <Button variant="contained" fullWidth color="secondary" onClick={logout}>
                                Logout
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Drawer>
    );
}
