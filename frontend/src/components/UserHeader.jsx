import React, { useEffect, useRef, useState } from "react";
import { 
  Box, Toolbar, Typography, Button, AppBar, 
  Slide, IconButton, Fade,
  Badge
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import SearchDrawer from "./SearchDrawer";
import UserDrawer from "./UserDrawer";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useCart } from "../contexts/CartContext"; 
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext";

// Icons
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import SearchIcon from '@mui/icons-material/Search'
import HomeRoudedIcon from '@mui/icons-material/HomeRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import SellRoundedIcon from '@mui/icons-material/SellRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LockOutlineIcon from '@mui/icons-material/LockOutline'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
 
function HideOnScroll ({children}) {
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    )
    }

    const navLinks = [
        { label: "Home", to: "/", icon: <HomeRoudedIcon /> },
        { label: "Shop", to: "/shop", icon: <ShoppingBagRoundedIcon /> },
        { label: "Auction", to: "/auction", icon: <SellRoundedIcon /> },
    ];

    const userLinks = [
        { label: 'Account', to: '/*', icon: < LockOutlineIcon/> },
        { label: 'My Purchases', to: '/*', icon: < ReceiptLongOutlinedIcon/> },
        { label: 'Notification', to: '/*', icon: < NotificationsOutlinedIcon/> },
    ]

export default function UserHeader() {
    const [userDrawerOpen, setUserDrawerOpen] = useState(false);
    const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
    const [navOpen, setNavOpen] = useState(false);    
    const {cartItems} = useCart();
    const isLoggedIn = !!localStorage.getItem('user')
    const navigate = useNavigate()
    const { user } = useAuth()
    const [showBg, setShowBg] = useState(false);
    const location = useLocation()

     useEffect(() => {
    const handleScroll = () => {
      // Show background only on home page after scrolling past 100vh
      if (location.pathname === "/") {
        setShowBg(false);
      } else {
        setShowBg(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // check immediately in case page loads scrolled down

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

    const handleUserDrawerClick = () => {
        if (!user) {
            navigate('/auth/login')
        }else {
            setUserDrawerOpen(true)
        }
    }
    return (
        <HideOnScroll>
            <AppBar 
                sx={{ 
                    bgcolor: 'transparent', 
                    width: "100%", 
                    position: 'fixed', 
                    px: { md: 5 },
                    boxShadow: 0,
                    top: -1,
                    height: { md: 65 },
                }} 
            >
                {/**/}
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    bgcolor: showBg ? 'white' : '#0000008e',
                    backdropFilter: showBg ? '' : 'blur(10px)',
                    WebkitMaskRepeat: "no-repeat",
                    zIndex: 0,
                    transition: 'all .5s ease',
                    boxShadow: '0px 1px 2px rgba(0,0,0,0.2)', 
                    overflow: "hidden",
                    WebkitMaskImage: navOpen ? (!showBg ? "linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)" : '') : '',
                    WebkitMaskSize: "cover",
                    maskImage: navOpen ? (!showBg ? "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)" : '') : '',
                    maskRepeat: "no-repeat",
                    maskSize: "cover",
                }} />
                <Toolbar sx={{ p: 0, display: "flex", justifyContent: "center"}}>

                    {/* Left side (mobile) */}
                    <Box sx={{ display: { sm: "none", xs: "flex" }, mx: 2, gap: 2, flexGrow: 1, justifyContent: "start" }}>
                        <IconButton onClick={() => setNavOpen(prev => !prev)} sx={{ p: 0 }}>
                            {!navOpen ? 
                                <MenuRoundedIcon color="secondary" sx={{ fontSize: 22, color: showBg ? 'black' : 'white' }} /> :
                                <CloseRoundedIcon color="grey"  sx={{color: showBg ? 'black' : 'white' }}/>
                            }
                        </IconButton>
                        <IconButton onClick={() => setSearchDrawerOpen(true)} sx={{ p: 0 }}>
                            <SearchIcon color="secondary" sx={{ fontSize: 22, color: showBg ? 'black' : 'white'}} />
                        </IconButton>
                    </Box>

                    {/* Brand */}
                    <Box sx={{ flexGrow: {xs: 1, md: 1} }}>
                        <Button component={NavLink} to='/' variant="text"
                            sx={{ color: "#37353E", p: { sm: 0, md: 0 }, display: 'flex', flexGrow: { xs: 2, sm: 1 } }}
                        >
                            <Typography variant="body1" color="initial" sx={{ fontWeight: 'thin', color: showBg ? 'black' : 'white', fontSize: { xs: 20, md: 22, lg: 24 }, display: {xs: 'flex', sm: 'none', md: 'flex'}}}>
                                K I M M S
                            </Typography>
                            <Box sx={{display: {xs: 'none', sm: 'block', md: 'none', width: 35}}}>
                                <img src="/kimms-logo.svg" alt="" style={{objectFit: 'cover', aspectRatio: '1/1', height: '100%', width: '100%'}}/>
                            </Box>
                        </Button>
                    </Box>

                    {/* Right side (mobile) */}
                    <Box sx={{ display: { sm: "none", xs: "flex" }, mx: 2, gap: 2, flexGrow: 1, justifyContent: "end" }}>
                        <IconButton onClick={handleUserDrawerClick} sx={{ p: 0 }}>
                            <PersonOutlinedIcon color="secondary" sx={{ fontSize: 22, color: showBg ? 'black' : 'white' }} />
                        </IconButton>
                        <Badge badgeContent={isLoggedIn ? cartItems.length : 0} color="secondary">
                            <IconButton component={NavLink} to='/cart' sx={{ p: 0 }}>
                                <ShoppingCartOutlinedIcon color="secondary" sx={{ fontSize: 22, color: showBg ? 'black' : 'white' }} />
                            </IconButton>
                        </Badge>
                    </Box>

                    {/* Desktop Search */}
                    <Box sx={{ flexGrow: {sm: 10, md: 4}, p: 0.5, display: { sm: "block", xs: "none" } }}>
                        <SearchBar height="2.5rem"/>
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{ flexGrow: {md: 1}, display: { sm: "flex", xs: "none" }, justifyContent: "end" }}>
                        {navLinks.map(({ label, to }) => (
                            <Button key={label} component={NavLink} to={to} color="inherit">
                                {label}
                            </Button>
                        ))}
                    </Box>

                    {/* Desktop icons */}
                    <Box sx={{ display: { sm: "flex", xs: "none" }, mx: 2, gap: 2, flexGrow: {md: 1}, justifyContent: "end" }}>
                        <IconButton onClick={handleUserDrawerClick} sx={{ p: 0 }}>
                            <PersonOutlinedIcon color="secondary" sx={{ fontSize: 22 }} />
                        </IconButton>
                        <Badge badgeContent={isLoggedIn ? cartItems.length : 0} color="secondary">
                            <IconButton component={NavLink} to='/cart' sx={{ p: 0 }}>
                                <ShoppingCartOutlinedIcon color="secondary" sx={{ fontSize: 22 }} />
                            </IconButton>
                        </Badge>
                    </Box>
                </Toolbar>

                {/* Mobile Collapsible Nav */}
                {navOpen ?
                    <Slide in={navOpen} direction="right" timeout={500}>
                        <Box sx={{ display: { xs: "block", sm: "none",}}}>
                            <Fade in={navOpen} timeout={300}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pb: navOpen ? 5 : 2 }}>
                                    {navLinks.map(({ label, to, icon }) => (
                                    <Button
                                        key={label}
                                        component={NavLink}
                                        to={to}
                                        color="inherit"
                                        startIcon={icon}
                                        onClick={() => setNavOpen(false)}
                                        sx={{ justifyContent: "flex-start",  p: 2, mx: 1}}
                                        style={({ isActive }) => ({
                                            backgroundColor: isActive ? ( showBg ? "#f0f0f038" : "#f0f0f02c") : "transparent",
                                            color: isActive ? (showBg ? 'black' : 'white') : ( showBg ? 'grey' : "white"),
                                            fontWeight: isActive ? "bold" : "normal",
                                            borderRadius: 5,
                                        })}
                                    >
                                        {label}
                                    </Button>
                                    ))}
                                </Box>
                            </Fade>
                        </Box>
                    </Slide>
                :
                    <></>    
                }
                {/* Search Drawer */}
                <SearchDrawer open={searchDrawerOpen} onClose={() => setSearchDrawerOpen(false)} />

                {/* User Drawer */}
                <UserDrawer open={userDrawerOpen} onClose={() => setUserDrawerOpen(false)} links={userLinks} />
            </AppBar>
        </HideOnScroll>
    );
}
