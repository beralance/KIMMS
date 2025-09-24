import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AdminBottomNav from './AdminBottomNav';
import { Button, Fade, Grow, Slide } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddAlt1Rounded from "@mui/icons-material/PersonAddAlt1Rounded";
import BarChartIcon from "@mui/icons-material/BarChart";
import { NavLink, useLocation } from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext'
import ConfirmDialog from '../../components/ConfirmDialog';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
  }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                [theme.breakpoints.down('md')]: {
                    marginLeft: 0,
                    width: '100%',
                },
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

export default function AdminSidebar({ children }) {
    const theme = useTheme();
    const location = useLocation();
    const [open, setOpen] = React.useState(false);
    const [logoutOpen, setLogoutOpen] = React.useState(false)
    const { logout } = useAuth()
    const {user} = useAuth()
    const [openLogoutDialog, setOpenLogoutDialog ] = React.useState(false)

    const handleLogoutOpen = () => setLogoutOpen(true);
    const handleLogoutCancel= () => setLogoutOpen(false);
    const handleLogoutConfirm = () =>  {
        logout()
        setLogoutOpen(false)
    }

    const menuItemsByRole = {
        admin:
            [
                { text: "Dashboard", icon: <DashboardIcon />, path: '/admin' },
                { text: "Inventory", icon: <InventoryIcon />, path: '/admin/inventory/manage-inventory' },
                { text: "Orders", icon: <ShoppingCartIcon />, path: '/admin/orders' },
                { text: "Reports", icon: <BarChartIcon />, path: '/admin/reports' },
                { text: "Staff", icon: <PersonAddAlt1Rounded />, path: '/admin/manage-staff' },
                
            ],
        staff:
            [
                { text: "Dashboard", icon: <DashboardIcon />, path: '/staff' },
                { text: "Inventory", icon: <InventoryIcon />, path: '/staff/inventory/manage-inventory' },
                { text: "Orders", icon: <ShoppingCartIcon />, path: '/staff/orders' },
                { text: "Reports", icon: <BarChartIcon />, path: '/staff/reports' },
            ]
    }
    const menuItems = menuItemsByRole[user?.role] || []

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const activeMenuItem = menuItems
        .filter(item =>
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/')
        )
        .sort((a, b) => b.path.length - a.path.length)[0];

    const isActive = (item) => activeMenuItem?.path === item.path;


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" color='secondary' open={open}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ marginRight: 5, display: { xs: 'none', md: !open ? 'flex' : 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Button component={NavLink} to='/admin' color='white'>
                        <Typography variant="body1">K I M M S</Typography>
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleLogoutOpen} variant='text' sx={{ display: { xs: 'flex', md: 'none' }, color: 'white', p: 0 }}>
                            <LogoutRoundedIcon />
                        </IconButton>

                        <Typography variant="body1" sx={{ display: { xs: 'none', md: 'flex' } }}>
                            Welcome
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer variant='permanent' open={open} 
                sx={{
                    display: { md: 'block', xs: 'none' },
                    '& .MuiDrawer-paper': { border: 'none', boxShadow: '1px 0px 1px rgba(0,0,0,0.3)' },
                }}
            >
                <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <img src="/kimms-logo.svg" alt="" style={{ width: '30px', marginInline: '10px' }} />
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>

                <List style={{display: 'flex', flexDirection: 'column', gap: 3}}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: "block",}}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                sx={[
                                    { minHeight: 48, px: 2.5 },
                                    open ? { justifyContent: "initial" } : { justifyContent: "center" },
                                    isActive(item) && {
                                        pl: open ? 3 : 2.5,
                                        borderRadius: 2,
                                        mx: 1,
                                        bgcolor: '#37353E',
                                        '& .MuiListItemIcon-root': { color: 'white' },
                                        '& .MuiListItemText-root': { fontWeight: 'bold', color: 'white' },
                                        '&:hover': {
                                            bgcolor: '#37353E', // change hover background
                                            '& .MuiListItemIcon-root': { color: 'white' },
                                            '& .MuiListItemText-root': { color: 'white' },
                                        },
                                    },
                                ]}
                            >
                                <ListItemIcon 
                                    sx={[
                                        { minWidth: 0, justifyContent: "center", color: "#37353E" },
                                        open ? { mr: 3 } : { mr: "auto" }
                                    ]}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <Fade in={open} timeout={{enter: 800, exit: 100}} mountOnEnter unmountOnExit>
                                    <ListItemText primary={item.text} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
                                </Fade>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
                    <Button variant='contained' fullWidth onClick={handleLogoutOpen}
                        sx={[
                            { px: 2.5, mb: 2 },
                            open ? { justifyContent: 'center', mx: 2, bgcolor: '#37353E' } :
                            { justifyContent: 'initial', bgcolor: 'transparent', color: 'black', boxShadow: 'none' },
                        ]}
                    >
                        <LogoutRoundedIcon sx={[{ justifyContent: 'center' }, open ? { mr: 2 } : { mr: 0 }]} />
                        <Typography sx={[open ? { opacity: 1 } : { opacity: 0 }]}>Logout</Typography>
                    </Button>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
                <DrawerHeader />
                <Box sx={{mb: 10}}>
                    {children}
                </Box>
                <AdminBottomNav />
            </Box>

            <ConfirmDialog
                open={logoutOpen}
                title='Confirm Logout'
                content='Are you sure you want to log out?'
                confirmText='Logout'
                cancelText='Cancel'
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
        </Box>
    );
}
