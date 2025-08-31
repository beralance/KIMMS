import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export default function UserDrawer({ open, onClose, links = [], anchor = "right", width = 300 }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleClick = (to, action) => {
        if (action) action(); // optional custom action, e.g., logout
        if (to) navigate(to); // optional navigation
        onClose();
    };


    // add body1 to text
    // add avatar
    // add username

    return (
        <Drawer anchor={anchor} open={open} onClose={onClose}>
            <Box
                sx={{ width, height: '100%', display: 'flex', flexDirection: 'column' }}
                role="presentation"
                onKeyDown={(event) => {
                if (event.key === "Tab" || event.key === "Shift") return;
                onClose();
                }}
            >
                <Box sx={{p: 2, px: 4, display: 'flex', gap: 3, alignItems: 'center', my: 2}}>
                    <Avatar
                        alt={user ? user.name : 'Guest'}
                        src="https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?cs=srgb&dl=pexels-tony-james-andersson-249384-1674752.jpg&fm=jpg"
                        sx={{ width: 56, height: 56,}}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'white', width: '100%', justifyContent: 'center'}}>
                       
                        <Typography variant="body1" color="initial" sx={{fontWeight: 'bold'}}>
                            {user ? user.name : 'Guest'}
                        </Typography>
                    </Box>
                </Box>
                <hr style={{marginLeft: '20px', marginRight: '20px'}}/>
                <List>
                    {links.map(({ label, to, action, icon }) => (
                    <ListItem key={label} disablePadding>
                        <ListItemButton onClick={() => handleClick(to, action)} sx={{ display: 'flex', alignItems: 'center', p: 2, py: 1.5}}>
                            <Box sx={{pr: 2}}>{icon}</Box>
                            <Typography variant="body2" color="initial">{label}</Typography>
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>

                {/* Footer / User info */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 2,
                        color: "white",
                        mt: 'auto',
                    }}
                >
                    {user ? (
                        <Box sx={{ display: "flex", width: '100%', flexDirection: 'column' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </Box>
                        ) : (
                        <Box sx={{ display: "flex", width: '100%', flexDirection: 'column', gap: 1 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                navigate("/auth/login");
                                onClose();
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                navigate("/auth/signup");
                                onClose();
                                }}
                            >
                                Signup
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}
