import { Box, Stack, Collapse, Typography, Button, IconButton, Divider, SwipeableDrawer } from '@mui/material'
import {KeyboardArrowUpOutlined, KeyboardArrowDownOutlined} from '@mui/icons-material'
import React, { useState } from 'react'
import { SwiperSlide } from 'swiper/react'

const AuctionProductDetails = ({productId, onClose, auction}) => {
    console.log('DATA INSIDE DETALS', auction._id)
    const [showTop, setShowTop] = useState(false);
    const [open, setOpen] = useState(false)

    const handleTop = (id) => {
        setShowTop((prev) => ({
            ...prev,
            [id] : !prev[id]
        }))
    }
    return (
        <>
            <Stack>
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
                    <Stack>
                        <Stack>
                            
                        </Stack>
                    </Stack>
                    <Typography fontWeight='bold' in={!!showTop[auction._id]}>
                        {!!showTop[auction._id] ? 'Top Bidders:' : 'View top bidders'}
                    </Typography>
                    <IconButton aria-label=''>
                        {!!showTop[auction._id] ? <KeyboardArrowUpOutlined/> : <KeyboardArrowDownOutlined/> }
                    </IconButton>
                    <Button onClick={() => setOpen(true)}>Show top bidders</Button>
                </Box>
                <Box sx={{p: 1,}}>
                    <SwipeableDrawer
                        anchor="bottom"
                        open={open}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        swipeAreaWidth={40}
                        disableSwipeToOpen={false}
                        sx={{display: {xs: 'block', md: 'none'}}}
                        PaperProps={{
                            sx: {
                                borderRadius: '10px 10px 0px 0px',
                                height: '60vh',
                                minHeight: '10vh'
                            },
                        }}
                    >
                        {/*Content*/}
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
                    </SwipeableDrawer>
                    
                </Box>
            </Stack>
        </>
    )
}

export default AuctionProductDetails
