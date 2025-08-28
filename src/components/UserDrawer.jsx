import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export default function UserDrawer({ open, onClose, links = [], anchor = "left", width = 300 }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleClick = (to, action) => {
        if (action) action(); // optional custom action, e.g., logout
        if (to) navigate(to); // optional navigation
        onClose();
    };

    return (
        <Drawer anchor={anchor} open={open} onClose={onClose}>
            <Box
                sx={{ width }}
                role="presentation"
                onKeyDown={(event) => {
                if (event.key === "Tab" || event.key === "Shift") return;
                onClose();
                }}
            >
                <List>
                    {links.map(({ label, to, action }) => (
                    <ListItem key={label} disablePadding>
                        <ListItemButton onClick={() => handleClick(to, action)}>
                            <ListItemText primary={label} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>

                {/* Footer / User info */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        bgcolor: "primary.main",
                        color: "white",
                        mt: 2,
                    }}
                >
                <Typography variant="h6">My App</Typography>

                {user ? (
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Typography>{user.name}</Typography>
                        <Button variant="contained" color="secondary" onClick={logout}>
                            Logout
                        </Button>
                    </Box>
                    ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
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
