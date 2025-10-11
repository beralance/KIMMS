import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Divider,
    Collapse, IconButton,
    Stack,
    Grow,
    ButtonGroup,
} from "@mui/material";
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined'
import KeyboardArrowUpOutlined from '@mui/icons-material/KeyboardArrowUpRounded'
import dayjs from "dayjs";
import UpdateDialog from '../components/UpdateDialog'
import UpdateDrawer from '../components/UpdateDrawer'

const AuctionProductCard = ({auction, }) => {
    const [showDetails, setShowDetails] = useState(false)
    
    const handleDetailsOpen = () => setShowDetails(true)
    const handleDetailsClose = () => setShowDetails(false)

    return (
        <>
            <Stack sx={{border: 0, boxShadow: '0', borderRadius: 2, height: 'auto'}}>
                <Stack direction={'row'} sx={{display: 'flex', gap: 2, p: 1, '&:last-child': {pb: 1}}}>
                    <Box sx={{width: {xs: '50%'}, cursor: 'pointer'}} onClick={handleDetailsOpen}>
                        <img 
                            src={`${auction.inventoryId?.images[0]}`}
                            alt={auction.inventoryId?.productName}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                aspectRatio: '1/1',
                                borderRadius: 3,
                                boxShadow: '5px 5px 10px -2px rgba(0, 0, 0, 0.5)'
                            }} 
                        />
                    </Box>
                    <Box sx={{ width: {xs: '50%'}}}>
                        <Stack>
                            <Typography variant="Body1" noWrap sx={{ fontWeight: 'bold'}}>
                                {auction.inventoryId?.productName || "Unnamed Item"}
                            </Typography>
                        </Stack>
                        <Divider sx={{my: 1, mb: 1.5}}/>
                        <Stack sx={{maxHeight: 100, overflow: 'auto'}}>
                            <Typography variant='body2' >
                                <b>Starting Price:</b> {auction.startPrice || "Unnamed Item"}
                            </Typography>
                            <Typography variant='body2' >
                                <b>Reserve Price:</b> {auction.reservePrice || "Unnamed Item"}
                            </Typography>
                            <Typography variant="body2" color="initial">
                                Date Created: {dayjs(auction.createdAt).format('MMMM D, YYYY')}
                            </Typography>
                            <Typography variant="body2" color="initial">
                                Starting Time: {dayjs(auction.startTime).format('MMMM D, YYYY')}
                            </Typography>
                            <Typography variant="body2" color="initial">
                                End Time: {dayjs(auction.endTime).format('MMMM D, YYYY')}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
                
            </Stack>
            <UpdateDialog open={showDetails} onClose={handleDetailsClose} productData={auction} id={auction._id} title={auction.inventoryId?.productName} content={'auction-details'}/>
            <UpdateDrawer open={showDetails} onClose={handleDetailsClose} productData={auction} id={auction._id} title={auction.inventoryId?.productName} content={'auction-details'}/>
        </>
    )
}

export default AuctionProductCard
