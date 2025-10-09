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
import CustomPopover from '../components/CustomPopover'
import ProfilePicker from "./ProfilePicker";

export default function UserDrawer({ open, onClose, links = [], anchor = "right" }) {
    const navigate = useNavigate();
    const [showPicker, setShowPicker] = React.useState(false)
    const {user, logout, login} = useAuth();
    const [currentUser, setCurrentUser] = React.useState(user);
    const [loading, setLoading] = React.useState()
    const handlePickerOpen = () => setShowPicker(true)
    const handlePickerClose = () => setShowPicker(false)

    const token = user?.token
    const avatar = user?.avatar || '/user-placeholder.svg'
    const fullname = user?.fullName || 'Guest'
    const userId = user?.userId

    const storeAvatarToLocal = (avatar) => {
        login ({avatar})
    }
    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await user
            setLoading(false)
        }
        loadData()
    }, [])

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
                        <Stack alignItems={'center'} justifyContent={'center'} sx={{py: 2}}>
                            <Stack sx={{width: 100, height: 100, mb: 1, borderRadius: '999px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', overflow: 'hidden'}}>
                                <img 
                                    onClick={handlePickerOpen}
                                    alt={fullname}
                                    src={avatar}
                                    style={{ width: '100%', height: '100%', aspectRatio: '1/1', objectFit: 'cover'}}
                                />
                            </Stack>
                            <Stack justifyContent={'center'}>
                                <Typography variant="body1" color="secondary" sx={{ fontWeight: 'bold' }}>
                                    {user.fullName}
                                </Typography>
                                <CustomPopover 
                                    trigger={
                                        <Typography variant="body2" align="center" color="grey" sx={{cursor: 'pointer'}}>
                                            { user.isLocal ? 'Local' : 'International'}
                                        </Typography>
                                    }
                                >
                                    <Stack gap={1} sx={{py: 1}}>
                                        <Typography variant="body2" align="start" color="grey">
                                            <b>Local:</b> <br />Local user can buy and browser all products available both small and large items
                                        </Typography>
                                        <Typography variant="body2" align="start" color="grey">
                                            <b>International:</b> <br /> Products shown are only small items 
                                        </Typography>
                                    </Stack>
                                </CustomPopover>
                            </Stack>
                        </Stack>

                        {/* Links */}
                        <Divider sx={{m: 2}}/>
                        <List>
                            {links.map(({ label, to, action, icon }) => (
                                <ListItem key={label} disablePadding>
                                    <ListItemButton onClick={() => handleClick(to, action)} sx={{ display: 'flex', alignItems: 'center', p: 2, py: 1 }}>
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
            <ProfilePicker open={showPicker} handleClose={handlePickerClose} avatar={avatar} userId={userId} token={token} onAvatarUpdate={(updated) => storeAvatarToLocal(updated)}/>
        </Drawer>
    );
}
