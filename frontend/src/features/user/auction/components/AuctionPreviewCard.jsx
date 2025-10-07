import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Badge } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AuctionPreviewCard({ product, getTimeRemaining, onNavigate }) {
    const { name = 'Unknown', price = 0, image, condition = 'new', status, remainingTime = 0 } = product;
    const [timeLeft, setTimeLeft] = useState(remainingTime);

    
    return (
        <Card>
            <Box>
                {/* Name & Badge */}
                <CardContent sx={{ gap: 1 }}>
                    <Box>
                        <img 
                            src={`${product.inventoryId?.images[0]}`} 
                            alt={product.inventoryId?.productName}
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                aspectRatio: '1/1'
                            }}    
                        />
                    </Box>
                    <Typography variant="h6">{product.inventoryId?.productName || "Unnamed Item"}</Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        {product.inventoryId?.description || product.description || "No description"}
                    </Typography>
                    <Typography variant="body1">
                        Current Bid: ₱{product.reservePrice} {/* replace with top bid if needed */}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Ends in: {getTimeRemaining(product.endTime)}
                    </Typography>
                    <Button
                        component={Link}
                        to={`/auction/listing/product-preview/${product._id}`} 
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Preview
                    </Button>
                </CardContent>
            </Box>
        </Card>
    );
}
