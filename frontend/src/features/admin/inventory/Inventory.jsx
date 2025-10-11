import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddItemButton from './components/AddItemButton';
import ManagementDialog from './components/ManagementDialog';
import ManagementDrawer from './components/ManagementDrawer';
import SearchBar from './components/SearchBar';
import { Collapse, Container, IconButton, Stack, Typography } from '@mui/material';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {Outlet} from 'react-router-dom'

export default function Inventory() {
    const [searchTerm, setSearchTerm] = React.useState('')
    const location = useLocation()
    const pathParts = location.pathname.split('/')
    const tabValue = pathParts[3] || 'manage-inventory'
    const [value, setValue] = React.useState(tabValue);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openGuide, setOpenGuide] = React.useState(true)

    const handleOpenDialog = () => setOpenDialog(true)
    const handleCloseDialog = () => setOpenDialog(false)
    
    React.useEffect(() => {
        setValue(tabValue)
    }, [location.pathname])

    React.useEffect(() => {
        if (location.state?.openDialog) {
            setOpenDialog(true);
        }
    }, [location.state])
    return (
        <Box>
            <Box
                sx={{
                    backgroundImage: 'url(/modern-styled-entryway.jpg)',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    top: 0, left: 0, right: 0, bottom: 0,
                    height: 'auto',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    width: '100%',
                }}
            >
                <Container sx={{p: 2, backdropFilter: 'blur(10px)', height: '100%'}}>
                    <SearchBar 
                        value={searchTerm}
                        onChange={setSearchTerm}
                        activeTab={value}
                    />
                    <Box sx={{p: 2, borderRadius: 5, py: 3, pb: 16}}>
                        <Stack direction={'row'} alignItems={'center'}>
                            <Typography variant="body1" color="white" fontWeight={'bold'}>
                                Quick Overview 
                            </Typography>
                        </Stack>
                        <Collapse in={openGuide}>
                            <Typography variant="body2" color="white">
                                <b>Inventory: </b> Storage area for all products. Items stay here until posted for sale or auction.
                            </Typography>
                            <Typography variant="body2" color="white">
                                <b>Product: </b> Storefront where products from inventory are published and made visible for direct purchase.
                            </Typography>
                            <Typography variant="body2" color="white">
                                <b>Auction: </b> Bidding section where items from inventory are listed with starting price, and duration.
                            </Typography>
                        </Collapse>
                    </Box>
                </Container>
            </Box>
            <Box 
                sx={{
                    height: "100%",
                    color: "white",
                    mt: -10,
                    backdropFilter: 'blur(10px)',
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '10px 10px 0px 0px',
                    boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.2)',
                }}
            >
                <Box>
                    <Box sx={{ borderBottom: 1, borderColor: '#FAFAFA'}}>
                        <Tabs
                            sx={{overflowX: 'auto',  color: 'white', width: '100%', scrollBehavior: 'smooth'}}
                            value={value}
                            variant='scrollable'
                            aria-label="basic tabs example"
                            TabIndicatorProps={{ 
                                style: {
                                    height: '100%',
                                    backgroundColor: 'gray',
                                    color: 'black',
                                    borderRadius: '10px 10px 0px 0px',
                                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%)',
                                } 
                            }} 
                            textColor="inherit"
                        >
                            <Tab 
                                label="Manage Inventory" 
                                value='manage-inventory' 
                                component={Link} to='manage-inventory'
                                variant='scrollable'
                                sx={{ 
                                    opacity: 1,
                                    bgcolor: 'transparent',
                                    borderRadius: '0px 0px 10px 10px',
                                    zIndex: 1,
                                    "&.Mui-selected": {bgcolor: '#fafafa', borderRadius: '10px 10px 0px 0px', color: "black", fontWeight: 'bold'},
                                }}
                            />
                            <Tab 
                                label="Manage Product" 
                                value='manage-product' 
                                component={Link} to='manage-product'
                                variant='scrollable'
                                sx={{ 
                                    opacity: 1,
                                    borderRadius: '0px 0px 10px 10px',
                                    zIndex: 1,
                                    bgcolor: 'transparent',
                                    "&.Mui-selected": {bgcolor: '#fafafa', borderRadius: '10px 10px 0px 0px', color: "black", fontWeight: 'bold'},
                                }}
                            />
                            <Tab 
                                label="Manage Auction" 
                                value='manage-auction' 
                                component={Link} to='manage-auction'
                                sx={{
                                    opacity: 1,
                                    bgcolor: 'transparent',
                                    borderRadius: '0px 0px 10px 10px',
                                    zIndex: 1,
                                    "&.Mui-selected": {bgcolor: '#fafafa', borderRadius: '10px 10px 0px 0px', color: "black", fontWeight: 'bold'},
                                }}
                            />
                        </Tabs>
                    </Box>

                    <Container maxWidth={'lg'} sx={{pt: 3, pb: 30, bgcolor: '#FAFAFA'}}>
                        <Outlet context={{searchTerm, setSearchTerm}}/>
                    </Container>
                </Box>
            </Box>
            <AddItemButton onOpen={handleOpenDialog} open={openDialog}/>
            
            <Box sx={{display: {xs: 'block', md: 'none'}}}>
                <ManagementDrawer open={openDialog} onClose={handleCloseDialog} activeTab={value}/>
            </Box>

            <ManagementDialog open={openDialog} onClose={handleCloseDialog} activeTab={value}/>
        </Box>
    );
}
