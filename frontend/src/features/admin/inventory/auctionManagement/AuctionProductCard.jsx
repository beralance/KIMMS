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
    Skeleton,
} from "@mui/material";
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined'
import KeyboardArrowUpOutlined from '@mui/icons-material/KeyboardArrowUpRounded'
import dayjs from "dayjs";
import UpdateDialog from '../components/UpdateDialog'
import UpdateDrawer from '../components/UpdateDrawer'

const AuctionProductCard = ({auction, }) => {
    const [showDetails, setShowDetails] = useState(false)
    const [loading, setLoading] = useState(true)
    const handleDetailsOpen = () => setShowDetails(true)
    const handleDetailsClose = () => setShowDetails(false)
    const [timeLeft, setTimeLeft] = useState("");

    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);


    useEffect(() => {
        const timer = setInterval(() => {
        const now = new Date();
        const end = new Date(auction.endTime);
        const diff = end - now;

        if (diff <= 0) {
            setTimeLeft("Ended");
            clearInterval(timer);
            return;
        }

        const h = Math.floor(diff / 1000 / 60 / 60);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${h}h ${m}m ${s}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [auction.endTime]);


    return (
        <>
            <Stack sx={{border: 0, boxShadow: '0', borderRadius: 2, minHeight: 100, maxHeight: 300}}>
                <Stack direction={'row'} sx={{display: 'flex', gap: 2, p: 1, '&:last-child': {pb: 1}}}>
                    <Grid container columnSpacing={2}>                      
                        <Grid size={{xs: 6}}>
                           
                            <Box sx={{cursor: 'pointer', position: 'relative'}} onClick={handleDetailsOpen}>
                                { loading && 
                                    <img 
                                        src={`/placeholder-image.svg`}
                                        onLoad={() => setLoading(false)}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                            aspectRatio: '1/1',
                                            borderRadius: 3,
                                            boxShadow: '5px 5px 10px -2px rgba(0, 0, 0, 0.5)'
                                        }} 
                                    />
                                }
                                <img 
                                    src={`${auction.inventoryId?.images[0]}`}
                                    alt={auction.inventoryId?.productName}
                                    onLoad={() => setLoading(false)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                        aspectRatio: '1/1',
                                        borderRadius: 3,
                                        boxShadow: '5px 5px 10px -2px rgba(0, 0, 0, 0.5)'
                                    }} 
                                />
                                <Box 
                                    sx={{
                                        position: 'absolute', 
                                        top: 10, 
                                        left: 5,
                                        px: 1,
                                        borderRadius: '999px',
                                        bgcolor: auction.status === 'LIVE' && 'error.main' || auction.status === 'PENDING' && 'primary.main' || auction.status === 'CLOSED' && 'warning.main' 
                                    }}
                                >
                                    <Typography variant='body2' fontSize={12} fontWeight={'bold'} color={'white'}>
                                        {auction.status}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{xs: 6}}>
                            <Box>
                                <Stack>
                                    <Typography variant="Body1" noWrap sx={{ fontWeight: 'bold'}}>
                                        {auction.inventoryId?.productName || "Unnamed Item"}
                                    </Typography>
                                </Stack>
                                <Divider sx={{my: .5, mb: 1}}/>
                                <Stack sx={{overflow: 'auto'}}>
                                    <Stack sx={{ height: '100%', maxWidth: 200, }}>
                                        <Typography variant="body2" color="secondary" fontWeight={'bold'}>
                                            {
                                                auction.status === 'LIVE' && 'Duration: ' ||
                                                auction.status === 'CLOSED' &&  'Ended At:' ||
                                                auction.status === 'PENDING' &&  'Startting At: '
                                            }
                                        </Typography>
                                        <Typography variant="body2" color="secondary" noWrap>
                                            {
                                                auction.status === 'LIVE' && timeLeft ||
                                                auction.status === 'CLOSED' && dayjs(auction.endTime).format('MMMM D, YYYY') ||
                                                auction.status === 'PENDING' && dayjs(auction.startTime).format('MMMM D, YYYY') 
                                            }
                                        </Typography>
                                        <Typography variant="body2" color="secondary" noWrap>
                                            {
                                                auction.status === 'CLOSED' && dayjs(auction.endTime).format(' h:mm A') ||
                                                auction.status === 'PENDING' && dayjs(auction.startTime).format(' h:mm A') 
                                            }
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Stack>
                
            </Stack>
            <UpdateDialog open={showDetails} onClose={handleDetailsClose} productData={auction} id={auction._id} title={auction.inventoryId?.productName} content={'auction-details'}/>
            <UpdateDrawer open={showDetails} onClose={handleDetailsClose} productData={auction} id={auction._id} title={auction.inventoryId?.productName} content={'auction-details'}/>
        </>
    )
}

export default AuctionProductCard
