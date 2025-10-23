import React, { useContext } from 'react'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const RecentPurchase = ({userOrders}) => {
    const navigate = useNavigate()

    const recentProducts = userOrders
        .flatMap(order =>
            order.products.map(product => ({
            ...product,
            date: order.createdAt, // attach order date
            }))
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));


    return (
        <Box>
            <Stack gap={2}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography variant="body1" color="initial">Recently Purchased</Typography>
                    <IconButton onClick={() => navigate('/my-purchases')}>
                        <ChevronRightIcon/>
                    </IconButton>
                </Stack>
                <Stack direction="row" gap={2} sx={{overflowY: 'auto', width: '100%'}}>
                    {recentProducts.length > 0 ? (
                        recentProducts.slice(0, 5).map((product) => (
                            <Stack key={product.productId?._id} alignItems="center" gap={2}>
                                <Box onClick={() => navigate(`/product/sold/${product.productId?._id}`)} sx={{ cursor: 'pointer', width: 150, overflow: 'hidden', borderRadius: 1 }}>
                                    <img
                                        src={product.productId?.images?.[0]}
                                        alt={product.productId?.productName}
                                        style={{
                                        display: 'block',
                                        aspectRatio: '9/10',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                                <Stack>
                                    <Typography variant="body2" textAlign={'center'} gutterBottom>{product.productId?.productName}</Typography>
                                </Stack>
                            </Stack>
                        ))
                    ) : (
                        <Typography>No recent purchases</Typography>
                    )}
                </Stack>
            </Stack>
        </Box>
    )
}

export default RecentPurchase
