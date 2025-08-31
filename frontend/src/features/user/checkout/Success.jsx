// pages/Success.jsx
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../../contexts/CartProvider';

export default function Success() {
    const navigate = useNavigate();
    const location = useLocation();
    const { removeFromCart } = useCart();

    // Items that were purchased
    const purchasedItems = JSON.parse(localStorage.getItem('pendingPurchase') || '[]')
    localStorage.removeItem('pendingPurchase')
    purchasedItems.forEach(item => removeFromCart(item.id))
    const handleBack = () => {
        purchasedItems.forEach(item => removeFromCart(item.id));
        navigate('/'); // back to shop
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Payment Successful!
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Thank you for your purchase.
            </Typography>
            <Button variant="contained" onClick={handleBack}>
                Back to Shop
            </Button>
        </Container>
    );
}
