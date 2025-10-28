import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, Stack, Container, Divider, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import SectionWrapper from "../../../components/SectionWrapper";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { formatNumber } from '../../../utils/stringUtils'
import {getBidders} from '../../../utils/bidApi'

import dayjs from 'dayjs'
import { UsersRoundIcon } from "lucide-react";

const AuctionProductDetails = () => {
    const { id } = useParams();
    const {showSnackbar} = useSnackbar()
    const [auction, setAuction] = useState(null);
    const [highestBid, setHighestBid] = useState(0);
    const [allBidders, setAllBidders] = useState(0)
    const [currentBid, setCurrentBid] = useState(0)
    const [bidAmount, setBidAmount] = useState("");
    const [message, setMessage] = useState("");
    const [timeRemaining, setTimeRemaining] = useState("");
    const { user } = useAuth()
    const token = user.token
    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch auction and current highest bid
    const fetchAuction = async () => {
        try {
            const auctionRes = await axios.get(`${API_URL}/api/auctions/${id}`);

            const bidRes = await axios.get(`${API_URL}/api/bids/${id}`, {
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            setAuction(auctionRes.data);


            const topBid = bidRes.data.length > 0 ? bidRes.data[0].amount : auctionRes.data.startPrice;
            setHighestBid(topBid);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        fetchAuction();
        const interval = setInterval(fetchAuction, 15000); // poll every 15s
        return () => clearInterval(interval);
    }, [id, token]);

    // Timer for countdown
    useEffect(() => {
        const timer = setInterval(() => {
            if (auction) {
                const total = new Date(auction.endTime) - new Date();
                if (total <= 0) {
                    setTimeRemaining("Auction ended");
                    clearInterval(timer);
                } else {
                    const hours = Math.floor(total / (1000 * 60 * 60));
                    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((total % (1000 * 60)) / 1000);
                    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [auction]);

    
    useEffect(() => {
        if (!auction?._id || !token) return;
        const getAllBidders = async () => {
            try {
                const data = await getBidders(auction._id, token)
                setAllBidders(data.length)

                const userBid = data.find(bid => bid.userId?._id === user.userId)
                console.log('Bidders data', userBid)

                setCurrentBid(userBid ? userBid.amount : 0)
                console.log('Bidders data', data)
            }
            catch (err){
                console.error('Error getting bidders', err)
                showSnackbar('Error getting bidders', 'error')
            }
        }
        getAllBidders()
    }, [auction, token, user.userId])

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        if (!auction || auction.status !== "LIVE") {
            setMessage("Auction is not active");
            return;
        }

        const minAllowed = highestBid + auction.minIncrement;
        if (!bidAmount || Number(bidAmount) < minAllowed) {
            setMessage(`Bid must be at least ₱${formatNumber(minAllowed)}`);
            return;
        }

        
        try {
            await axios.post(
                `${API_URL}/api/bids`,
                { auctionId: id, amount: Number(bidAmount) },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage("Bid placed successfully!");
            setBidAmount("");
            fetchAuction();
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to place bid");
        }
    };


    if (!auction) return <Typography>Loading auction...</Typography>;
    

    return (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Stack>
                <Stack>
                    <Box sx={{position: 'relative'}}>
                        <img 
                            src={`${auction.inventoryId?.images[0]}`} 
                            alt={auction.inventoryId?.productName}
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                                display: 'block',
                                aspectRatio: '1/1',
                            }}    
                        />
                        <Stack sx={{position: 'absolute', bottom: 10, right: 10, borderRadius: 2, overflow: 'hidden', }}>
                            <Typography variant="body1" color="white" sx={{display: 'flex', alignItems: 'center', p: 2, px: 5, bgcolor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)', gap: 1}}>
                                <UsersRoundIcon style={{color: 'white'}}/> 
                                {allBidders}
                            </Typography>
                        </Stack>
                            
                    </Box>
                    <Container sx={{bgcolor: '#f0f0f0', pt: 2, pb: 5}}>
                        <Stack gap={2}>
                            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Stack sx={{minWidth: '80%'}} direction={'row'} gap={2} alignItems={'center'}>
                                    <Box sx={{height: 40, width: 5, bgcolor: 'secondary.main'}}/>
                                    <Typography variant="h5">{auction.inventoryId?.productName || "Unnamed Item"}</Typography>
                                </Stack>
                            </Stack>
                            <Divider/>
                            <Stack gap={3}>
                                <Box>
                                    <form onSubmit={handleBidSubmit}>
                                        <SectionWrapper sx={{gap: 2}}>
                                            <Stack>
                                                <Typography variant="subtitle1" color="secondary">Place Bid</Typography>
                                                <Typography variant="body2" color="gray">Submit your offer for this auction</Typography>
                                            </Stack>
                                            <Stack direction={'row'} gap={2}>
                                                <TextField
                                                    label={currentBid ? `Your Bid: Php ${formatNumber(currentBid)}` : 'Add amount'}
                                                    type="number"
                                                    disabled={currentBid}
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    fullWidth
                                                    margin="normal"
                                                    sx={{bgcolor: 'white', m: 0}}
                                                    required={!currentBid}
                                                />
                                                <Button sx={{width: '30%'}} disabled={currentBid} type="submit" variant="contained" color="secondary">
                                                    Bid
                                                </Button>
                                            </Stack>
                                        </SectionWrapper>
                                    </form>
                                </Box>
                                <SectionWrapper sx={{gap: 2}}>
                                    <Stack>
                                        <Typography variant="body1" color="secondary">Auction Overview</Typography>
                                        <Typography variant="body2" color="gray">
                                            Overview of auction timeline and pricing
                                        </Typography>
                                    </Stack>
                                    <Grid container spacing={1}>
                                        <Grid size={{xs: 6}}>
                                            <Stack sx={{ p: 1, borderRadius: 1}}>                        
                                                <Typography variant="body2">Starting Price</Typography>
                                                <Typography variant="subtitle2">Php {formatNumber(auction.reservePrice)}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid size={{xs: 6}}>
                                            <Stack sx={{ p: 1, borderRadius: 1}}>
                                                <Typography variant="body2">Current Bid</Typography>
                                                <Typography variant="subtitle2">Php {formatNumber(currentBid)}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid size={{xs: 6}}>
                                            <Stack sx={{ p: 1, borderRadius: 1}}>                        
                                                <Typography variant="body2">Date Created</Typography>
                                                <Typography variant="subtitle2">{dayjs(auction.createdAt).format('MMMM DD YYYY')}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid size={{xs: 6}}>
                                            <Stack sx={{ p: 1, borderRadius: 1}}>                        
                                                <Typography variant="body2">Time Remaining</Typography>
                                                <Typography variant="subtitle2">{timeRemaining}</Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </SectionWrapper>
                            </Stack>
                        </Stack>

                        

                        {message && (
                            <Typography sx={{ mt: 2 }} color={message.includes("success") ? "green" : "red"}>
                                {message}
                            </Typography>
                        )}
                    </Container>
                </Stack>
            </Stack>
        </Box>
    );
};

export default AuctionProductDetails;
