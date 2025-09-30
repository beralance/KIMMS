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
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";
import {UPLOADS_URL} from '../../../../utils/constants'
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined'
import KeyboardArrowUpOutlined from '@mui/icons-material/KeyboardArrowUpRounded'
import { RefreshRounded } from '@mui/icons-material'

const AdminAuctionMonitor = ({searchTerm}) => {
    const [auctions, setAuctions] = useState([]);
    const { token } = useAuth()
    const [showTop, setShowTop] = useState(false);

    const handleTop = (id) => {
        setShowTop((prev) => ({
            ...prev,
            [id] : !prev[id]
        }))
    }

    const fetchAuctions = async () => {
        try {
        const res = await axios.get("http://localhost:5000/api/auctions", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setAuctions(res.data);
        } catch (err) {
            console.error("Failed to fetch auctions:", err);
        }
    };

    const filteredAuctions = auctions.filter(auction => {
        if (!searchTerm) return true;

        const search = searchTerm.toLowerCase();

        return (
            auction.inventoryId?.productName?.toLowerCase().includes(search) ||
            auction._id?.toLowerCase().includes(search) ||
            auction.winner?.toLowerCase().includes(search)
        )
    })

    useEffect(() => {
        fetchAuctions();
    }, []);


    return (
        <Box>
            {/*refresh button*/}
             <IconButton
                sx={{ mt: 1 }}
                onClick={fetchAuctions} // refresh list
            >
                <RefreshRounded sx={{color: '#37353E'}}/>
            </IconButton>
            <Grid container spacing={3} >
                {filteredAuctions.length > 0 ? (
                    filteredAuctions.map((auction) => (
                        <Grid size={{xs: 12, md: 6,}} key={auction._id}>
                            <Box
                                onClick={() => handleTop(auction._id)} 
                                sx={{
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    px: 1, 
                                    py: 0.5,
                                    borderRadius: 1,
                                }}
                            >
                                <Typography fontWeight='bold'>
                                    {!!showTop[auction._id] ? 'Top Bidders:' : 'View top bidders'}
                                </Typography>
                                <IconButton aria-label=''>
                                    {!!showTop[auction._id] ? <KeyboardArrowUpOutlined/> : <KeyboardArrowDownOutlined/> }
                                </IconButton>
                            </Box>
                            <Card sx={{border: 0, boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)', borderRadius: 2, height: 'auto'}}>
                                <CardContent sx={{display: 'flex', height: {xs: 300}, gap: 1, p: 1, '&:last-child': {pb: 1}}}>
                                    <Box sx={{width: {xs: '50%'}}}>
                                        <img 
                                            src={`${UPLOADS_URL}${auction.inventoryId?.images[0]}`}
                                            alt={auction.inventoryId?.productName}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '5px',
                                                boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)'
                                            }} 
                                        />
                                    </Box>
                                    <Box sx={{ width: {xs: '50%'}, my: 1, overflow: 'auto'}}>
                                        <Typography variant="Body1" noWrap gutterBottom sx={{ fontWeight: 'bold'}}>
                                            {auction.inventoryId?.productName || "Unnamed Item"}
                                        </Typography>
                                        <Typography variant='body2' >
                                            <b>Starting Price:</b> {auction.startPrice || "Unnamed Item"}
                                        </Typography>
                                        <Typography variant='body2' colo><b>Status:</b> {auction.status}</Typography>
                                        <Typography variant='body2'><b>Winner:</b> {auction.winner || "No winner yet"}</Typography>
                                    </Box>
                                </CardContent>
                                <Box sx={{p: 1,}}>
                                    <Collapse orientation="vertical" in={!!showTop[auction._id]}>
                                        {auction.topBidders?.length > 0 ? (
                                            auction.topBidders.map((bid, idx) => (
                                                <Box key={idx}>
                                                    <Box>
                                                        <Box sx={{display: 'flex', justifyContent: 'center', bgcolor: '#37353E', borderRadius: 1, py: 0.5}}>
                                                            <Typography variant="body1" color="white">
                                                                Top {idx + 1}
                                                            </Typography>
                                                        </Box>
                                                        <Typography noWrap>
                                                            <b>User:</b> {bid.userId}
                                                        </Typography>
                                                        <Typography key={idx}>
                                                            Bid: ₱{bid.amount}
                                                        </Typography>
                                                        <Box sx={{display: 'flex', justifyContent: 'flex', mt: 1}}>
                                                            {auction.winner === bid.userId && 
                                                                <Button variant="outlined" fullWidth color="secondary">
                                                                    <Typography variant="body1">
                                                                        Process
                                                                    </Typography>
                                                                </Button>
                                                            }
                                                        </Box>
                                                    </Box>
                                                    <Divider/>
                                                </Box>
                                            ))

                                        ) : (
                                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                                <Typography>No bids yet</Typography>
                                            </Box>
                                        )}
                                    </Collapse>
                                </Box>
                            </Card>
                        </Grid>
                    )))
                    :
                    (
                        <Stack alignItems={'center'}  sx={{mt: 5, width: '100%'}}>
                            <Grow in={true} mountOnEnter unmountOnExit timeout={800}>
                                <img src="/shocked-shock.svg" alt="shocked-shock" style={{ paddingBottom: '10px', width: 80, opacity: .8,}}/>
                            </Grow>
                            <Typography variant="body1" fontWeight={'bold'} color="secondary"> No Results found </Typography>
                            <Typography variant="body2" color="grey"> 
                                Click the + button to start an auction
                            </Typography>
                        </Stack>
                )}
            </Grid>
        </Box>
    );
};

export default AdminAuctionMonitor;
