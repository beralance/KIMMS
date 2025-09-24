import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddItemButton from './components/AddItemButton';
import ManagementDialog from './components/ManagementDialog';
import ManagementDrawer from './components/ManagementDrawer';
import SearchBar from './components/SearchBar';
import { Collapse, Container, IconButton, Stack, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {Outlet} from 'react-router-dom'
import { InfoOutlineRounded, InfoRounded } from '@mui/icons-material';


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

    const handleOpenGuide = () => setOpenGuide(true)
    const handleCloseGuide = () => setOpenGuide(false)

    React.useEffect(() => {
        setValue(tabValue)
    }, [location.pathname])

    return (
        <Box sx={{mt: 2}}>
            <Container maxWidth={'xl'}>
                <SearchBar 
                    value={searchTerm}
                    onChange={setSearchTerm}
                    activeTab={value}
                />
                <Box sx={{py: 2, px: 1}}>
                    <Stack direction={'row'} alignItems={'center'}>
                        <Typography variant="body1" color="grey" fontWeight={'bold'}>
                            Quick Overview 
                        </Typography>
                        <IconButton onClick={() => setOpenGuide(!openGuide)}>
                            {!openGuide ? <InfoOutlineRounded color='secondary'/> : <InfoRounded/>}
                        </IconButton>
                    </Stack>
                    <Collapse in={openGuide}>
                        <Typography variant="body2" color="grey">
                            <b>Inventory: </b> Storage area for all products. Items stay here until posted for sale or auction.
                        </Typography>
                        <Typography variant="body2" color="grey">
                            <b>Product: </b> Storefront where products from inventory are published and made visible for direct purchase.
                        </Typography>
                        <Typography variant="body2" color="grey">
                            <b>Auction: </b> Bidding section where items from inventory are listed with starting price, and duration.
                        </Typography>
                    </Collapse>
                </Box>
            </Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    aria-label="basic tabs example"
                    TabIndicatorProps={{ style: { backgroundColor: '#37353E',} }} // selected tab indicator color
                    textColor="inherit" // inherit to override default primary
                >
                    <Tab 
                        label="Manage Inventory" 
                        value='manage-inventory' component={Link} to='manage-inventory'
                        sx={{ 
                            '& .MuiTab-wrapper span': {
                                mr: 4,
                            },
                            fontWeight: value === 'manage-inventory' ? 'bold' : 'normal',
                            color: value === 'manage-inventory' ? '#37353E' : 'text.secondary', // change active/inactive tab color
                        }}
                    />
                    <Tab 
                        label="Manage Product" 
                        value='manage-product' component={Link} to='manage-product'
                        sx={{ 
                            fontWeight: value === 'manage-product' ? 'bold' : 'normal',
                            color: value === 'manage-product' ? '#37353E' : 'text.secondary',
                        }}
                    />
                    <Tab 
                        label="Manage Auction" 
                        value='manage-auction' component={Link} to='manage-auction'
                        sx={{ 
                            fontWeight: value === 'manage-auction' ? 'bold' : 'normal',
                            color: value === 'manage-auction' ? '#37353E' : 'text.secondary',
                        }}
                    />
                </Tabs>
            </Box>

            <Container maxWidth={'xl'} sx={{mt: 3}}>
                <Outlet context={{searchTerm, setSearchTerm}}/>
            </Container>

            <AddItemButton onOpen={handleOpenDialog} open={openDialog}/>

            <Box sx={{display: {xs: 'block', md: 'none'}}}>
                <ManagementDrawer open={openDialog} onClose={handleCloseDialog} activeTab={value}/>
            </Box>

            <ManagementDialog open={openDialog} onClose={handleCloseDialog} activeTab={value}/>
        </Box>
    );
}
