import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Badge, Stack, Divider, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatNumber } from '../../../../utils/stringUtils'
import { BanknoteArrowUpIcon, Timer, TimerIcon } from 'lucide-react';

export default function AuctionPreviewCard({ product, getTimeRemaining, onNavigate }) {
    const { name = 'Unknown', price = 0, image, condition = 'new', status, remainingTime = 0 } = product;
    const [timeLeft, setTimeLeft] = useState(remainingTime);

    
    return (
        <Box>
            {/* Name & Badge */}
            <Stack gap={2} sx={{ p: 1, boxShadow: 5, borderRadius: 2 }}>
                <Box sx={{position: 'relative'}}>
                    <img 
                        src={`${product.inventoryId?.images[0]}`} 
                        alt={product.inventoryId?.productName}
                        style={{
                            display: 'block',
                            objectFit: 'cover',
                            width: '100%',
                            borderRadius: '5px',
                            height: '100%',
                            aspectRatio: '9/10',
                        }}    
                    />
                    <Typography variant='body' color='white' sx={{position: 'absolute', bgcolor: 'error.main', px: 2, borderRadius: '999px', top: 10, right: 10}}>
                        {product.status}
                    </Typography>
                </Box>
                <Stack gap={2} sx={{px: 1}}>
                    <Stack>
                        <Typography variant="subtitle1" gutterBottom>{product.inventoryId?.productName || "Unnamed Item"}</Typography>
                        <Stack direction={'row'}>
                            <Typography variant="body2" color="initial" sx={{px: 1, border: '1px solid gray', borderRadius: '999px'}}>
                                {product.inventoryId?.category?.name}
                            </Typography>
                            <Divider orientation='vertical' flexItem sx={{mx: 1,}}/>
                            <Typography variant="body2" color="initial" sx={{px: 1, border: '1px solid gray', borderRadius: '999px'}}>
                                {product.inventoryId?.condition}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Grid container spacing={1}>
                        <Grid size={{xs: 6}}>  
                            <Stack sx={{bgcolor: '#f0f0f0', borderRadius: 1}}>                    
                                <Typography variant="body2" color='initial' sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <BanknoteArrowUpIcon/>
                                    Starting Price
                                </Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography variant="body2" color='secondary'>
                                    Php {formatNumber(product.reservePrice)} 
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid size={{xs: 6}}>     
                            <Stack sx={{bgcolor: '#f0f0f0', borderRadius: 1}}>                 
                                <Typography variant="body2" color="initial" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <TimerIcon/>
                                    Ends in
                                </Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography variant="body2" color="secondary">
                                    {getTimeRemaining(product.endTime)}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
                <Button
                    disabled={(new Date(product.endTime) - new Date()) >= new Date()}
                    component={Link}
                    to={`/auction/listing/product-preview/${product._id}`} 
                    variant="contained"
                    color="secondary"
                >
                    Preview
                </Button>
            </Stack>
        </Box>
    );
}
